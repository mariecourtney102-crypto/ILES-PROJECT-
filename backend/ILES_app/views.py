from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import internshipPlacement

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
    internshipPlacement.objects.create(user=request.user,
                                       place_of_internship=request,data.get('place_of_internship'),
                                       department=request.data.get('department'),
                                       supervisor_name=request.data.get('supervisor_name')
                                       start_date=request.data.get('start_date'),
                                       end_date=request.data.get('end_date')
                                       )
    return Response({"message":"internship placement created successfully"})
