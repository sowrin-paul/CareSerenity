from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.views import APIView
from .models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user.ac_role == 0:
                token, _ = Token.objects.get_or_create(user=user)
                return Response({"token": token.key}, status=status.HTTP_201_CREATED)
            elif user.ac_role == 1:
                return Response({"message": "Registration request sent to the admin for approval."}, status=status.HTTP_201_CREATED)
        print("Validation error:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
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