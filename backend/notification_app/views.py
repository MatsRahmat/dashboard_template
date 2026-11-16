import time
import json
from django.shortcuts import render
from rest_framework.views import APIView
from django.http import StreamingHttpResponse, HttpResponse
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from notification_app.redis_client import redis_client
from rest_framework_simplejwt.authentication import JWTAuthentication


# Create your views here.
    
def sse_dashboard_notification(request, user_id):
    is_valid_session = True
    token = request.COOKIES.get("access_token")
    if not token:
        is_valid_session = False
        # return HttpResponse(f"Unauthorized", content_type="text/event-stream", status=401)
    else:
        jwt_auth = JWTAuthentication()
        validated_token = jwt_auth.get_validated_token(token)
        user = jwt_auth.get_user(validated_token)
        request.user = user
    
    def event_stream():
        if not is_valid_session:
            yield "event: error\ndata:'Unauthorized'\n\n"
            return
        
        pubsub = redis_client.pubsub()
        channels = "sse_dashboard_notification"
        pubsub.subscribe(channels)
        for message in pubsub.listen():
            if message["type"] == "message":
                print("mesage:", message["data"])
                yield json.dumps({"data": message["data"]}) + "\n"
            time.sleep(0.1)
        # yield f"Hello from dashboard {user_id}"
    response = StreamingHttpResponse(event_stream(), content_type="text/event-stream")
    response['Cache-Control'] = 'no-cache'
    return response


def sse_test_notif(request):
    redis_client.publish("sse_dashboard_notification", "testing message untuk sse")
    return HttpResponse(f"Success send event to sse", status=200)
