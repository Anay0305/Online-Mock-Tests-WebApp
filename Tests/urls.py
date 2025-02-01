from django.urls import path
from Tests.views import check_attempt

urlpatterns = [
    path("check_attempt/", check_attempt, name="Check_Attempts"),
]