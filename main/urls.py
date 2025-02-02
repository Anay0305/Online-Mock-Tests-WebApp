from django.urls import path
from main.views import SignUp, Login, Home, Test_url, LogoutPage

urlpatterns = [
    path("", Home, name="home"),
    path("signup/", SignUp, name="signup"),
    path("test/", Test_url, name="test"),
    path("login/", Login, name="login"),
    path("logout/", LogoutPage, name="logout"),
]