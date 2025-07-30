from django.contrib.auth import user_logged_in
from django.shortcuts import render, get_object_or_404 , redirect
from .models import Product
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from .models import Product, Review
from django.db.models import Avg, Count
from django.db.models import Q



# Create your views here.
def product_list(request):
    products = Product.objects.all()
    context = {
        'products': products,
    }
    return render(request , 'Products_list.html' , context)
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