from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from .models import User, UserProfile
from .models .seminar import Seminar
from .serializers import RegisterSerializer, LoginSerializer, SeminarSerializers, UserProfileSerializer

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get("email")
        username = request.data.get("username")
        ac_role = request.data.get("ac_role")
        serializer = RegisterSerializer(data=request.data)
        if str(ac_role) not in ["0", "1"]:
            return Response({ "error": "Invalid role selected" }, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({"error": "A user with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)
        if serializer.is_valid():
            user = serializer.save()
            if user.ac_role == 0:
                refresh = RefreshToken.for_user(user)
                return Response({
                        "success": True,
                        "statusCode": 200,
                        "message": "Registration successful",
                        "data": {
                        "id": str(user.id),
                        "name": user.get_username(),
                        "email": user.email,
                        "role": user.ac_role,
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    }
                }, status=status.HTTP_201_CREATED)
            elif user.ac_role == 1:
                return Response({"message": "Registration request sent to the admin for approval."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)
            return Response({
                        "success": True,
                        "statusCode": 200,
                        "message": "Login successful",
                        "data": {
                        "id": str(user.id),
                        "name": user.get_username(),
                        "email": user.email,
                        "role": user.ac_role,
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    }
                }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAdminUser])
def approve_organization(request, user_id):
    try:
        user = User.objects.get(id=user_id, ac_role=1, is_active=False)
        user.is_active = True
        user.save()
        return Response({"message": "Organization approved successfully"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "Organization not found or already approved."}, status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"])
@permission_classes([IsAdminUser])
def pending_organization(request):
    organization = User.objects.filter(ac_role=1, is_active=False)
    data = [{"id": org.id, "email": org.email} for org in organization]
    return Response(data, status=status.HTTP_200_OK)

class SeminarListView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        seminars = Seminar.objects.all()
        serializer = SeminarSerializers(seminars, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SeminarSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def fetch_own_seminar(request):
    seminars = Seminar.objects.filter(created_by=request.user)
    serializer = SeminarSerializers(seminars, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_available_seminars(request):
    seminars = Seminar.objects.all()
    serializer = SeminarSerializers(seminars, many=True)
    return Response(serializer.data)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_class = [JWTAuthentication]
    parser_class = [MultiPartParser, FormParser]

    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response({
            "user": {
                "name": request.user.email,
                "email":  request.user.email,
                "accountType": dict(User.ROLE_CHOICE).get(request.user.ac_role, "User"),
            },
            "profile": serializer.data,
        })
    def patch(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({ "profile": serializer.data })
        return Response(serializer.errors, status=400)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def fetch_seminar_details(request, seminar_id):
    try:
        seminar = Seminar.objects.get(id=seminar_id)
        serializer = SeminarSerializers(seminar)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Seminar.DoesNotExist:
        return Response({"error": "Seminar not found"}, status=status.HTTP_400_NOT_FOUND)