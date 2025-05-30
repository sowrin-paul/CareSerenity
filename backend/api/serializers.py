from rest_framework import serializers
from django.contrib.auth import authenticate
from .models .seminar import Seminar
from .models import User, UserProfile
from .models .seminar import Seminar
from .models .organizations import Organizations

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

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"
        read_only_fields = ['user']

class OrganizationProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizations
        fields = "__all__"
        read_only_fields = ['user', "registration_num", "established_date"]