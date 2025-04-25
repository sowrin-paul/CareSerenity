from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "ac_role"]

    def create(self, validated_data):
        user = User.objects.create_user(
            email = self.validated_data["email"],
            password = self.validated_data["password"],
            ac_role = self.validated_data.get("ac_role", 0),
        )
        user.save()

        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data["email"], password=data["password"])
        if user is None:
            raise serializers.ValidationError("Invalid email or password")
        elif not user.is_active:
            raise serializers.ValidationError("User is not active")
        return user