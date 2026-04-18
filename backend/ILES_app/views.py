from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib import messages
from .models import CustomUser, Student, Supervisor, Admin


# CHOOSE ROLE VIEW
def choose_role(request):
    return render(request, 'choose_role.html')


# SIGNUP VIEW
def signup(request):
    role = request.GET.get('role', None)  # gets role from URL e.g. /signup/?role=student

    if request.method == 'POST':
        name = request.POST.get('name')
        username = request.POST.get('username')
        id_number = request.POST.get('id_number')
        telephone = request.POST.get('telephone_number')
        password = request.POST.get('password')
        role = request.POST.get('role')

        # Check if ID number already exists
        if CustomUser.objects.filter(ID_number=id_number).exists():
            messages.error(request, 'A user with this ID number already exists.')
            return redirect('signup')

        # Create the user
        user = CustomUser.objects.create_user(
            username=username,
            password=password,
            name=name,
            role=role,
            ID_number=id_number,
            telephone_number=telephone
        )

        # Create role-specific profile
        if role == 'student':
            Student.objects.create(
                users=user,
                course_title=request.POST.get('course_title'),
                university_name=request.POST.get('university_name'),
                year_of_study=request.POST.get('year_of_study')
            )
        elif role == 'supervisor':
            Supervisor.objects.create(
                users=user,
                place_of_work=request.POST.get('place_of_work'),
                department=request.POST.get('department'),
                staff_ID=request.POST.get('staff_ID')
            )
        elif role == 'admin':
            Admin.objects.create(
                users=user,
                department=request.POST.get('department')
            )

        messages.success(request, 'Account created successfully. Please log in.')
        return redirect('login')

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