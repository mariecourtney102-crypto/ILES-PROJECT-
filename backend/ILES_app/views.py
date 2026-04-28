from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
from django.shortcuts import render, redirect, get_object_or_404
from .models import CustomUser, InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria
from .serializers import ( CustomUserSerializer, 
                          InternshipPlacementSerializer, WeeklylogSerializer,
                          EvaluationSerializer
)
@api_view(['GET']) 
def choose_role(request):
    return Response({
        "roles": ["student", "supervisor", "admin"]
    })

@api_view(['GET'])
def test_api(request):
    return Response({"message": "API working"})
    
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
    active = internship.filter(status='approved').count()
    pending = internship.filter(status='pending').count()

    context = {'internships': internship,
               'total': total,
               }
    return render(request,'dashboard.html', context)
  


#IntershipPlacement
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

        return Response({"message":"Placement deleted"}, status=status.HTTP_204_NO_CONTENT)
    except InternshipPlacement.DoesNotExist:
        return Response({"error":"No placement found"})

#logout view
def logout_view(request):
    logout(request)
    return redirect('login')
    
#profile view
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated]) 
def profile(request):
    if request.method == 'GET':
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = CustomUserSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
       
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
    
#WEEKLY LOG VIEWS
#STUDENT SUBMITS A LOG
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_log(request):
    data = request.data.copy()
    data['user'] = request.user.id
    serializer = WeeklylogSerializer(data = data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#STUDENT VIEWS THEIR LOG
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_logs(request):
    logs = WeeklyLog.objects.filter(user=request.user)
    serializer = WeeklylogSerializer(logs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

#SUPERVISOR REVIEWS LOG
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def review_log(request, log_id):
    try:
        log = WeeklyLog.objects.get(id=log_id)
        log.supervisor_comment = request.data.get('supervisor_comment')
        log.status = 'reviewed'
        log.save()
        return Response({"message": "The log has been successfully reviewed"}, status=status.HTTP_200_OK)
    except WeeklyLog.DoesNotExist:
        return Response({"message": "Log not found"}, status=status.HTTP_404_NOT_FOUND)
    
#EVALUATING VIEWS
#SUPERVISOR SUBMITTING AN EVALUATION
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_evaluation(request):
    serializer = EvaluationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#A USER VIEWING AN EVALUATION
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_evaluation(request):
    evaluations = Evaluation.objects.filter(user=request.user)
    serializer = EvaluationSerializer(evaluations, many = True)
    return Response(serializer.data, status=status.HTTP_200_OK)

#GETTING INFORMATION ON THE EVALUATION CRITERIA
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_criteria(request):
    criteria = EvaluationCriteria.objects.all()
    data = [
        {
            "id": c.id,
            "criteria_name": c.criteria_name,
            "criteria": c.criteria,
            "criteria_weight": c.criteria_weight
        }
        for c in criteria
    ]
    return Response(data, status=status.HTTP_200_OK)

#ADMIN DASHBOARD API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    # Check if user is admin
    if request.user.role != 'admin':
        return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)
    
    # Get stats
    total_students = CustomUser.objects.filter(role='student').count()
    total_supervisors = CustomUser.objects.filter(role='supervisor').count()
    total_placements = InternshipPlacement.objects.count()
    total_logs = WeeklyLog.objects.count()
    pending_logs = WeeklyLog.objects.filter(status='pending').count()
    
    return Response({
        "total_students": total_students,
        "total_supervisors": total_supervisors,
        "total_placements": total_placements,
        "pending_placements": 0,
        "approved_placements": 0,
        "rejected_placements": 0,
        "total_logs": total_logs,
        "pending_logs": pending_logs
    }, status=status.HTTP_200_OK)

#internship details
@login_required
def internship_detail(request,id):
    internship = get_object_or_404(InternshipPlacement,id=id)
    return render(request,'internship_detail.html',{'internship': internship})  

#Supervisor/Admin views
@login_required
def update_status(request,id):
    internship = get_object_or_404(InternshipPlacement,id=id)
    if request.method == 'POST':
        status = request.POST.get('status')
        if status in ['approved','rejected']:
            internship.status = status
            internship.save()
            messages.success(request,"status updated")
            return redirect('dashboard')
