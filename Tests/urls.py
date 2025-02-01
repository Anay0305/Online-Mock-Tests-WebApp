from django.urls import path
from Tests.views import check_attempt, get_ids

urlpatterns = [
    path("check_attempt/", check_attempt, name="Check_Attempts"),
    path("get_ids/", get_ids, name="Get_Ids"),
]