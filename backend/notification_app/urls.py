from django.urls import path
from notification_app.views import (
    sse_dashboard_notification,
    sse_test_notif
)

urlpatterns = [
    path('dashboard/<int:user_id>', sse_dashboard_notification, name="dashboard_notification"),
    path('test', sse_test_notif, name="dashboard_test_notif")
]
