from django.urls import path
from API.views import get_type_data, check_attempt, get_tests_data, StartTest, get_time_left, get_question_types, get_current_question, update_current_question, update_question_time

urlpatterns = [
    path("check_attempt/", check_attempt, name="Check_Attempts"),
    path("get_tests_data/", get_tests_data, name="Get_Tests_Data"),
    path("start_test/", StartTest, name="starttest"),
    path("get_time_left/", get_time_left, name="Get_time_left"),
    path("get_question_types/", get_question_types, name="Get_Question_Types"),
    path("get_current_question/", get_current_question, name="Get_Current_Question"),
    path("update_current_question/", update_current_question, name="Update_Current_Question"),
    path("update_question_time/", update_question_time, name="update_question_time"),
    path("get_type_data/", get_type_data, name="get_type_data"),
]