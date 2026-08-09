from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
# Create your tests here.

_user = {
    "username": "rahmat",
    "password": "qwertyuiop"
}

class LoginTest(TestCase):
    def setUp(self):
        user1 = User.objects.create_user(username=_user["username"], password=_user["password"])
        user2 = User.objects.create_user(username="rahmat2", password=_user["password"], is_active=False)
        self.url_path = "/auth/login"
        
    def test_login(self):
        response = self.client.post(self.url_path, {
            "username": _user["username"],
            "password": _user["password"],
        })
        self.assertEqual(response.status_code,200)
        self.assertIn("token", response.json())
        self.assertIn("user", response.json())
    
    def test_failed_user_not_found(self):
        response = self.client.post(self.url_path, {
            "username": "rahmat1",
            "password":"wertyui"
        })
        self.assertEqual(response.status_code,400)
        data = response.json()
        errors = data.get("details",{}).get("non_field_errors",[])
        self.assertIn("Invalid credential or user inactive",errors)
    
    def test_empty_payload(self):
        response = self.client.post(self.url_path, {
            "username":"",
            "password":""
        })
        self.assertEqual(response.status_code,400)
        data = response.json()
        errors = data.get("details",{})
        self.assertIn("This field may not be blank.", errors["username"])
        self.assertIn("This field may not be blank.", errors["password"])
        
    def test_invalid_password(self):
        response = self.client.post(self.url_path, {
            "username": _user["username"],
            "password": "23456uy5t4rf"
        })
        self.assertEqual(response.status_code,400)
        data = response.json()
        errors = data.get("details", {}).get("non_field_errors", [])
        self.assertIn("Invalid credential or user inactive",errors)
        
class RegisterTest(TestCase):
    def setUp(self):
        self._user2 = {
            "username": "rahmat2",
            "password": "qwertyuiop"
        }
        self.user = User.objects.create_user(username=self._user2['username'],password=self._user2["password"])
        self.url_path = "/auth/register"
        
    def test_register(self):
        response = self.client.post(self.url_path, {
            "username": _user["username"],
            "password": _user["password"],
            "password_confirm": _user["password"],
            "email": "rahmat@mail.com",
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn("username",response.json())
        self.assertIn("id",response.json())
        
    def test_no_confirm_pass(self):
        response = self.client.post(self.url_path, {
            "username": _user["username"],
            "password": _user["password"],
            "email": "rahmat@mail.com",
        })
        data = response.json()
        errors = data.get("details",{}).get("password_confirm", [])
        self.assertEqual(response.status_code,400)
        self.assertIn("This field is required.", errors)
        
    def test_dup_username(self):
        response = self.client.post(self.url_path, {
            "username": self._user2["username"],
            "password": self._user2["password"],
            "password_confirm": self._user2["password"]
        })
        data = response.json()
        errors = data.get("details",{}).get("username", [])
        self.assertEqual(response.status_code,400)
        self.assertIn("A user with that username already exists.", errors)
        
    def test_empty_field(self):
        response = self.client.post(self.url_path, {
            "username": "",
            "password": "",
            "password_confirm": "",
            "email": ""
        })
        data = response.json()
        errors = data.get("details",{})
        self.assertEqual(response.status_code,400)
        self.assertIn("This field may not be blank.", errors["username"])
        self.assertIn("This field may not be blank.", errors["password"])
        self.assertIn("This field may not be blank.", errors["password_confirm"])
        
    def test_not_match_confirm(self):
        response = self.client.post(self.url_path, {
            "username": _user["username"],
            "password": _user["password"],
            "password_confirm": "qwert4563421"
        })
        data = response.json()
        errors = data.get("details",{}).get("non_field_errors", [])
        self.assertEqual(response.status_code,400)
        self.assertIn("Password and confirm password not match", errors)
             
class ChangePasswordTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username=_user["username"], password=_user["password"])
        
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        
    def test_change_password(self):
        response = self.client.post("/auth/change-password", {
            "old_password": _user["password"],
            "new_password":"qwertyuiop123",
            "confirm_password": "qwertyuiop123",
        },content_type="application/json")
        data = response.json()
        self.assertEqual(response.status_code,200)
        self.assertIn("status", data)
        self.assertEqual(data.get("status"), True)
        # self.assertContains()
        
    def test_empty_fields(self):
        response = self.client.post("/auth/change-password", {
            "old_password": "",
            "new_password":"",
            "confirm_password": "",
        },content_type="application/json")
        data = response.json()
        errors = data.get("details",{})
        self.assertEqual(response.status_code,400)
        self.assertIn("This field may not be blank.", errors.get("old_password"))
        self.assertIn("This field may not be blank.", errors.get("new_password"))
        self.assertIn("This field may not be blank.", errors.get("confirm_password"))
        
    def test_invalid_old_password(self):
        response = self.client.post("/auth/change-password", {
            "old_password": "frgtyyhgre",
            "new_password":"qweruiop123",
            "confirm_password": "qwertyuiop123",
        },content_type="application/json")
        data = response.json()
        errors = data.get("details",{}).get("non_field_errors", [])
        self.assertEqual(response.status_code,400)
        self.assertIn("Old password does not match", errors)
    
    def test_not_match_confirm(self):
        response = self.client.post("/auth/change-password", {
            "old_password": _user["password"],
            "new_password":"qweruiop123",
            "confirm_password": "qwertyuiop312",
        },content_type="application/json")
        data = response.json()
        errors = data.get("details",{}).get("non_field_errors", [])
        self.assertEqual(response.status_code,400)
        self.assertIn("New password and confirm passsword does not match", errors)
        
    def test_not_logged(self):
        self.client.credentials(HTTP_AUTHORIZATION="")
        response = self.client.post("/auth/change-password", {
            "old_password": _user["password"],
            "new_password":"qweruiop123",
            "confirm_password": "qwertyuiop123",
        },content_type="application/json")
        self.assertEqual(response.status_code,401)
        errors = response.json().get("detail", "")
        self.assertIn("Authentication credentials were not provided.",errors)
        
class CheckUsernameTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username=_user["username"], password=_user["password"])
        self.url_path = "/auth/user/check"
        
    def test_username_available(self):
        response = self.client.get(self.url_path+"?username=rahmat2")
        self.assertEqual(response.status_code,200)
        data = response.json()
        self.assertIn("available", data)
        self.assertIn("message", data)
        self.assertEqual(data["available"],True)
        self.assertEqual(data["message"],"Username is available")
    
    def test_username_not_available(self):
        response = self.client.get(self.url_path+f"?username={_user["username"]}")
        self.assertEqual(response.status_code,200)
        data = response.json()
        self.assertIn("available", data)
        self.assertIn("message", data)
        self.assertEqual(data["available"],False)
        self.assertEqual(data["message"],"Username is already taken")
        
    def test_empty_value(self):
        response = self.client.get(self.url_path)
        self.assertEqual(response.status_code,400)
        data = response.json()
        self.assertIn("details",data)
        self.assertIn("username", data.get("details"))
        errors = data.get("details", {}).get("username",[])
        self.assertIn("Username field is required",errors)
        
class UserInfoTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username=_user["username"], password=_user["password"])
        self.url_path = "/auth/user"
        
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
    
    def test_userinfo(self):
        response = self.client.get(self.url_path)
        self.assertEqual(response.status_code,200)
        self.assertIn("username", response.json())
        self.assertEqual(response.json()["username"], _user["username"])
    
    def test_user_not_auth(self):
        self.client.credentials(HTTP_AUTHORIZATION="")
        response = self.client.get(self.url_path)
        self.assertEqual(response.status_code,401)
        data = response.json()
        print(data)
        self.assertIn("detail", data)
        self.assertIn("Authentication credentials were not provided.", data["detail"])