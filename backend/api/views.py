from django.shortcuts import render
import logging
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework.decorators import api_view, permission_classes
from .models .payment import Payment
# from .serializers import PaymentSerializer
from rest_framework.permissions import IsAdminUser
from .models import User, UserProfile
from .models .seminar import Seminar
from .models .organizations import Organizations
from .models .seminarRegister import SeminarRegistration
from .models .blogs import Blog
from .models .volunteer import Volunteer
from .models .volunteerApplication import VolunteerApplication
from .serializers import RegisterSerializer, LoginSerializer, SeminarSerializers, UserProfileSerializer, OrganizationProfileSerializer, SeminarRegistrationSerializer, OrganizationSerializer, BlogSerializer, VolunteerSerializer, VolunteerApplicationSerializer

# ============================== Register ==============================
class RegisterView(APIView):
    def post(self, request):
        email = request.data.get("email")
        ac_role = request.data.get("ac_role")
        serializer = RegisterSerializer(data=request.data)
        if str(ac_role) not in ["0", "1"]:
            return Response({"error": "Invalid role selected"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({"error": "A user with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)
        if serializer.is_valid():
            user = serializer.save()
            if user.ac_role == 1:  # If the user is an organization
                Organizations.objects.create(user=user, name=request.data.get("name", ""))
                return Response({"message": "Registration request sent to the admin for approval."}, status=status.HTTP_201_CREATED)
            else:
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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ================================== login =====================================
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

# ==================================== Google auth =================================
class GoogleAuthView(APIView):
    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), "47543249338-obgt7q4u4ekjgo0itu2nhier7cr2ichh.apps.googleusercontent.com")

            # ID token is valid. Get the user's Google Account ID and email
            email = idinfo.get('email')
            name = idinfo.get('name', email.split('@')[0])
            if not email:
                return Response({'error': 'No email found in token'}, status=status.HTTP_400_BAD_REQUEST)

            # Get or create user
            user, created = User.objects.get_or_create(email=email, defaults={
                'username': email,
                'first_name': name,
                'ac_role': 0,  # or set default role as needed
                'is_active': True,
            })

            # Issue JWT tokens
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
        except ValueError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# ============================================= Seminar ================================================
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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def fetch_seminar_details(request, seminar_id):
    try:
        seminar = Seminar.objects.get(id=seminar_id)
        serializer = SeminarSerializers(seminar)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Seminar.DoesNotExist:
        return Response({"error": "Seminar not found"}, status=status.HTTP_404_NOT_FOUND)

class SeminarRegistrationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, seminar_id):
        try:
            seminar = Seminar.objects.get(id=seminar_id)
            user = request.user

            if SeminarRegistration.objects.filter(user=user, seminar=seminar).exists():
                return Response({"error": "You are already registered for this seminar."}, status=status.HTTP_400_BAD_REQUEST)

            registration = SeminarRegistration.objects.create(user=user, seminar=seminar)
            serializer = SeminarRegistrationSerializer(registration)
            return Response(serializer.data, status=201)
        except Seminar.DoesNotExist:
            return Response({"error": "Seminar not found."}, status=status.HTTP_404_NOT_FOUND)

class SeminarDeregistrationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, seminar_id):
        try:
            registration = SeminarRegistration.objects.get(user=request.user, seminar_id=seminar_id)
            registration.delete()
            return Response({"message": "Registration cancelled successfully."}, status=status.HTTP_200_OK)
        except SeminarRegistration.DoesNotExist:
            return Response({"error": "You are not registered for this seminar."}, status=status.HTTP_404_NOT_FOUND)

class SeminarRegistrationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, seminar_id):
        is_registered = SeminarRegistration.objects.filter(user=request.user, seminar_id=seminar_id).exists()
        return Response({"registered": is_registered}, status=status.HTTP_200_OK)

class SeminarDeleteView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def delete(self, request, seminar_id):
        try:
            # check if the requesting user is the creator
            seminar = Seminar.objects.get(id=seminar_id)

            # Only allow deletion if the user created this seminar
            if seminar.created_by != request.user:
                return Response(
                    {"error": "You do not have permission to delete this seminar."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # seminar deletion
            seminar.delete()
            return Response(
                {"message": "Seminar deleted successfully."},
                status=status.HTTP_200_OK
            )

        except Seminar.DoesNotExist:
            return Response(
                {"error": "Seminar not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FetchOpenVolunteerApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        seminars = Seminar.objects.filter(is_open_for_volunteers=True)
        serializer = SeminarSerializers(seminars, many=True)
        return Response(serializer.data, status=200)

# ========================================= user profile ========================================
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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ======================================= organization profile ===============================
# logger = logging.getLogger(__name__)
class OrganizationProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_class = [JWTAuthentication]
    parser_class = [MultiPartParser, FormParser]

    def get(self, request):
        if request.user.ac_role != 1:
            return Response({"error": "You are not authorized to access this resource."}, status=status.HTTP_403_FORBIDDEN)
        try:
            organization, created = Organizations.objects.get_or_create(user=request.user)
            serializer = OrganizationProfileSerializer(organization)
            return Response({
                "user": {
                    "name": request.user.email,
                    "email": request.user.email,
                    "accountType": dict(User.ROLE_CHOICE).get(request.user.ac_role, "Organizations"),
                },
                "profile": serializer.data,
            }, status=status.HTTP_200_OK)
        except Organizations.DoesNotExist:
            return Response({"error": "Organization profile not found."}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request):
        try:
            organization, created = Organizations.objects.get_or_create(user=request.user)
            serializer = OrganizationProfileSerializer(organization, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "message": "Profile updated successfully.",
                    "profile": serializer.data,
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Organizations.DoesNotExist:
            return Response({"error": "Organization profile not found."}, status=status.HTTP_404_NOT_FOUND)

class OrganizationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        organizations = Organizations.objects.all()
        serializer = OrganizationSerializer(organizations, many=True)
        return Response(serializer.data, status=200)

# ======================================== Blog =======================================
class BlogListView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        blogs = Blog.objects.all()
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BlogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ======================================== Volunteer ====================================
class AssignVolunteerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            if request.user.ac_role != 1:
                return Response({"error": "You are not authorized to assign volunteers."}, status=403)

            organization = Organizations.objects.get(user=request.user)

            seminar_id = request.data.get('seminar_id')
            volunteer_id = request.data.get('volunteer_id')

            seminar = Seminar.objects.get(id=seminar_id, organization=organization)

            volunteer = User.objects.get(id=volunteer_id)

            if not volunteer.is_active or volunteer.ac_role != 0:
                return Response({"error": "The selected user is not eligible to be a volunteer."}, status=400)

            assignment = Volunteer.objects.create(
                seminar=seminar,
                organization=organization,
                volunteer=volunteer
            )

            serializer = VolunteerSerializer(assignment)
            return Response(serializer.data, status=201)
        except Organizations.DoesNotExist:
            return Response({"error": "Organization not found for the current user."}, status=404)
        except Seminar.DoesNotExist:
            return Response({"error": "Seminar not found or does not belong to your organization."}, status=404)
        except User.DoesNotExist:
            return Response({"error": "Volunteer not found."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class OrganizationVolunteersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            organization = Organizations.objects.get(user=request.user)
            volunteers = User.objects.filter(ac_role=0, is_active=True)
            volunteer_data = []

            for volunteer in volunteers:
                # Simply use email as the name since UserProfile doesn't have full_name
                name = volunteer.email

                volunteer_data.append({
                    "id": volunteer.id,
                    "name": name
                })

            return Response(volunteer_data, status=status.HTTP_200_OK)
        except Organizations.DoesNotExist:
            return Response({"error": "Organization not found for the current user."}, status=status.HTTP_404_NOT_FOUND)

class OpenVolunteerApplicationView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_class = [JWTAuthentication]

    def post(self, request, seminar_id):
        try:
            if request.user.ac_role != 1:
                return Response({"error": "You are not authorized to open volunteer applications."}, status=403)

            organization = Organizations.objects.get(user_id=request.user.id)

            seminar = Seminar.objects.get(id=seminar_id, created_by=request.user)

            seminar.is_open_for_volunteers = True
            seminar.save()

            return Response({"message": "Volunteer application opened successfully."}, status=status.HTTP_200_OK)
        except Organizations.DoesNotExist:
            return Response({"error": "Organization not found for the current user."}, status=404)
        except Seminar.DoesNotExist:
            return Response({"error": "Seminar not found or does not belong to your organization."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class ApplyForVolunteeringView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, seminar_id):
        try:
            # Check if the seminar is open for volunteers
            seminar = Seminar.objects.get(id=seminar_id, is_open_for_volunteers=True)

            # Check if the user has already applied
            if VolunteerApplication.objects.filter(seminar=seminar, user=request.user).exists():
                return Response({"error": "You have already applied for this seminar."}, status=400)

            # Create the application
            application = VolunteerApplication.objects.create(seminar=seminar, user=request.user)
            serializer = VolunteerApplicationSerializer(application)
            return Response(serializer.data, status=201)
        except Seminar.DoesNotExist:
            return Response({"error": "Seminar not found or not open for volunteers."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

