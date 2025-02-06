from django.urls import path
from API.views import get_last_number, get_answer, update_answer, update_answer_type, get_question, get_answer_type, get_type_data, check_attempt, get_tests_data, StartTest, get_time_left, get_question_types, get_current_question, update_current_question, update_question_time

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
    path("get_answer_type/", get_answer_type, name="get_answer_type"),
    path("get_answer/", get_answer, name="get_answer"),
    path("get_question/", get_question, name="get_answer"),
    path("get_last_number/", get_last_number, name="get_last_number"),
    path("update_answer_type/", update_answer_type, name="update_answer_type"),
    path("update_answer/", update_answer, name="update_answer"),
]