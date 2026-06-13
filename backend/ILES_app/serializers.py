from django.db import IntegrityError, transaction
from rest_framework import serializers
from .models import Company, CustomUser, Student, Supervisor, Admin, InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria, Feedback, Notification

class CustomUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    course_title = serializers.CharField(required=False, write_only=True, allow_blank=True)
    university_name = serializers.CharField(required=False, write_only=True, allow_blank=True)
    year_of_study = serializers.IntegerField(required=False, write_only=True, allow_null=True)
    place_of_work = serializers.CharField(required=False, write_only=True, allow_blank=True)
    department = serializers.CharField(required=False, write_only=True, allow_blank=True)
    staff_ID = serializers.CharField(required=False, write_only=True, allow_blank=True)

    class Meta:
        model = CustomUser 
        fields = [
            'name',
            'role',
            'ID_number',
            'telephone_number',
            'email',
            'username',
            'password',
            'is_verified',
            'email_verified_at',
            'course_title',
            'university_name',
            'year_of_study',
            'place_of_work',
            'department',
            'staff_ID',
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'required': True, 'allow_blank': False},
            'email': {'required': True},
            'is_verified': {'read_only': True},
            'email_verified_at': {'read_only': True},
        }


    def validate(self, attrs):
        role = attrs.get("role")
        if isinstance(role, str):
            role = role.strip()
            attrs["role"] = role

        if role in (None, ""):
            raise serializers.ValidationError({"role": "Role is required."})

        if role == "student":
            required_fields = ["course_title", "university_name", "year_of_study"]
        elif role == "supervisor":
            required_fields = ["place_of_work", "department", "staff_ID"]
        elif role == "admin":
            required_fields = ["department"]
        else:
            raise serializers.ValidationError({"role": "Select a valid role."})

        
        errors = {}
        for field in required_fields:
            value = attrs.get(field)
            if isinstance(value, str):
                value = value.strip()
                attrs[field] = value
            if value in (None, ""):
                errors[field] = "This field is required."

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def update(self, instance, validated_data):
        profile_fields = [
            'course_title',
            'university_name',
            'year_of_study',
            'place_of_work',
            'department',
            'staff_ID',
        ]
        profile_data = {f: validated_data.pop(f) for f in profile_fields if f in validated_data}

        # Update password if provided.
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()

        if profile_data:
            role = instance.role
            if role == "student":
                Student.objects.filter(users=instance).update(**profile_data)
            elif role == "supervisor":
                place_of_work = profile_data.pop("place_of_work", None)
                if place_of_work:
                    company, _ = Company.objects.get_or_create(name=place_of_work)
                    profile_data["place_of_work"] = company
                Supervisor.objects.filter(users=instance).update(**profile_data)
            elif role == "admin":
                Admin.objects.filter(users=instance).update(**profile_data)

        return instance

    def _unique_conflict(self, field_name, value, message):
        if value in (None, ""):
            return

        lookup = {f"{field_name}__iexact": value} if field_name in {"email", "username"} else {field_name: value}
        queryset = CustomUser.objects.filter(**lookup)

        if self.instance and self.instance.pk:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(message)

    def validate_email(self, value):
        self._unique_conflict("email", value, "A user with this email already exists.")
        return value

    def validate_username(self, value):
        self._unique_conflict("username", value, "A user with this username already exists.")
        return value

    def validate_ID_number(self, value):
        self._unique_conflict("ID_number", value, "A user with this ID number already exists.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        role = validated_data["role"]
        profile_data = {}

        if role == "student":
            profile_data = {
                "course_title": validated_data.pop("course_title", None),
                "university_name": validated_data.pop("university_name", None),
                "year_of_study": validated_data.pop("year_of_study", None),
            }
        elif role == "supervisor":
            place_of_work_name = validated_data.pop("place_of_work", None)
            if isinstance(place_of_work_name, str):
                place_of_work_name = place_of_work_name.strip()
            if not place_of_work_name:
                raise serializers.ValidationError({"place_of_work": "This field is required."})
            place_of_work = None
            place_of_work, _ = Company.objects.get_or_create(name=place_of_work_name)
            profile_data = {
                "place_of_work": place_of_work,
                "department": validated_data.pop("department", None),
                "staff_ID": validated_data.pop("staff_ID", None),
            }
        elif role == "admin":
            profile_data = {
                "department": validated_data.pop("department", None),
            }

        try:
            user = CustomUser.objects.create_user(**validated_data)

            if role == "student":
                Student.objects.create(users=user, **profile_data)
            elif role == "supervisor":
                Supervisor.objects.create(users=user, **profile_data)
            elif role == "admin":
                Admin.objects.create(users=user, **profile_data)

            return user
        except (IntegrityError, TypeError, ValueError) as exc:
            message = str(exc).lower()
            if "email" in message:
                raise serializers.ValidationError({"email": "A user with this email already exists."})
            if "username" in message:
                raise serializers.ValidationError({"username": "A user with this username already exists."})
            if "id_number" in message:
                raise serializers.ValidationError({"ID_number": "A user with this ID number already exists."})
            if "place_of_work" in message or "supervisor" in message:
                raise serializers.ValidationError({"place_of_work": "Please provide a valid place of work."})
            raise serializers.ValidationError("Unable to create account. Please check your details and try again.")


class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='users.username', read_only=True)
    name = serializers.CharField(source='users.name', read_only=True)
    ID_number = serializers.CharField(source='users.ID_number', read_only=True)
    telephone_number = serializers.CharField(source='users.telephone_number', read_only=True)
    student_user_id = serializers.IntegerField(source='users.id', read_only=True)
    supervisor_id = serializers.IntegerField(source='assigned_supervisor.id', read_only=True)
    supervisor_name = serializers.CharField(source='assigned_supervisor.users.name', read_only=True)
    placement = serializers.SerializerMethodField()

    def get_placement(self, obj):
        placement = InternshipPlacement.objects.filter(student=obj).order_by('-id').first()
        if not placement:
            return None

        return {
            'place_of_internship': placement.place_of_internship.name,
            'department': placement.department,
            'supervisor_name': placement.supervisor_name,
            'start_date': placement.start_date,
            'end_date': placement.end_date,
        }

    class Meta:
        model = Student 
        fields = [
            'id',
            'student_user_id',
            'users',
            'username',
            'name',
            'ID_number',
            'telephone_number',
            'course_title',
            'university_name',
            'year_of_study',
            'assigned_supervisor',
            'supervisor_id',
            'supervisor_name',
            'placement',
        ]


class SupervisorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='users.username', read_only=True)
    name = serializers.CharField(source='users.name', read_only=True)
    supervisor_user_id = serializers.IntegerField(source='users.id', read_only=True)
    place_of_work = serializers.CharField(source='place_of_work.name', read_only=True)
    assigned_students_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Supervisor
        fields = [
            'id',
            'supervisor_user_id',
            'users',
            'username',
            'name',
            'place_of_work',
            'department',
            'staff_ID',
            'assigned_students_count',
        ]

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['users', 'department']

class InternshipPlacementSerializer(serializers.ModelSerializer):
    place_of_internship = serializers.CharField()

    class Meta:
        model = InternshipPlacement
        fields = '__all__'
        read_only_fields = ['student']

    def create(self, validated_data):
        company_name = validated_data.pop('place_of_internship')
        company, _ = Company.objects.get_or_create(name=company_name)
        validated_data['place_of_internship'] = company
        return super().create(validated_data)

    def update(self, instance, validated_data):
        company_name = validated_data.pop('place_of_internship', None)
        if company_name:
            company, _ = Company.objects.get_or_create(name=company_name)
            validated_data['place_of_internship'] = company
        return super().update(instance, validated_data)

    def validate(self, attrs):
        start_date = attrs.get('start_date', getattr(self.instance, 'start_date', None))
        end_date = attrs.get('end_date', getattr(self.instance, 'end_date', None))

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                'end_date': 'End date must be on or after the start date.'
            })

        return attrs

class WeeklylogSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.users.name', read_only=True)
    student_user_id = serializers.IntegerField(source='student.users.id', read_only=True)
    supervisor_name = serializers.CharField(source='supervisor.users.name', read_only=True)

    class Meta:
        model = WeeklyLog
        fields = [
            'id',
            'student_name',
            'student_user_id',
            'week_number',
            'description',
            'date_submitted',
            'supervisor',
            'supervisor_name',
            'supervisor_comment',
            'evaluation_score',
            'reviewed_at',
            'status',
        ]
        read_only_fields = [
            'student',
            'supervisor',
            'supervisor_comment',
            'evaluation_score',
            'reviewed_at',
            'status',
            'student_name',
            'student_user_id',
            'supervisor_name',
        ]

class EvaluationSerializer(serializers.ModelSerializer):
    weekly_log_id = serializers.IntegerField(source='weekly_log.id', read_only=True)
    criteria_name = serializers.CharField(source='criteria.criteria_name', read_only=True)
    criteria_type = serializers.CharField(source='criteria.criteria', read_only=True)
    criteria_weight = serializers.FloatField(source='criteria.criteria_weight', read_only=True)

    class Meta:
        model = Evaluation
        fields = [
            'id',
            'user',
            'placement',
            'weekly_log',
            'weekly_log_id',
            'criteria',
            'criteria_name',
            'criteria_type',
            'criteria_weight',
            'score',
            'comment',
            'evaluation_date',
        ]


class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = [
            'id',
            'criteria_name',
            'criteria',
            'criteria_weight',
        ]


class FeedbackSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = Feedback
        fields = ['id', 'user', 'user_name', 'subject', 'message', 'rating', 'created_at']
        read_only_fields = ['user', 'user_name', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'title', 'message', 'created_at']
