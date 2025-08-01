from django.urls import path, include
from .views import product_post , product_list, add_to_cart, get_filter_options, search_suggestions
from .models import Product

app_name = 'Product'
urlpatterns = ([
    path('', product_list, name='Show_products'),
    path('Product/<post_id>', product_post, name='Product_post'),
    path('add-to-cart/', add_to_cart, name='add_to_cart'),
    path('api/filter-options/', get_filter_options, name='filter_options'),
    path('api/search-suggestions/', search_suggestions, name='search_suggestions'),
])