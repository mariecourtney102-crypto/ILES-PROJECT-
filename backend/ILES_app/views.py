from rest_framework.decorators import api_view, permission_classes 
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib import messages
from django.db.models import Q
from django.utils import timezone
from .models import CustomUser, InternshipPlacement, WeeklyLog, Evaluation, Student, Supervisor
from .serializers import ( CustomUserSerializer, 
                          InternshipPlacementSerializer, WeeklylogSerializer,
                          EvaluationSerializer, StudentSerializer, SupervisorSerializer
)
 
def choose_role(request):
    return JsonResponse({
        "roles": ["student", "supervisor", "admin"]
    })

@api_view(['GET'])
def test_api(request):
    return Response({"message": "API working"})


def require_role(user, allowed_roles):
    if user.role not in allowed_roles:
        return Response(
            {"error": "You do not have permission to perform this action."},
            status=status.HTTP_403_FORBIDDEN
        )
    return None
    
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = CustomUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
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

@login_required
def dashboard(request):
    internship = InternshipPlacement.objects.filter(user=request.user)

    total = internship.count()

    context = {'internships': internship,
               'total': total,
               }
    return render(request,'dashboard.html', context)
  


    #'IntershipPlacement
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_placement(request):
    placement = InternshipPlacement.objects.create(
        user=request.user,
        place_of_internship=request.data.get('place_of_internship'),
        department=request.data.get('department'),
        supervisor_name=request.data.get('supervisor_name'),
        start_date=request.data.get('start_date'),
        end_date=request.data.get('end_date')
       )
    
    return Response({"message":"Internship placement created successfully"}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_students(request):
    permission_error = require_role(request.user, ['admin'])
    if permission_error:
        return permission_error

    students = Student.objects.select_related('users', 'assigned_supervisor__users').all()
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_supervisors(request):
    permission_error = require_role(request.user, ['admin'])
    if permission_error:
        return permission_error

    supervisors = Supervisor.objects.select_related('users').all()
    supervisor_data = []
    for supervisor in supervisors:
        data = SupervisorSerializer(supervisor).data
        data['assigned_students_count'] = supervisor.assigned_students.count()
        supervisor_data.append(data)
    return Response(supervisor_data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_supervisor(request):
    permission_error = require_role(request.user, ['admin'])
    if permission_error:
        return permission_error

    student_id = request.data.get('student_id')
    supervisor_id = request.data.get('supervisor_id')

    if not student_id or not supervisor_id:
        return Response(
            {"error": "student_id and supervisor_id are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        student = Student.objects.select_related('users').get(id=student_id)
        supervisor = Supervisor.objects.select_related('users').get(id=supervisor_id)
    except Student.DoesNotExist:
        return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
    except Supervisor.DoesNotExist:
        return Response({"error": "Supervisor not found."}, status=status.HTTP_404_NOT_FOUND)

    student.assigned_supervisor = supervisor
    student.save()

    return Response(
        {
            "message": "Supervisor assigned successfully.",
            "student": student.users.name,
            "supervisor": supervisor.users.name,
        },
        status=status.HTTP_200_OK
    )
#view placement
@api_view(['GET'])
@permission_classes ([IsAuthenticated])
def get_placement(request):
    try:
        placement = InternshipPlacement.objects.get(user=request.user)
        data = {"place_of_internship":placement.place_of_internship,
                "department": placement.department,
                "supervisor_name":placement.supervisor_name,
                "start_date":placement.start_date,
                "end_date":placement.end_date
                }
        return Response(data,  status=status.HTTP_200_OK)
    except InternshipPlacement.DoesNotExist:
        return Response({"error":"No placement found"}, status=status.HTTP_404_NOT_FOUND)
    
#Update Placement
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_placement(request):
    try:
        placement = InternshipPlacement.objects.get(user=request.user)
        placement.place_of_internship=request.data.get('place_of_internship')
        placement.department=request.data.get('department')
        placement.supervisor_name=request.data.get('supervisor_name')
        placement.start_date=request.data.get('start_date')
        placement.end_date=request.data.get('end_date')

        placement.save()

        return Response({"message":"Placement updated successfully"}, status=status.HTTP_200_OK)
    except InternshipPlacement.DoesNotExist:
        return Response({"error":"No placement found"}, status=status.HTTP_404_NOT_FOUND)

#delete placement
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_placement(request):
    try:
        placement = InternshipPlacement.objects.get(user=request.user)
        placement.delete()
        return Response({"message":"Placement deleted"})
    except InternshipPlacement.DoesNotExist:
        return Response({"error":"No placement found"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_weekly_log(request):
    permission_error = require_role(request.user, ['student'])
    if permission_error:
        return permission_error

    serializer = WeeklylogSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_weekly_logs(request):
    permission_error = require_role(request.user, ['student'])
    if permission_error:
        return permission_error

    logs = WeeklyLog.objects.filter(user=request.user).select_related('supervisor__users').order_by('week_number')
    serializer = WeeklylogSerializer(logs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def supervisor_students(request):
    permission_error = require_role(request.user, ['supervisor'])
    if permission_error:
        return permission_error

    try:
        supervisor = Supervisor.objects.get(users=request.user)
    except Supervisor.DoesNotExist:
        return Response({"error": "Supervisor profile not found."}, status=status.HTTP_404_NOT_FOUND)

    students = Student.objects.filter(assigned_supervisor=supervisor).select_related('users')
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def supervisor_weekly_logs(request):
    permission_error = require_role(request.user, ['supervisor'])
    if permission_error:
        return permission_error

    try:
        supervisor = Supervisor.objects.get(users=request.user)
    except Supervisor.DoesNotExist:
        return Response({"error": "Supervisor profile not found."}, status=status.HTTP_404_NOT_FOUND)

    logs = WeeklyLog.objects.filter(
        user__student__assigned_supervisor=supervisor
    ).select_related('user', 'supervisor__users').order_by('week_number', 'date_submitted')

    student_id = request.GET.get('student_id')
    if student_id:
        logs = logs.filter(user__student__id=student_id)

    serializer = WeeklylogSerializer(logs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def review_weekly_log(request, log_id):
    permission_error = require_role(request.user, ['supervisor'])
    if permission_error:
        return permission_error

    try:
        supervisor = Supervisor.objects.get(users=request.user)
    except Supervisor.DoesNotExist:
        return Response({"error": "Supervisor profile not found."}, status=status.HTTP_404_NOT_FOUND)

    try:
        weekly_log = WeeklyLog.objects.select_related('user__student').get(id=log_id)
    except WeeklyLog.DoesNotExist:
        return Response({"error": "Weekly log not found."}, status=status.HTTP_404_NOT_FOUND)

    student_profile = getattr(weekly_log.user, 'student', None)
    if student_profile is None or student_profile.assigned_supervisor_id != supervisor.id:
        return Response(
            {"error": "You can only review logs for students assigned to you."},
            status=status.HTTP_403_FORBIDDEN
        )

    new_status = request.data.get('status')
    if new_status not in ['approved', 'rejected']:
        return Response(
            {"error": "status must be either approved or rejected."},
            status=status.HTTP_400_BAD_REQUEST
        )

    weekly_log.status = new_status
    weekly_log.supervisor = supervisor
    weekly_log.supervisor_comment = request.data.get('supervisor_comment', weekly_log.supervisor_comment)
    weekly_log.evaluation_score = request.data.get('evaluation_score', weekly_log.evaluation_score)
    weekly_log.reviewed_at = timezone.now()
    weekly_log.save()

    serializer = WeeklylogSerializer(weekly_log)
    return Response(serializer.data, status=status.HTTP_200_OK)



#logout view
def logout_view(request):
    logout(request)
    return redirect('login')
    
#profile view
@login_required
def profile(request):
    if request.method == 'POST':
        form = UserUpdateForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request,"profile updated successfully")
            return redirect('profile')
    else:
        form = UserUpdateForm(instance=request.user)
        return render(request,'profile.html',{'form':form})
        
#search/filter internship
@login_required
def search_internships(request):
    query = request.GET.get('q')
    results = []
    
    if query:
        results = InternshipPlacement.objects.filter(Q(place_of_internship__icontains=query)|
                                                     Q(department__icontains=query)|
                                                     Q(supervisor_name__icontains=query)
        )
        return render(request, 'search.html',{'results': results,
                                              'query':query,
                                              })
