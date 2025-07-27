from django.db import models

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Product(models.Model):
    title = models.CharField(max_length=255)
    short_description = models.TextField(blank=True)
    full_description = models.TextField(blank=True)
    price = models.PositiveIntegerField()
    original_price = models.PositiveIntegerField(blank=True, null=True)
    discount_percent = models.PositiveSmallIntegerField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    material = models.CharField(max_length=100, blank=True)
    compatibility = models.CharField(max_length=255, blank=True)
    thickness_mm = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    weight_g = models.PositiveSmallIntegerField(blank=True, null=True)
    stock = models.PositiveIntegerField(default=0)
    features = models.TextField(blank=True, help_text="Comma-separated list of features")

    def __str__(self):
        return self.title

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_main = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.product.title} Image"

class ColorOption(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='colors')
    color_name = models.CharField(max_length=50)
    color_code = models.CharField(max_length=7, help_text="Hex code, e.g. #000000")

    def __str__(self):
        return f"{self.product.title} - {self.color_name}"

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    reviewer_name = models.CharField(max_length=100)
    rating = models.PositiveSmallIntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    text = models.TextField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.reviewer_name} - {self.product.title}"

class RelatedProduct(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='related_products')
    related = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='is_related_to')

    def __str__(self):
        return f"{self.product.title} related to {self.related.title}"

class ShippingInfo(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='shipping_info')
    tehran_time = models.CharField(max_length=100)
    other_cities_time = models.CharField(max_length=100)
    free_shipping_threshold = models.PositiveIntegerField()
    shipping_cost = models.PositiveIntegerField()
    return_policy = models.TextField()

    def __str__(self):
        return f"Shipping info for {self.product.title}"
