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
from datetime import datetime
from django.shortcuts import redirect
from django.urls import reverse
from django.views.generic import TemplateView
from django.shortcuts import render, get_object_or_404, redirect
from .models .payment import Payment
# from .serializers import PaymentSerializer
from rest_framework.permissions import IsAdminUser
from .models import User, UserProfile
from django.utils import timezone
from .models .seminar import Seminar
from .models .organizations import Organizations
from .models .seminarRegister import SeminarRegistration
from .models .blogs import Blog
from .models .volunteer import Volunteer
from .models .volunteerApplication import VolunteerApplication
from .models .orphan import Orphan
from .models .adoption import Adoption
from .models .donation import Donation
from .models .blogReaction import BlogReaction
from .serializers import RegisterSerializer, LoginSerializer, SeminarSerializers, UserProfileSerializer, OrganizationProfileSerializer, SeminarRegistrationSerializer, OrganizationSerializer, BlogSerializer, VolunteerSerializer, VolunteerApplicationSerializer, OrphanSerializer, AdoptionSerializer

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

class OrganizationVolunteerApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            if request.user.ac_role != 1:
                return Response({"error": "You are not authorized to view volunteer applications."}, status=403)

            organization = Organizations.objects.get(user=request.user)

            organization_seminars = Seminar.objects.filter(created_by=request.user)

            applications = VolunteerApplication.objects.filter(seminar__in=organization_seminars)

            application_data = []
            for app in applications:
                application_data.append({
                    "id": app.id,
                    "volunteer_name": app.user.email,
                    "volunteer_id": app.user.id,
                    "seminar_id": app.seminar.id,
                    "seminar_title": app.seminar.title,
                    "applied_at": app.applied_at
                })

            return Response(application_data, status=200)
        except Organizations.DoesNotExist:
            return Response({"error": "Organization not found for the current user."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class ApproveVolunteerApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, application_id):
        try:
            if request.user.ac_role != 1:
                return Response({"error": "You are not authorized to approve volunteer applications."}, status=403)

            organization = Organizations.objects.get(user=request.user)
            application = VolunteerApplication.objects.get(id=application_id)

            if application.seminar.created_by != request.user:
                return Response({"error": "You do not have permission to approve this application."}, status=403)

            volunteer_assignment = Volunteer.objects.create(
                seminar=application.seminar,
                organization=organization,
                volunteer=application.user
            )

            application.delete()

            return Response({"message": "Volunteer application approved successfully."}, status=200)
        except Organizations.DoesNotExist:
            return Response({"error": "Organization not found for the current user."}, status=404)
        except VolunteerApplication.DoesNotExist:
            return Response({"error": "Volunteer application not found."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class DeclineVolunteerApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, application_id):
        try:
            if request.user.ac_role != 1:
                return Response({"error": "You are not authorized to decline volunteer applications."}, status=403)

            application = VolunteerApplication.objects.get(id=application_id)

            if application.seminar.created_by != request.user:
                return Response({"error": "You do not have permission to decline this application."}, status=403)

            application.delete()

            return Response({"message": "Volunteer application declined."}, status=200)
        except VolunteerApplication.DoesNotExist:
            return Response({"error": "Volunteer application not found."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class UserVolunteerApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            applications = VolunteerApplication.objects.filter(user=request.user)

            application_data = []
            for app in applications:
                org_name = None
                if hasattr(app.seminar, 'organization') and app.seminar.organization:
                    org_name = app.seminar.organization.name

                application_data.append({
                    "id": app.id,
                    "seminar": {
                        "id": app.seminar.id,
                        "title": app.seminar.title,
                        "date": app.seminar.seminar_date,
                        "organization": org_name
                    },
                    "applied_at": app.created_at
                })

            return Response(application_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# ================================ orphan create ===========================
class OrphanCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:
            if request.user.ac_role != 1:
                return Response({"error": "You are not authorized to add orphans."}, status=403)

            organization = Organizations.objects.get(user=request.user)

            serializer = OrphanSerializer(data=request.data)
            if serializer.is_valid():
                orphan = serializer.save(organizations=organization)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Organizations.DoesNotExist:
            return Response({"error": "Organization not found for the current user."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class OrphanCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            if request.user.ac_role != 1:
                return Response({"error": "You are not authorized to access this resource."}, status=403)

            organization = Organizations.objects.get(user=request.user)
            count = Orphan.objects.filter(organizations=organization).count()

            return Response({"count": count}, status=status.HTTP_200_OK)

        except Organizations.DoesNotExist:
            return Response({"error": "Organization not found for the current user."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class OrphanListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get all orphans that are not adopted
            orphans = Orphan.objects.filter(is_adopted=False)
            
            # Serialize orphans
            serializer = OrphanSerializer(orphans, many=True)
            orphan_data = serializer.data
            
            # Check for pending adoption requests by the current user
            if not request.user.is_anonymous:
                for orphan_info in orphan_data:
                    orphan_id = orphan_info['id']
                    orphan_info['has_pending_request'] = Adoption.objects.filter(
                        orphan_id=orphan_id,
                        adopter=request.user,
                        status="pending"
                    ).exists()
            
            return Response(orphan_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

# =============================== Adoption Endpoints ===============================
class AdoptionRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            orphan_id = request.data.get('orphan_id')
            if not orphan_id:
                return Response({"error": "Orphan ID is required"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                orphan = Orphan.objects.get(id=orphan_id, is_adopted=False)
            except Orphan.DoesNotExist:
                return Response({"error": "Orphan not found or already adopted"}, status=status.HTTP_404_NOT_FOUND)

            if Adoption.has_pending_request(orphan, request.user):
                return Response({"error": "You already have a pending adoption request for this orphan"},
                                status=status.HTTP_400_BAD_REQUEST)

            adoption = Adoption.objects.create(
                orphan=orphan,
                adopter=request.user,
                status="pending"
            )

            serializer = AdoptionSerializer(adoption)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AdoptionCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, orphan_id):
        try:
            try:
                adoption = Adoption.objects.get(
                    orphan_id=orphan_id,
                    adopter=request.user,
                    status="pending"
                )
            except Adoption.DoesNotExist:
                return Response({"error": "No pending adoption request found for this orphan"}, 
                                status=status.HTTP_404_NOT_FOUND)
            adoption.delete()
            return Response({"message": "Adoption request cancelled successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserAdoptionRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            adoptions = Adoption.objects.filter(adopter=request.user)
            serializer = AdoptionSerializer(adoptions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class OrganizationAdoptionRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            if request.user.ac_role != 1:
                return Response({"error": "Only organizations can access this endpoint"},
                                status=status.HTTP_403_FORBIDDEN)
            organization = Organizations.objects.get(user=request.user)

            orphans = Orphan.objects.filter(organizations=organization)

            adoption_requests = Adoption.objects.filter(orphan__in=orphans)

            serializer = AdoptionSerializer(adoption_requests, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Organizations.DoesNotExist:
            return Response({"error": "Organization not found for this user"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ApproveAdoptionRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, adoption_id):
        try:
            if request.user.ac_role != 1:
                return Response({"error": "Only organizations can approve adoption requests"},
                                status=status.HTTP_403_FORBIDDEN)

            organization = Organizations.objects.get(user=request.user)

            try:
                adoption = Adoption.objects.get(
                    id=adoption_id,
                    status="pending",
                    orphan__organizations=organization
                )
            except Adoption.DoesNotExist:
                return Response({"error": "Adoption request not found or not pending"},
                                status=status.HTTP_404_NOT_FOUND)

            if adoption.orphan.is_adopted:
                return Response({"error": "This orphan has already been adopted"},
                                status=status.HTTP_400_BAD_REQUEST)

            adoption.status = "approved"
            adoption.approval_date = timezone.now().date()
            adoption.save()

            orphan = adoption.orphan
            orphan.is_adopted = True
            orphan.save()

            Adoption.objects.filter(orphan=orphan, status="pending").exclude(id=adoption.id).update(
                status="rejected"
            )

            serializer = AdoptionSerializer(adoption)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Organizations.DoesNotExist:
            return Response({"error": "Organization not found for this user"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RejectAdoptionRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, adoption_id):
        try:
            if request.user.ac_role != 1:
                return Response({"error": "Only organizations can reject adoption requests"},
                                status=status.HTTP_403_FORBIDDEN)

            organization = Organizations.objects.get(user=request.user)

            try:
                adoption = Adoption.objects.get(
                    id=adoption_id,
                    status="pending",
                    orphan__organizations=organization
                )
            except Adoption.DoesNotExist:
                return Response({"error": "Adoption request not found or not pending"},
                                status=status.HTTP_404_NOT_FOUND)

            # Update adoption staus
            adoption.status = "rejected"
            adoption.save()

            serializer = AdoptionSerializer(adoption)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Organizations.DoesNotExist:
            return Response({"error": "Organization not found for this user"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# =============================== Donation ==============================
class OrphanDonationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            orphan_id = request.data.get('orphan_id')
            amount = request.data.get('amount')

            if not orphan_id or not amount:
                return Response({"error": "Orphan ID and amount are required"}, status=400)

            print(f"Received donation request - orphan_id: {orphan_id}, amount: {amount}") # error checking

            try:
                amount = float(amount)
                if amount <= 0:
                    return Response({"error": "Amount must be greater than zero"}, status=400)
            except ValueError:
                return Response({"error": "Invalid amount format"}, status=400)

            try:
                orphan = Orphan.objects.get(id=orphan_id)
            except Orphan.DoesNotExist:
                return Response({"error": "Orphan not found"}, status=404)

            try:
                organization = orphan.organizations

                donation = Donation.objects.create(
                    donor=request.user,
                    receiver_type="orphan",
                    orphan=orphan,
                    organization=organization,
                    amount=amount,
                    donation_date=datetime.now().date(),
                    status="pending"
                )
                payment_url = f"/payment/process/{donation.id}/"

                return Response({
                    "message": "Donation created successfully",
                    "donation_id": donation.id,
                    "payment_url": payment_url
                }, status=201)
            except Exception as field_error:
                print(f"Field error: {str(field_error)}")
                if "field" in str(field_error).lower():
                    return Response({"error": f"Donation model issue: {str(field_error)}"}, status=400)
                raise

        except Exception as e:
            print(f"Donation error: {str(e)}")
            return Response({"error": str(e)}, status=400)

# Fix the method in OrganizationDonationsView from post to get
class OrganizationDonationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):  # Changed from post to get
        try:
            org = Organizations.objects.get(user=request.user)

            org_donations = Donation.objects.filter(
                organization=org,
                receiver_type='organization',
                status='completed'
            )

            orphan_donations = Donation.objects.filter(
                orphan__organizations=org,
                receiver_type='orphan',
                status='completed'
            )

            donation_data = []

            for donation in org_donations:
                donation_data.append({
                    'id': donation.id,
                    'amount': donation.amount,
                    'receiver_type': 'organization',
                    'user_id': donation.donor.id,
                    'user_name': donation.donor.email,
                    'status': donation.status,
                    'donation_date': donation.donation_date
                })

            for donation in orphan_donations:
                donation_data.append({
                    'id': donation.id,
                    'amount': donation.amount,
                    'receiver_type': 'orphan',
                    'orphan_id': donation.orphan.id,
                    'first_name': donation.orphan.name.split()[0] if ' ' in donation.orphan.name else donation.orphan.name,
                    'last_name': donation.orphan.name.split()[1] if ' ' in donation.orphan.name else '',
                    'user_id': donation.donor.id,
                    'user_name': donation.donor.email,
                    'status': donation.status,
                    'donation_date': donation.donation_date
                })

            donation_data.sort(key=lambda x: x['donation_date'], reverse=True)

            return Response(donation_data, status=status.HTTP_200_OK)

        except Organizations.DoesNotExist:
            return Response({"error": "Organization not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Add the new OrganizationDirectDonationView
class OrganizationDirectDonationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            organization_id = request.data.get('organization_id')
            amount = request.data.get('amount')

            if not organization_id or not amount:
                return Response({"error": "Organization ID and amount are required"}, status=400)

            print(f"Received organization donation request - organization_id: {organization_id}, amount: {amount}")

            try:
                amount = float(amount)
                if amount <= 0:
                    return Response({"error": "Amount must be greater than zero"}, status=400)
            except ValueError:
                return Response({"error": "Invalid amount format"}, status=400)

            try:
                organization = Organizations.objects.get(id=organization_id)
            except Organizations.DoesNotExist:
                return Response({"error": "Organization not found"}, status=404)

            donation = Donation.objects.create(
                donor=request.user,
                receiver_type="organization",
                organization=organization,
                amount=amount,
                donation_date=datetime.now().date(),
                status="pending"
            )

            payment_url = f"/payment/process/{donation.id}/"

            return Response({
                "message": "Donation created successfully",
                "donation_id": donation.id,
                "payment_url": payment_url
            }, status=201)

        except Exception as e:
            print(f"Error in organization donation: {str(e)}")
            return Response({"error": str(e)}, status=400)

class PaymentProcessView(TemplateView):
    template_name = 'payment_process.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        donation_id = self.kwargs.get('donation_id')
        donation = get_object_or_404(Donation, id=donation_id)

        context['donation'] = donation
        if donation.receiver_type == 'orphan':
            context['receiver_name'] = donation.orphan.name
        else:
            context['receiver_name'] = donation.organization.name

        return context

    def post(self, request, *args, **kwargs):
        donation_id = self.kwargs.get('donation_id')
        donation = get_object_or_404(Donation, id=donation_id)

        # In a real system, you'd process the payment here
        # For this example, we'll just mark it as completed
        donation.status = "completed"
        donation.save()

        return redirect('payment_success', donation_id=donation.id)

class PaymentSuccessView(TemplateView):
    template_name = 'payment_success.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        donation_id = self.kwargs.get('donation_id')
        donation = get_object_or_404(Donation, id=donation_id)

        context['donation'] = donation
        if donation.receiver_type == 'orphan':
            context['receiver_name'] = donation.orphan.name
        else:
            context['receiver_name'] = donation.organization.name

        context['pending_approval'] = donation.status == 'pending'

        return context

# ========================== user donation view and seminar register view ======================
class UserDonationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get all donations made by the current user
            donations = Donation.objects.filter(donor=request.user)

            donation_data = []
            for donation in donations:
                data = {
                    "id": donation.id,
                    "amount": donation.amount,
                    "status": donation.status,
                    "donation_date": donation.donation_date,
                    "receiver_type": donation.receiver_type,
                }

                if donation.receiver_type == "orphan" and donation.orphan:
                    data["orphan_id"] = donation.orphan.id
                    data["orphan_name"] = donation.orphan.name
                    if donation.organization:
                        data["organization_name"] = donation.organization.name

                elif donation.receiver_type == "organization" and donation.organization:
                    data["organization_id"] = donation.organization.id
                    data["organization_name"] = donation.organization.name

                donation_data.append(data)

            return Response(donation_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserRegisteredSeminarsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            registrations = SeminarRegistration.objects.filter(user=request.user)

            seminar_data = []
            for registration in registrations:
                seminar = registration.seminar

                org_name = "Unknown Organization"
                if hasattr(seminar, 'created_by') and seminar.created_by:
                    try:
                        org = Organizations.objects.get(user=seminar.created_by)
                        org_name = org.name
                    except Organizations.DoesNotExist:
                        pass

                try:
                    seminar_data.append({
                        "id": seminar.id,
                        "title": getattr(seminar, 'title', 'Unnamed Seminar'),
                        "description": getattr(seminar, 'description', ''),
                        "date": getattr(seminar, 'seminar_date', None),
                        "time": getattr(seminar, 'seminar_time', None),
                        "location": getattr(seminar, 'location', 'Unknown Location'),
                        "organization_name": org_name,
                    })
                except Exception as attr_error:
                    print(f"Error accessing seminar attributes: {attr_error}")
                    seminar_data.append({
                        "id": seminar.id if hasattr(seminar, 'id') else 0,
                        "title": "Data Error",
                        "description": "There was an error retrieving seminar details",
                        "organization_name": org_name,
                        "registration_date": registration.registration_date
                    })

            return Response(seminar_data, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error in UserRegisteredSeminarsView: {str(e)}")
            return Response([], status=status.HTTP_200_OK)

# ============================== reaction ========================
class BlogReactionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, blog_id):
        try:
            blog = Blog.objects.get(id=blog_id)
            reaction_type = request.data.get('reaction_type')

            if reaction_type not in ['like', 'dislike', 'remove']:
                return Response({"error": "Invalid reaction type"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                existing_reaction = BlogReaction.objects.get(user=request.user, blog=blog)

                if reaction_type == 'remove':
                    if existing_reaction.reaction_type == 'like':
                        blog.likes = max(0, blog.likes - 1)
                    else:
                        blog.dislikes = max(0, blog.dislikes - 1)

                    existing_reaction.delete()
                    blog.save()
                    return Response({"message": "Reaction removed"}, status=status.HTTP_200_OK)

                if existing_reaction.reaction_type != reaction_type:
                    if existing_reaction.reaction_type == 'like':
                        blog.likes = max(0, blog.likes - 1)
                        blog.dislikes += 1
                    else:
                        blog.dislikes = max(0, blog.dislikes - 1)
                        blog.likes += 1

                    existing_reaction.reaction_type = reaction_type
                    existing_reaction.save()
                    blog.save()
                    return Response({"message": f"Reaction changed to {reaction_type}"}, status=status.HTTP_200_OK)

                return Response({"message": "Reaction already exists"}, status=status.HTTP_200_OK)

            except BlogReaction.DoesNotExist:
                if reaction_type == 'remove':
                    return Response({"message": "No reaction to remove"}, status=status.HTTP_200_OK)

                BlogReaction.objects.create(
                    user=request.user,
                    blog=blog,
                    reaction_type=reaction_type
                )

                if reaction_type == 'like':
                    blog.likes += 1
                else:
                    blog.dislikes += 1

                blog.save()
                return Response({"message": f"Blog {reaction_type}d"}, status=status.HTTP_201_CREATED)

        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserBlogReactionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            reactions = BlogReaction.objects.filter(user=request.user)
            reaction_data = [
                {
                    "blog_id": reaction.blog.id,
                    "reaction_type": reaction.reaction_type,
                    "created_at": reaction.created_at
                } for reaction in reactions
            ]
            return Response(reaction_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)