from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from .models import Product
from Account.models import Cart, CartItem
import json

User = get_user_model()

class AddToCartTestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            mobile_number='09123456789',
            password='testpass123'
        )
        
        # Create a test product
        self.product = Product.objects.create(
            title='Test Product',
            price=100000,
            short_description='Test product description',
            full_description='Full test product description',
            material='Test Material',
            compatibility='Test Compatibility',
            thickness_mm=1.0,
            weight_g=50
        )
        
        # Create a client
        self.client = Client()
    
    def test_add_to_cart_authenticated_user(self):
        """Test adding a product to cart for authenticated user"""
        # Login the user
        self.client.force_login(self.user)
        
        # Prepare the request data
        data = {
            'product_id': self.product.id,
            'quantity': 2,
            'color': 'black'
        }
        
        # Make the request
        response = self.client.post(
            reverse('Product:add_to_cart'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['cart_count'], 2)
        
        # Check that cart and cart item were created
        cart = Cart.objects.get(user=self.user)
        cart_item = CartItem.objects.get(cart=cart, product=self.product)
        self.assertEqual(cart_item.quantity, 2)
    
    def test_add_to_cart_unauthenticated_user(self):
        """Test that unauthenticated users cannot add to cart"""
        data = {
            'product_id': self.product.id,
            'quantity': 1,
            'color': 'black'
        }
        
        response = self.client.post(
            reverse('Product:add_to_cart'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Should redirect to login
        self.assertEqual(response.status_code, 302)
    
    def test_add_to_cart_invalid_product(self):
        """Test adding invalid product ID"""
        self.client.force_login(self.user)
        
        data = {
            'product_id': 99999,  # Non-existent product
            'quantity': 1,
            'color': 'black'
        }
        
        response = self.client.post(
            reverse('Product:add_to_cart'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Should return 404
        self.assertEqual(response.status_code, 404)
