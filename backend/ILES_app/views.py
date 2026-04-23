from rest_framework.decorators import api_view, permission_classes 
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from .models import InternshipPlacement, WeeklyLog, Evaluation
from .serializers import ( CustomUserSerializer, 
                          InternshipPlacementSerializer, WeeklylogSerializer,
                          EvaluationSerializer
)
 
def choose_role(request):
    return JsonResponse({
        "roles": ["student", "supervisor", "admin", "workplace_supervisor"]
    })

@api_view(['GET'])
def test_api(request):
    return Response({"message": "API working"})
    
@api_view(['POST'])
def signup(request):
    serializer = CustomUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)
    

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

#IntershipPlacement
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_placement(request):
    InternshipPlacement.objects.create(user=request.user,
                                       place_of_internship=request.data.get('place_of_internship'),
                                       department=request.data.get('department'),
                                       supervisor_name=request.data.get('supervisor_name'),
                                       start_date=request.data.get('start_date'),
                                       end_date=request.data.get('end_date')
)
    return Response({"message":"internship placement created successfully"})
#view placement
@api_view(['GET'])
@permission_classes ([IsAuthenticated])
def get_placement(request):
    try:
        placement = InternshipPlacement.object.get(user=request.user)
        data = {"place_of_internship":placement.place_of_internship,
                "department": placement.department,
                "supervisor_name":placement.supervisor_name,
                "start_date":placement.start_date,
                "end_date":placement.end_date
                }
        return Response(data)
    except InternshipPlacement.DoesNotExist:
        return Response({"error":"No placement found"})
    
#Update Placement
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_placement(request):
    try:
        placement = InternshipPlacement.object.get(user=request.user)
        placement.place_of_internship=request.data.get('place_of_internship')
        placement.department=request.data.get('department')
        placement.supervisor_name=request.data.get('supervisor_name')
        placement.start_date=request.data.get('start_date')
        placement.end_date=request.data.get('end_date')

        placement.save()

        return Response({"message":"Placement updated successfully"})
    except InternshipPlacement.DoesNotExist:
        return Response({"error":"No placementfound"})

#delete placement
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_placement(request):
    try:
        placement = InternshipPlacement.object.get(user=request.user)
        placement.delete()
        return Response({"message":"Placement deleted"})
    except InternshipPlacement.DoesNotExist:
        return Response({"error":"No placement found"})


    