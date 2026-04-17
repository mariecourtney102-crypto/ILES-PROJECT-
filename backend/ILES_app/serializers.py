from rest_framework import serializers
from .models import CustomUser, InternshipPlacement

class UserSerializer(serializers.ModelSerializer):
    password = serializers.Charfield(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'role']
        read_only_fields = ['id']

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)


class InternshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipPlacement
        fields = '__all__'