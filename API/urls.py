from django.urls import path
from API.views import check_attempt, get_ids, StartTest

urlpatterns = [
    path("check_attempt/", check_attempt, name="Check_Attempts"),
    path("get_ids/", get_ids, name="Get_Ids"),
    path("start_test/", StartTest, name="starttest"),
]