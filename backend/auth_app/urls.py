from django.urls import path, include
from .views import (
    AuthView,
    RegisterView,
    UserInfoView,
    RefreshTokenView,
    UsernameCheckView,
)

urlpatterns = [
    path('login', AuthView.as_view(), name="login"),
    path('register', RegisterView.as_view(),name="register"),
    path('user', UserInfoView.as_view(), name="user-info"),
    path('token/refresh', RefreshTokenView.as_view(), name="refresh-token"),
    path('user/check', UsernameCheckView.as_view(), name="username-check"),
]
