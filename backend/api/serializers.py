from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "ac_role"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data.get("username"),
            email = validated_data["email"],
            password = validated_data["password"],
            ac_role = validated_data.get("ac_role", 0),
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data["email"], password=data["password"])
        if user is not None:
            raise serializers.ValidationError("Invalid email")
        elif not user.is_active:
            raise serializers.ValidationError("User is not active")
        return user