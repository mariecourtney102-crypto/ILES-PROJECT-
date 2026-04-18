from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate

@api_view(['GET'])
def test_api(request):
    return Response({"message": "API working"})
    
@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)
    

@api_view(['POST'])
from Django.contrib.auth import authenticate
def login(request):
    user = authenticate(
        username=request.data.get('username'),
        password=request.data.get('password')
    )

    if user:
        return Response({"message": "Login successful", "role": user.role})
    return Response({"error": "Invalid credentials"})
from rest_framework.decorators import api_view
from. models import Student

@api_view(['GET'])
def get_student_profile(request):
    student = student.objects.get(user=request.user)
    return Response({"name": student.user.username,
                     "course":student.course,
                     "phone": student.phone,
                     "student_no": student.student_no})
