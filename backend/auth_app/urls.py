from django.urls import path, include
from auth_app.views import (
    AuthView,
    RegisterView,
    UserInfoView,
    RefreshTokenView,
    UsernameCheckView,
    ChangePasswordView,
)

urlpatterns = [
    path('login', AuthView.as_view(), name="login"),
    path('register', RegisterView.as_view(),name="register"),
    path('user', UserInfoView.as_view(), name="user-info"),
    path('change-password', ChangePasswordView.as_view(), name='change-password'),
    path('token/refresh', RefreshTokenView.as_view(), name="refresh-token"),
    path('user/check', UsernameCheckView.as_view(), name="username-check"),
]
