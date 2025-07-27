from .models import Product, Category, Review, ShippingInfo , ProductImage , ColorOption , RelatedProduct

from django.contrib import admin

# Register your models here.
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(ProductImage)
admin.site.register(ColorOption)
admin.site.register(Review)
admin.site.register(RelatedProduct)
admin.site.register(ShippingInfo)