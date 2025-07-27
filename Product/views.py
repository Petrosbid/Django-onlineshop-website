from django.shortcuts import render, get_list_or_404, get_object_or_404
from .models import Product


# Create your views here.
def product_list(request):
    products = Product.objects.all()
    context = {
        'products': products,
    }
    return render(request , 'Products_list.html' , context)
def product_post(request, post_id):
    product = get_object_or_404(Product, id=post_id)

    # # Get comments for this product
    # content_type = ContentType.objects.get_for_model(Post)
    # comments = Comment.objects.filter(
    #     content_type=content_type,
    #     object_id=post_id,
    #     status='approved'
    # ).order_by('-created_at')

    context = {
        'product': product,
        # 'comments': comments,
    }
    return render(request, 'product-detail.html', context)