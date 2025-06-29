from rest_framework import serializers
from django.contrib.auth import authenticate
from .models .seminar import Seminar
from .models import User, UserProfile
from .models .seminar import Seminar
from .models .organizations import Organizations
from .models .seminarRegister import SeminarRegistration
from .models .blogs import Blog
from .models .volunteer import Volunteer
from .models .volunteerApplication import VolunteerApplication

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    ac_role = serializers.IntegerField(required=True)

    class Meta:
        model = User
        fields = ["email", "password", "ac_role"]
    def create(self, validated_data):
        role = validated_data["ac_role"]
        is_active = True
        if role == 1:
            is_active = False
        return User.objects.create_user(
            email = validated_data["email"],
            password = validated_data["password"],
            ac_role = role,
            is_active = is_active,
        )

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data["email"], password=data["password"])
        if user is None:
            raise serializers.ValidationError("Invalid email or password")
        elif not user.is_active:
            raise serializers.ValidationError("User is not active")
        return {"user": user}

class SeminarSerializers(serializers.ModelSerializer):
    class Meta:
        model = Seminar
        fields = "__all__"

class SeminarRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeminarRegistration
        fields = ['id', 'user', 'seminar', 'registered_at']
        read_only_fields = ['registered_at']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"
        read_only_fields = ['user']

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizations
        fields = ['id', 'name', 'contact', 'website']

class OrganizationProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizations
        fields = "__all__"
        read_only_fields = ["user", "registration_num"]

    def validate_name(self, value):
        if Organizations.objects.filter(name=value).exists():
            raise serializers.ValidationError("An organization with this name already exists.")
        return value

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'image', 'author', 'created_at']
        read_only_fields = ['author', 'created_at']

class VolunteerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Volunteer
        fields = ['id', 'seminar', 'organization', 'volunteer', 'assigned_at']
        read_only_fields = ['assigned_at']

class VolunteerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerApplication
        fields = ['id', 'seminar', 'user', 'applied_at']
        read_only_fields = ['applied_at']