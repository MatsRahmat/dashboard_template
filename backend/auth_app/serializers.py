from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password, verify_password


# ======================================================
#                      Login
# ======================================================
class AuthSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        if not data.get('username') or not data.get('password'):
            raise serializers.ValidationError('Username and password is required')
        user = authenticate(username=data["username"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Invalid credential or user inactive")
        return user
    
# ======================================================
#                      Register 
# ======================================================
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username','password','email','password_confirm']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError('Password and confirm password not match')
        return data
    
    def create(self, validated_data):
        validated_data.pop("password_confirm")
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        return user
    
# ======================================================
#                      Change Password
# ======================================================
class ChangePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['old_password','new_password','confirm_password']
        
    def validate(self, data):
        user = self.instance # auth user
        if not user.check_password(data['old_password']):
            raise serializers.ValidationError("Old password does not match")
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("New password and confirm passsword does not match")
        return data
    
    def update(self, instance, validated_data):
        instance.set_password(validated_data['new_password'])
        instance.save()
        return instance