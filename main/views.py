from django.shortcuts import render,HttpResponse,redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required, user_passes_test
from django.views.decorators.csrf import csrf_exempt
from API.models import TestStatus
import json

@user_passes_test(lambda user: not user.is_authenticated, login_url='/')
def SignUp(request):

    if request.method=='POST':
        uname=request.POST.get('username')
        email=request.POST.get('email')
        pass1=request.POST.get('password1')
        pass2=request.POST.get('password2')

        if User.objects.filter(username=uname).exists():
            request.session['error_message'] = "A User already exists with this Username."
            request.session['username'] = uname
            request.session['email'] = email
            return redirect('signup')
        elif pass1!=pass2:
            request.session['alert_message'] = "Passwords do not match."
            request.session['username'] = uname
            request.session['email'] = email
            request.session['password'] = pass1
            return redirect('signup')
        else:
            my_user=User.objects.create_user(uname,email,pass1)
            my_user.save()
            return redirect('login')

    error_message = request.session.pop('error_message', None)
    alert_message = request.session.pop('alert_message', None)
    username = request.session.pop('username', '')
    email = request.session.pop('email', '')
    password = request.session.pop('password', '')

    return render(request, 'signup.html', {
        'error_message': error_message,
        'alert_message': alert_message,
        'username': username,
        'email': email,
        'password': password,
    })

@user_passes_test(lambda user: not user.is_authenticated, login_url='/')
def Login(request):
    if request.method=='POST':
        username=request.POST.get('username')
        pass1=request.POST.get('pass')
        user=authenticate(request,username=username,password=pass1)
        if user is not None:
            login(request,user)
            return redirect('home')
        else:
            request.session['error_message'] = "Username or Password is incorrect!"
            return redirect('login')
    error_message = request.session.pop('error_message', None)
    return render (request,'login.html', {
        'error_message': error_message,
    })

@login_required(login_url='login')
def Home(request):
    return render(request, 'home.html')

@login_required(login_url='login')
def Test(request):
    testid = request.GET.get('testid')
    if testid:
        test_status = TestStatus.objects.filter(user=request.user, test_id=testid).first()
        if test_status and test_status.test_started:
            return render(request, 'start_test.html')
    return render(request, 'test.html')

def LogoutPage(request):
    logout(request)
    return redirect('login')

def custom_404(request, exception):
    return render(request, '404.html', status=404)