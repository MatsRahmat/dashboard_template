import logging
from django.shortcuts import render
from django.contrib.auth.models import User, update_last_login

from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework.parsers import JSONParser
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import (
     IsAuthenticated
     ,IsAuthenticatedOrReadOnly
     ,AllowAny
)
from rest_framework import status
from rest_framework.views import (
    APIView,
)

from auth_app.serializers import (
    AuthSerializer,
    RegisterSerializer,
    ChangePasswordSerializer,
)

err_log = logging.getLogger("error")
app_log = logging.getLogger("myapp")

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
            response = Response({
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
            response.set_cookie(
                key="access_token",
                value=access,
                httponly=True,
                # samesite="Lax", # untuk same site
                samesite="None", 
                #TODO: ubah value dari env, karna di production harus true
                secure=True,
            )
            return response
        return Response({
            "details": serializer.errors,
            },status=status.HTTP_400_BAD_REQUEST)
    
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
                "username":user.username,
                "mesg": "Success create user"
                }, status=status.HTTP_201_CREATED)
        
        err_log.error(serializer.errors)
        return Response({
            "details": serializer.errors,
            }, status=status.HTTP_400_BAD_REQUEST)
            
# ======================================================
#                      [ Username Check ]
# ======================================================
class UsernameCheckView(APIView):
    allowed_methods = ["get"]
    
    def get(self, request):
        username = request.query_params.get("username")
        if not username:
            return Response({"details":{"username": ["Username field is required"]}}, status=status.HTTP_400_BAD_REQUEST)    
        
        exists = User.objects.filter(username=username).exists()
        resp_mesg = {}
        if exists:
            resp_mesg = {
                "available": False,
                "message": "Username is already taken",
                "detail": "Username is already taken",
            }
        else:
             resp_mesg = {
            "available": True,
            "message": "Username is available",
            "detail": "Username is available",
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
                      
# ======================================================
#                        [ Change Password ]
# ======================================================
class ChangePasswordView(APIView):
    allowed_methods = ["post"]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(instance=self.request.user, data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            user = serializer.update(self.request.user, validated_data)
            return Response({
                "status":True,
            }, status=status.HTTP_200_OK, content_type="application/json")
        return Response({"details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
# ======================================================
#            [ Obtain Cookie for credential ]
# ======================================================

class ObtainCookieTokenView(APIView):
    allowed_methods = ["get"]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        auth_header = request.headers.get("Authorization")
        access = auth_header.split(" ")[1]
        print("acess token: ", access)
        response = Response("message:Success set access token pada cookie")
        response.set_cookie(
            key="access_token",
            value=access,
            httponly=True,
            samesite="Lax",
            #TODO: ubah value dari env, karna di production harus true
            secure=False,
        )
        return response