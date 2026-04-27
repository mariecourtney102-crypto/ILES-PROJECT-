from django.db import transaction
from rest_framework import serializers
from .models import CustomUser, Student, Supervisor, Admin, InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria

class CustomUserSerializer(serializers.ModelSerializer):
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
            'username',
            'password',
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
        }

    def validate(self, attrs):
        role = attrs.get("role")

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
            if value in (None, ""):
                errors[field] = "This field is required."

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

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
            profile_data = {
                "place_of_work": validated_data.pop("place_of_work", None),
                "department": validated_data.pop("department", None),
                "staff_ID": validated_data.pop("staff_ID", None),
            }
        elif role == "admin":
            profile_data = {
                "department": validated_data.pop("department", None),
            }

        user = CustomUser.objects.create_user(**validated_data)

        if role == "student":
            Student.objects.create(users=user, **profile_data)
        elif role == "supervisor":
            Supervisor.objects.create(users=user, **profile_data)
        elif role == "admin":
            Admin.objects.create(users=user, **profile_data)

        return user


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student 
        fields = ['users', 'course_title', 'university_name','year_of_study']


class SupervisorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supervisor
        fields = ['users', 'place_of_work', 'department', 'staff_ID']

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['users', 'department']

class InternshipPlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipPlacement
        fields = '__all__'

class WeeklylogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLog
        fields = '__all__'
        read_only_fields = ['user', 'date_submitted']

class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'
