from .models import Product, Category, Review, ProductImage, ColorOption
from django.contrib import admin
from django import forms


# Inline for ProductImage
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

# Inline for ColorOption
class ColorOptionInlineForm(forms.ModelForm):
    class Meta:
        model = ColorOption
        fields = ['color_code']
        widgets = {
            'color_code': forms.TextInput(attrs={'type': 'color'}),
        }
class ColorOptionInline(admin.TabularInline):
    model = ColorOption
    form = ColorOptionInlineForm
    fields = ['color_name', 'color_code']
    extra = 1

# Inline for Review
class ReviewInline(admin.TabularInline):
    model = Review
    extra = 1

class ProductAdmin(admin.ModelAdmin):
    inlines = [
        ProductImageInline,
        ColorOptionInline,
        ReviewInline,
    ]

admin.site.register(Product, ProductAdmin)
admin.site.register(Category)