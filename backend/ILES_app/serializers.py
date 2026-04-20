from rest_framework import serializers
from .models import CustomUser, Student, Supervisor, Admin, InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser 
        fields = ['name', 'role', 'id_number', 'telephone_number']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student 
        fields = ['user', 'course_title', 'university_name','year_of_study']


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
        read_only_fields = ['user', 'evaluation_data']

class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'