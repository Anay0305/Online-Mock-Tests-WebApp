from django.shortcuts import render,HttpResponse,redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils import timezone
from .models import Attempt, Test, TestStatus
from datetime import timedelta
import json

def formattime(time: int):
    ls = ""
    if time//60 != 0:
        if time//60 == 1:
            ls+="1 hr "
        else:
            ls+=f"{time//60} hrs "
    if time%60 != 0:
        if time%60 == 1:
            ls+="1 min "
        else:
            ls+=f"{time%60} mins "
    return ls.strip()

@login_required
@csrf_exempt
def check_attempt(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get('username')
            test_id = data.get('test_id')

            if not username or not test_id:
                return JsonResponse({"error": "Missing username or test_id"}, status=400)

            try:
                attempt = Attempt.objects.get(username=username)
            except Attempt.DoesNotExist:
                return JsonResponse({"check": False})

            if test_id in attempt.data:
                if attempt.data[test_id] == 0:
                    return JsonResponse({"check": False})
                return JsonResponse({"check": True, "count": attempt.data[test_id]})
            else:
                return JsonResponse({"check": False})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def get_tests_data(request):
    x = Test.objects.all()
    dic = {}
    for i in x:
        dic[i.TestId] = {
            "name": i.Name,
            "time": formattime(int(i.Time))
        }
    return JsonResponse(dic)

@csrf_exempt
@login_required(login_url='login')
def StartTest(request):
    if request.method == "POST":
        data = json.loads(request.body)
        testid = data.get('testid')

        if testid is not None:
            test = Test.objects.get(TestId=testid)
            user_test_status, created = TestStatus.objects.get_or_create(user=request.user, Test=test)
            user_test_status.test_started = True
            user_test_status.save()

            return JsonResponse({"status": "Test started"})
        return JsonResponse({"error": "Test ID is missing"}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@login_required(login_url='login')
def get_time_left(request):
    if request.method == "POST":
        data = json.loads(request.body)
        testid = data.get('test_id')
        test = Test.objects.get(TestId=testid)
        user_test = TestStatus.objects.get(user=request.user, Test=test)
        test_details = Test.objects.get(TestId=testid)
        if user_test is not None:
            end_time = user_test.created_at + timedelta(minutes=test_details.Time)
            time_left = end_time.timestamp() - timezone.now().timestamp()
            print(round(time_left))
            return JsonResponse({"time_left": round(time_left)})
        else:
            return JsonResponse({"error": "No Test Found"}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@login_required
def submit_test(request):
    pass