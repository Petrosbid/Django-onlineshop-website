from django.contrib.auth import user_logged_in
from django.shortcuts import render, get_object_or_404 , redirect
from .models import Product, Category
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from .models import Product, Review
from django.db.models import Avg, Count, Q
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.csrf import csrf_exempt
from Account.models import Cart, CartItem
import json
from django.core.paginator import Paginator
from django.db.models import Min, Max


# Create your views here.
def product_list(request):
    # Get all products with related data
    products = Product.objects.select_related('category').prefetch_related('images', 'colors', 'reviews').all()
    
    # Get filter parameters
    search_query = request.GET.get('search', '')
    category_filter = request.GET.get('category', '')
    brand_filter = request.GET.get('brand', '')
    price_range = request.GET.get('price_range', '')
    sort_by = request.GET.get('sort', '')
    min_rating = request.GET.get('min_rating', '')
    discount_filter = request.GET.get('discount', '')
    stock_filter = request.GET.get('stock', '')
    color_filter = request.GET.getlist('colors', [])
    
    # Apply search filter
    if search_query:
        products = products.filter(
            Q(title__icontains=search_query) |
            Q(short_description__icontains=search_query) |
            Q(full_description__icontains=search_query) |
            Q(category__name__icontains=search_query) |
            Q(material__icontains=search_query)
        )
    
    # Apply category filter
    if category_filter:
        products = products.filter(category__name__icontains=category_filter)
    
    # Apply brand filter (assuming brand is part of title or material)
    if brand_filter:
        products = products.filter(
            Q(title__icontains=brand_filter) |
            Q(material__icontains=brand_filter)
        )
    
    # Apply price range filter
    if price_range:
        try:
            min_price, max_price = price_range.split('-')
            min_price = int(min_price) if min_price else 0
            max_price = int(max_price) if max_price else float('inf')
            
            if max_price != float('inf'):
                products = products.filter(price__gte=min_price, price__lte=max_price)
            else:
                products = products.filter(price__gte=min_price)
        except (ValueError, AttributeError):
            pass
    
    # Apply rating filter
    if min_rating:
        try:
            min_rating = int(min_rating)
            # Get products with average rating >= min_rating
            products = products.annotate(avg_rating=Avg('reviews__rating')).filter(avg_rating__gte=min_rating)
        except ValueError:
            pass
    
    # Apply discount filter
    if discount_filter:
        try:
            min_discount = int(discount_filter)
            products = products.filter(discount_percent__gte=min_discount)
        except ValueError:
            pass
    
    # Apply stock filter
    if stock_filter == 'in-stock':
        products = products.filter(stock__gt=0)
    elif stock_filter == 'out-of-stock':
        products = products.filter(stock=0)
    
    # Apply color filter
    if color_filter:
        products = products.filter(colors__color_name__in=color_filter).distinct()
    
    # Apply sorting
    if sort_by:
        if sort_by == 'price-low':
            products = products.order_by('price')
        elif sort_by == 'price-high':
            products = products.order_by('-price')
        elif sort_by == 'name-asc':
            products = products.order_by('title')
        elif sort_by == 'name-desc':
            products = products.order_by('-title')
        elif sort_by == 'rating':
            products = products.annotate(avg_rating=Avg('reviews__rating')).order_by('-avg_rating')
        elif sort_by == 'discount':
            products = products.order_by('-discount_percent')
        elif sort_by == 'newest':
            products = products.order_by('-id')
        elif sort_by == 'oldest':
            products = products.order_by('id')
    else:
        # Default sorting by newest first
        products = products.order_by('-id')
    
    # Get filter options for the template
    categories = Category.objects.all()
    brands = Product.objects.values_list('material', flat=True).distinct()
    price_stats = products.aggregate(
        min_price=Min('price'),
        max_price=Max('price')
    )
    
    # Pagination
    paginator = Paginator(products, 12)  # 12 products per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'products': page_obj,
        'categories': categories,
        'brands': brands,
        'price_stats': price_stats,
        'search_query': search_query,
        'category_filter': category_filter,
        'brand_filter': brand_filter,
        'price_range': price_range,
        'sort_by': sort_by,
        'min_rating': min_rating,
        'discount_filter': discount_filter,
        'stock_filter': stock_filter,
        'color_filter': color_filter,
    }
    
    # Return JSON for AJAX requests
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        products_data = []
        for product in page_obj:
            main_image = product.images.filter(is_main=True).first()
            avg_rating = product.reviews.aggregate(avg=Avg('rating'))['avg'] or 0
            total_reviews = product.reviews.count()
            
            products_data.append({
                'id': product.id,
                'title': product.title,
                'price': product.price,
                'original_price': product.original_price,
                'discount_percent': product.discount_percent,
                'category': product.category.name if product.category else '',
                'image': main_image.image.url if main_image else '',
                'rating': round(avg_rating, 1),
                'total_reviews': total_reviews,
                'stock': product.stock,
                'in_stock': product.stock > 0,
                'url': f'/Product/{product.id}'
            })
        
        return JsonResponse({
            'products': products_data,
            'total_count': paginator.count,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
            'current_page': page_obj.number,
            'total_pages': paginator.num_pages,
        })
    
    return render(request, 'Products_list.html', context)


@require_GET
def get_filter_options(request):
    """Get filter options for AJAX requests"""
    categories = Category.objects.all()
    brands = Product.objects.values_list('material', flat=True).distinct()
    colors = Product.objects.values_list('colors__color_name', flat=True).distinct()
    
    # Get price range
    price_stats = Product.objects.aggregate(
        min_price=Min('price'),
        max_price=Max('price')
    )
    
    return JsonResponse({
        'categories': list(categories.values('id', 'name')),
        'brands': list(brands),
        'colors': list(set(colors)),  # Remove duplicates
        'price_stats': price_stats,
    })


@require_GET
def search_suggestions(request):
    """Get search suggestions for autocomplete"""
    query = request.GET.get('q', '')
    if len(query) < 2:
        return JsonResponse({'suggestions': []})
    
    # Search in product titles and categories
    products = Product.objects.filter(
        Q(title__icontains=query) |
        Q(category__name__icontains=query)
    )[:5]
    
    suggestions = []
    for product in products:
        suggestions.append({
            'id': product.id,
            'title': product.title,
            'category': product.category.name if product.category else '',
            'price': product.price,
            'url': f'/Product/{product.id}'
        })
    
    return JsonResponse({'suggestions': suggestions})



def product_post(request, post_id):
    user_commented = False
    product = get_object_or_404(Product, id=post_id)
    comments = product.reviews.all()

    if request.user.is_authenticated:  # Check if the user is logged in
        user_name = request.user.username
        # Check if any comment matches the current user's username
        user_commented = comments.filter(reviewer_name=user_name).exists()

    main_image = product.images.filter(is_main=True).first()
    features_list = [f.strip() for f in product.features.split(',')] if product.features else []
    
    # Calculate product rating statistics
    rating_stats = product.reviews.aggregate(
        avg_rating=Avg('rating'),
        total_reviews=Count('id')
    )
    
    # Get average rating or default to 0
    avg_rating = rating_stats['avg_rating'] or 0
    total_reviews = rating_stats['total_reviews']

    # Get related products
    related_products = Product.objects.filter(
        Q(category=product.category) |  # Same category
        Q(material=product.material) |   # Same material
        Q(price__range=(product.price * 0.7, product.price * 1.3))  # Similar price range
    ).exclude(id=product.id).distinct()[:3]  # Exclude current product, limit to 3

    # If not enough related products, get some random products
    if related_products.count() < 3:
        additional_products = Product.objects.exclude(
            id__in=[p.id for p in related_products] + [product.id]
        ).order_by('?')[:3 - related_products.count()]
        related_products = list(related_products) + list(additional_products)

    # Handle comment submission
    if request.method == "POST" and request.user.is_authenticated:
        rating = request.POST.get("rating")
        text = request.POST.get("text")
        if rating and text:
            Review.objects.create(
                product=product,
                reviewer_name=request.user.get_full_name() or request.user.username,
                rating=rating,
                text=text
            )
            # Redirect to prevent form resubmission on refresh
            return redirect('Product:Product_post', post_id=post_id)

    context = {
        'product': product,
        'comments': comments,
        'main_image': main_image,
        'features_list': features_list,
        'avg_rating': avg_rating,
        'total_reviews': total_reviews,
        'user_commented': user_commented,
        'related_products': related_products,
    }
    return render(request, 'product-detail.html', context)


@login_required
@require_POST
def add_to_cart(request):
    """Add a product to the user's cart"""
    try:
        data = json.loads(request.body)
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        selected_color = data.get('color', None)
        
        if not product_id:
            return JsonResponse({'success': False, 'message': 'Product ID is required'})
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'محصول یافت نشد'}, status=404)
        
        # Get or create user's cart
        cart, created = Cart.objects.get_or_create(user=request.user)
        
        # Check if product already exists in cart
        cart_item, item_created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not item_created:
            # Product already exists, update quantity
            cart_item.quantity += quantity
            cart_item.save()
        
        return JsonResponse({
            'success': True, 
            'message': 'محصول با موفقیت به سبد خرید اضافه شد',
            'cart_count': cart.total_items()
        })
        
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'خطا در افزودن به سبد خرید: {str(e)}'})