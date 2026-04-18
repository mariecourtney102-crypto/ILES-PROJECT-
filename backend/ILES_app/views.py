from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import CustomUser, Student, Supervisor, Admin
from .serializers import CustomUserSerializer, StudentSerializer, SupervisorSerializer, AdminSerializer


# CHOOSE ROLE
@api_view(['GET'])
@permission_classes([AllowAny])
def choose_role(request):
    roles = ['student', 'supervisor', 'admin', 'workplace_supervisor']
    return Response({"available_roles": roles})


# SIGNUP
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # Create role-specific profile
        role = user.role
        if role == 'student':
            Student.objects.create(
                users=user,
                course_title=request.data.get('course_title'),
                university_name=request.data.get('university_name'),
                year_of_study=request.data.get('year_of_study')
            )
        elif role == 'supervisor':
            Supervisor.objects.create(
                users=user,
                place_of_work=request.data.get('place_of_work'),
                department=request.data.get('department'),
                staff_ID=request.data.get('staff_ID')
            )
        elif role == 'admin':
            Admin.objects.create(
                users=user,
                department=request.data.get('department')
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "message": "Account created successfully",
            "token": token.key,
            "role": user.role
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# LOGIN
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "message": "Login successful",
            "token": token.key,
            "role": user.role,
            "name": user.name
        }, status=status.HTTP_200_OK)

    return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)
