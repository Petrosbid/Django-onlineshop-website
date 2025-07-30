from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.contrib.auth.decorators import login_required
import json

def index(request):
    context = {}
    return render(request ,'MainPage.html', context)

def about(request):
    context = {}
    return render(request , 'about_us.html' , context)

def contact(request):
    context = {}
    return render(request,'contactUs.html', context)

def loginuser(request):
    if request.user.is_authenticated:
        return redirect('index')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        if username and password:
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, 'خوش آمدید!')
                return redirect('index')
            else:
                messages.error(request, 'نام کاربری یا رمز عبور اشتباه است.')
        else:
            messages.error(request, 'لطفاً تمام فیلدها را پر کنید.')
    
    context = {}
    return render(request , 'Login.html', context)

def signupuser(request):
    if request.user.is_authenticated:
        return redirect('index')
    
    if request.method == 'POST':
        username = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        password = request.POST.get('password')
        
        # Validation
        if not all([username, email, password]):
            messages.error(request, 'لطفاً تمام فیلدهای ضروری را پر کنید.')
            return render(request, 'signup.html')
        
        # Check if username already exists
        if User.objects.filter(username=username).exists():
            messages.error(request, 'این نام کاربری قبلاً استفاده شده است.')
            return render(request, 'signup.html')
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            messages.error(request, 'این ایمیل قبلاً ثبت شده است.')
            return render(request, 'signup.html')
        
        # Create user
        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=username  # Store username as first_name for display
            )
            
            # Log the user in after successful registration
            login(request, user)
            messages.success(request, 'حساب کاربری شما با موفقیت ایجاد شد!')
            return redirect('index')
            
        except Exception as e:
            messages.error(request, 'خطا در ایجاد حساب کاربری. لطفاً دوباره تلاش کنید.')
    
    context = {}
    return render(request , 'signup.html', context)

def logoutuser(request):
    logout(request)
    messages.success(request, 'شما با موفقیت خارج شدید.')
    return redirect('index')

def userdashboard(request):
    context = {}
    return render(request , 'userdashboard.html', context)


