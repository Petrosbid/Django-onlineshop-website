from django.urls import path, include
from .views import product_post , product_list
from .models import Product

app_name = 'Product'
urlpatterns = ([
    path('', product_list, name='Show_products'),
    path('Product/<post_id>', product_post, name='Product_post'),
])