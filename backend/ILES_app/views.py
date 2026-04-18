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
    

    return render(request, 'signup.html', {'role': role})


# LOGIN VIEW
def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            auth_login(request, user)
            messages.success(request, f'Welcome back, {user.name}!')

            # Redirect based on role
            if user.role == 'student':
                return redirect('student_dashboard')
            elif user.role == 'supervisor':
                return redirect('supervisor_dashboard')
            elif user.role == 'admin':
                return redirect('admin_dashboard')
            elif user.role == 'workplace_supervisor':
                return redirect('workplace_dashboard')
        else:
            messages.error(request, 'Invalid username or password.')

    return render(request, 'login.html')


# LOGOUT VIEW
def logout_view(request):
    logout(request)
    return redirect('login')