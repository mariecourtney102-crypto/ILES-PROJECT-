from rest_framework.decorators import api_view, permission_classes 
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from django.db import transaction
from django.db.models import Q, Count
from django.utils import timezone
from .models import CustomUser, InternshipPlacement, WeeklyLog, Evaluation, Student, Supervisor, Feedback, SiteSetting, Notification
from .serializers import ( CustomUserSerializer, 
                          InternshipPlacementSerializer, WeeklylogSerializer,
                          EvaluationSerializer, StudentSerializer, SupervisorSerializer,
                          FeedbackSerializer, NotificationSerializer
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


def notify_weekly_log_submitted(weekly_log):
    Notification.objects.create(
        user=weekly_log.user,
        title="Weekly Log Submitted",
        message=f"Your Week {weekly_log.week_number} log was submitted successfully.",
    )

    student_profile = getattr(weekly_log.user, 'student', None)
    if student_profile and student_profile.assigned_supervisor:
        Notification.objects.create(
            user=student_profile.assigned_supervisor.users,
            title="New Weekly Log",
            message=f"{weekly_log.user.name or weekly_log.user.username} submitted Week {weekly_log.week_number}.",
        )
    
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logoutUser(request):
    """Logout user by deleting their token"""
    try:
        request.user.auth_token.delete()
    except:
        pass
    return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    permission_error = require_role(request.user, ['student'])
    if permission_error:
        return permission_error
    
    internship = InternshipPlacement.objects.filter(user=request.user)
    total = internship.count()

    return Response({
        'internships': InternshipPlacementSerializer(internship, many=True).data,
        'total': total,
    }, status=status.HTTP_200_OK)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_placement(request):
    permission_error = require_role(request.user, ['student'])
    if permission_error:
        return permission_error

    serializer = InternshipPlacementSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        placement = InternshipPlacement.objects.filter(user=request.user).order_by('-id').first()
        if placement is not None:
            serializer = InternshipPlacementSerializer(placement, data=request.data)
            serializer.is_valid(raise_exception=True)
            placement = serializer.save(user=request.user)
        else:
            placement = serializer.save(user=request.user)

    return Response(
        {
            "message": "Internship placement saved successfully",
            "placement": InternshipPlacementSerializer(placement).data,
        },
        status=status.HTTP_201_CREATED
    )


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
    permission_error = require_role(request.user, ['student'])
    if permission_error:
        return permission_error

    try:
        placement = InternshipPlacement.objects.filter(user=request.user).latest('id')
        serializer = InternshipPlacementSerializer(placement)
        return Response(serializer.data,  status=status.HTTP_200_OK)
    except InternshipPlacement.DoesNotExist:
        return Response({"error":"No placement found"}, status=status.HTTP_404_NOT_FOUND)
    
#Update Placement
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_placement(request):
    permission_error = require_role(request.user, ['student'])
    if permission_error:
        return permission_error

    try:
        placement = InternshipPlacement.objects.filter(user=request.user).latest('id')
    except InternshipPlacement.DoesNotExist:
        return Response({"error":"No placement found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = InternshipPlacementSerializer(placement, data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    placement = serializer.save(user=request.user)
    return Response(
        {
            "message":"Placement updated successfully",
            "placement": InternshipPlacementSerializer(placement).data,
        },
        status=status.HTTP_200_OK
    )

#delete placement
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_placement(request):
    permission_error = require_role(request.user, ['student'])
    if permission_error:
        return permission_error

    try:
        placement = InternshipPlacement.objects.filter(user=request.user).latest('id')
        placement.delete()
        return Response({"message":"Placement deleted"}, status=status.HTTP_200_OK)
    except InternshipPlacement.DoesNotExist:
        return Response({"error":"No placement found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_weekly_log(request):
    permission_error = require_role(request.user, ['student'])
    if permission_error:
        return permission_error

    serializer = WeeklylogSerializer(data=request.data)
    if serializer.is_valid():
        weekly_log = serializer.save(user=request.user, status='pending')
        notify_weekly_log_submitted(weekly_log)
        return Response(WeeklylogSerializer(weekly_log).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_weekly_log_draft(request):
    permission_error = require_role(request.user, ['student'])
    if permission_error:
        return permission_error

    draft_id = request.data.get('id')

    if draft_id:
        try:
            draft = WeeklyLog.objects.get(id=draft_id, user=request.user, status='draft')
        except WeeklyLog.DoesNotExist:
            return Response({"error": "Draft not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = WeeklylogSerializer(draft, data=request.data, partial=True)
    else:
        serializer = WeeklylogSerializer(data=request.data)

    if serializer.is_valid():
        draft = serializer.save(user=request.user, status='draft')
        return Response(WeeklylogSerializer(draft).data, status=status.HTTP_200_OK if draft_id else status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def submit_weekly_log(request, log_id):
    permission_error = require_role(request.user, ['student'])
    if permission_error:
        return permission_error

    try:
        weekly_log = WeeklyLog.objects.get(id=log_id, user=request.user)
    except WeeklyLog.DoesNotExist:
        return Response({"error": "Weekly log not found."}, status=status.HTTP_404_NOT_FOUND)

    if weekly_log.status != 'draft':
        return Response(
            {"error": "Only draft logs can be submitted."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    serializer = WeeklylogSerializer(weekly_log, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    weekly_log = serializer.save(status='pending')
    notify_weekly_log_submitted(weekly_log)

    return Response(WeeklylogSerializer(weekly_log).data, status=status.HTTP_200_OK)


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

    logs = WeeklyLog.objects.exclude(status='draft').filter(
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

    supervisor_comment = request.data.get('supervisor_comment', weekly_log.supervisor_comment)
    if new_status == 'rejected' and not str(supervisor_comment or '').strip():
        return Response(
            {"error": "A rejection reason is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    weekly_log.status = new_status
    weekly_log.supervisor = supervisor
    weekly_log.supervisor_comment = supervisor_comment
    weekly_log.evaluation_score = request.data.get('evaluation_score', weekly_log.evaluation_score)
    weekly_log.reviewed_at = timezone.now()
    weekly_log.save()

    serializer = WeeklylogSerializer(weekly_log)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    """Get or update user profile"""
    if request.method == 'GET':
        user_data = CustomUserSerializer(request.user).data
        return Response(user_data, status=status.HTTP_200_OK)
    
    if request.method == 'PUT':
        serializer = CustomUserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_internships(request):
    """Search/filter internship placements"""
    query = request.GET.get('q', '').strip()
    
    if not query:
        return Response({"error": "Query parameter 'q' is required."}, status=status.HTTP_400_BAD_REQUEST)
    
    results = InternshipPlacement.objects.filter(
        Q(place_of_internship__icontains=query) |
        Q(department__icontains=query) |
        Q(supervisor_name__icontains=query)
    )
    
    serializer = InternshipPlacementSerializer(results, many=True)
    return Response({
        'query': query,
        'results': serializer.data,
        'count': results.count()
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reports(request):
    permission_error = require_role(request.user, ['admin'])
    if permission_error:
        return permission_error

    total_students = Student.objects.count()
    total_supervisors = Supervisor.objects.count()
    total_placements = InternshipPlacement.objects.count()
    total_logs = WeeklyLog.objects.count()
    reviewed_logs = WeeklyLog.objects.exclude(status='pending').count()
    pending_logs = WeeklyLog.objects.filter(status='pending').count()

    reports_data = [
        {
            "id": "users",
            "title": "User Summary",
            "summary": f"{total_students} students and {total_supervisors} supervisors are registered.",
            "created_at": timezone.now().date(),
        },
        {
            "id": "placements",
            "title": "Placement Summary",
            "summary": f"{total_placements} internship placements have been submitted.",
            "created_at": timezone.now().date(),
        },
        {
            "id": "weekly-logs",
            "title": "Weekly Log Summary",
            "summary": f"{reviewed_logs} logs reviewed, {pending_logs} pending, {total_logs} total.",
            "created_at": timezone.now().date(),
        },
    ]

    return Response(reports_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def opportunities(request):
    permission_error = require_role(request.user, ['admin'])
    if permission_error:
        return permission_error

    placements = (
        InternshipPlacement.objects
        .values('place_of_internship', 'department')
        .annotate(total=Count('id'))
        .order_by('place_of_internship', 'department')
    )

    data = [
        {
            "id": index + 1,
            "title": item['place_of_internship'],
            "summary": f"{item['total']} student placement(s) in {item['department']}.",
            "created_at": timezone.now().date(),
        }
        for index, item in enumerate(placements)
    ]

    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def feedback(request):
    if request.method == 'POST':
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            feedback_item = serializer.save(user=request.user)
            return Response(FeedbackSerializer(feedback_item).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    permission_error = require_role(request.user, ['admin'])
    if permission_error:
        return permission_error

    feedback_items = Feedback.objects.select_related('user').order_by('-created_at')
    serializer = FeedbackSerializer(feedback_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def settings(request):
    permission_error = require_role(request.user, ['admin'])
    if permission_error:
        return permission_error

    site_settings = SiteSetting.objects.order_by('id').first()
    if site_settings is None:
        site_settings = SiteSetting.objects.create(
            site_name="ILES",
            admin_email=request.user.email or "",
        )

    if request.method == 'PUT':
        site_settings.site_name = request.data.get("siteName", site_settings.site_name)
        site_settings.admin_email = request.data.get("adminEmail", site_settings.admin_email)
        site_settings.save()

    return Response(
        {
            "siteName": site_settings.site_name,
            "adminEmail": site_settings.admin_email,
        },
        status=status.HTTP_200_OK,
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications(request):
    user_notifications = Notification.objects.filter(user=request.user)
    serializer = NotificationSerializer(user_notifications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)

    notification.is_read = True
    notification.save(update_fields=['is_read'])
    return Response(NotificationSerializer(notification).data, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read(request):
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({"message": "All notifications marked as read."}, status=status.HTTP_200_OK)
