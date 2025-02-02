from django.urls import path
from API.views import check_attempt, get_tests_data, StartTest, get_time_left

urlpatterns = [
    path("check_attempt/", check_attempt, name="Check_Attempts"),
    path("get_tests_data/", get_tests_data, name="Get_Tests_Data"),
    path("start_test/", StartTest, name="starttest"),
    path("get_time_left/", get_time_left, name="Get_time_left")
]