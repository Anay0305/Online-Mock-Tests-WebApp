from django.shortcuts import render,HttpResponse,redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Attempt
import json

@login_required(login_url="login")
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