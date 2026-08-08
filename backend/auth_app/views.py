from django.shortcuts import render
from django.contrib.auth.models import User, update_last_login

from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from rest_framework.parsers import JSONParser
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import (
     IsAuthenticated
     ,IsAuthenticatedOrReadOnly
     ,AllowAny
)
from rest_framework import status
from rest_framework.views import (
    APIView,
)

from .serializers import (
    AuthSerializer,
    RegisterSerializer
)

# Create your views here
# ======================================================
#                         [ Login ]
# ======================================================
class AuthView(APIView):
    allowed_methods = ['post']
    def post(self, request, *args, **kwargs):
        serializer = AuthSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)
            # token, created = Token.objects.get_or_create(user=user)
            update_last_login(None, user)
            return Response({
                "token": {
                    "access": access,
                    "refresh":str(refresh)
                    },
                "user":{
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "last_login": user.last_login,
                    }
            },status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
# ======================================================
#                        [ Register ]
# ======================================================
class RegisterView(APIView):
    allowed_methods = ['post']
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "id": user.id,
                "username":user.username
                }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
# ======================================================
#                      [ Username Check ]
# ======================================================
class UsernameCheckView(APIView):
    allowed_methods = ["get"]
    
    def get(self, request):
        username = request.query_params.get("username")
        if not username:
            return Response({"errors":{"username": ["username field is required"]}}, status=status.HTTP_400_BAD_REQUEST)    
        
        exists = User.objects.filter(username=username).exists()
        resp_mesg = {}
        if exists:
            resp_mesg = {
                "available": False,
                "message": "Username is already taken"
            }
        else:
             resp_mesg = {
            "available": True,
            "message": "Username is available"
        }      
        return Response(resp_mesg, status=status.HTTP_200_OK)
        
        
# ======================================================
#                        [ User Info ]
# ======================================================
class UserInfoView(APIView):
    allowed_methods = ["get"]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "last_login": user.last_login,
            "is_staff": user.is_staff,
            }, status=status.HTTP_200_OK)

# ======================================================
#                        [ Get Access ]
# ======================================================
class RefreshTokenView(APIView):
    allowed_methods = ["post"]
    
    def post(self, request):
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({
                "errors":{"refresh": ["Refresh token is required"]}
            },status=status.HTTP_400_BAD_REQUEST)
        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)
            return Response({
                "access": new_access,
            },status=status.HTTP_200_OK)
        except TokenError:
            return Response({
                "errors": {"refresh": ["Invalid or expire refresh token"]}
            }, status=status.HTTP_400_BAD_REQUEST)