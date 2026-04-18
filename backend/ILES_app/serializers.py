from rest_framework import serializers
from .models import CustomUser, Student, Supervisor, Admin

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser 
        fields = ['name', 'role', 'id_number', 'telephone_number']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student 
        fields = ['user', 'course_title', 'unversity_name','year_of_study']


class SupervisorSerualizer(serializers.ModelSerializer):
    class Meta:
        model = Supervisor
        fields = ['users', 'place_of_work', 'department', 'staff_ID']

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['users', 'department']