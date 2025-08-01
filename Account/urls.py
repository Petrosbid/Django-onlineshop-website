from django.urls import path, include
from .views import *
from .models import *


app_name = 'Account'
urlpatterns = [
    path('userdashboard/', userdashboard, name='userdashboard'),
    path('userdashboard/order/<int:order_id>/', order_details, name='order_details'),
    path('logout/', logout_view, name='logout'),
    path('usercart/', usercart, name='usercart'),
    path('update-cart-item/', update_cart_item, name='update_cart_item'),
    path('remove-cart-item/', remove_cart_item, name='remove_cart_item'),
    path('cart/add-to-cart/', add_to_cart, name='add_to_cart'),
    path('checkout/', proceed_to_checkout, name='checkout'),
    path('userdashboard/userdetails/', user_details, name='userdetails'),
    
    # Account management endpoints
    path('update-profile/', update_profile, name='update_profile'),
    path('change-password/', change_password, name='change_password'),
    path('add-address/', add_address, name='add_address'),
    path('update-address/', update_address, name='update_address'),
    path('delete-address/', delete_address, name='delete_address'),
    path('set-default-address/', set_default_address, name='set_default_address'),
    
    # Debug endpoint
    path('debug-ajax/', debug_ajax, name='debug_ajax'),
]