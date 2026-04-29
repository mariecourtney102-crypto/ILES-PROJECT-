from rest_framework.decorators import api_view, permission_classes 
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from .models import InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria
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
def admin_dashboard(request):
    if not request.user.is_authenticated or request.user.role != 'admin':
        return redirect('login')
    
    internships = InternshipPlacement.objects.all()
    return render(request,'admin_dashboard.html',{'internships':internships})

    #student without supervisors
    from django.contrib.auth.models import User

@login_required             
def students_without_supervisors(request):
    internships = InternshipPlacement.objects.filter(supervisor__isnull=True)

    return render(request, 'admin/students_no_supervisor.html',{
        'internships':internships
    })         


#Supervisors without students   
@login_required
def supervisors_without_students(request):
    supervisors = User.objects.filter(is_staff=True).exclude(
        supervised_internships__isnull=False
    )
    return render(request, 'admin/supervisors_no_students.html',{
        'supervisors':supervisors
        })

#students without placements
@login_required
def student_availability(request):
    students = User.objects.filter(is_staff=False)
      

    data =  []
    for student in students:
        has_internship = InternshipPlacement.objects.filter(user=student).exists()
        data.append({
              'student':student,
              'has_internship':has_internship
        })
        return render(request, 'admin/student_availability.html',{
              'data':data
              })

#Students grouped by company
from django.db.models import count

@login_required
def students_by_company(request):
    companies = InternshipPlacement.objects.values('company_name').annotate(
        total=count('id')
    )
    return render(request, 'admin/company_groups.html', {
        'companies':companies
        })
          
#comments on logs
@login_required
def add_log_comment(request, log_id):
    log = get_object_or_404(LogEntry, id=log_id)

    if request.method == 'POST':