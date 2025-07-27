from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.decorators import login_required

def index(request):
    context = {}
    return render(request ,'MainPage.html', context)
def about(request):
    context = {}
    return render(request , 'about_us.html' , context)
def contact(request):
    context = {}
    return render(request,'contactUs.html', context)