// Product Detail Page JavaScript

// Global variables
let selectedColor = 'black';
let selectedQuantity = 1;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
});

// Initialize page functionality
function initializePage() {
    // Set initial active thumbnail
    const firstThumbnail = document.querySelector('.thumbnail');
    if (firstThumbnail) {
        firstThumbnail.classList.add('active');
    }
    
    // Initialize color selection
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectColor(this);
        });
    });
    
    // Initialize quantity input validation
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('input', validateQuantity);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Modal close on outside click
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeImageModal();
            }
        });
    }
    
    // Keyboard navigation for modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// Image Gallery Functions
function changeMainImage(imageSrc, thumbnailElement) {
    // Update main image
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = imageSrc;
        mainImage.alt = thumbnailElement.querySelector('img').alt;
    }
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnailElement.classList.add('active');
    
    // Add smooth transition effect
    mainImage.style.opacity = '0';
    setTimeout(() => {
        mainImage.style.opacity = '1';
    }, 150);
}

// Modal Functions
function openImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const mainImage = document.getElementById('mainImage');
    
    if (modal && modalImage && mainImage) {
        modalImage.src = mainImage.src;
        modalImage.alt = mainImage.alt;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Tab Functions
function showTab(tabName) {
    // Hide all tab panels
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabPanels.forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab panel
    const selectedPanel = document.getElementById(tabName);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Color Selection Functions
function selectColor(colorElement) {
    // Remove active class from all color options
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.classList.remove('active');
    });
    
    // Add active class to selected color
    colorElement.classList.add('active');
    
    // Update selected color
    selectedColor = colorElement.dataset.color;
    
    // Show feedback to user
    showNotification(`رنگ ${getColorName(selectedColor)} انتخاب شد`, 'success');
}

function getColorName(colorCode) {
    const colorNames = {
        'black': 'مشکی',
        'blue': 'آبی',
        'red': 'قرمز',
        'green': 'سبز'
    };
    return colorNames[colorCode] || colorCode;
}

// Quantity Functions
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        let currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1;
            selectedQuantity = quantityInput.value;
            updatePriceDisplay();
        } else {
            showNotification('حداکثر تعداد قابل انتخاب ۱۰ عدد است', 'warning');
        }
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        let currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            selectedQuantity = quantityInput.value;
            updatePriceDisplay();
        } else {
            showNotification('حداقل تعداد قابل انتخاب ۱ عدد است', 'warning');
        }
    }
}

function validateQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        let value = parseInt(quantityInput.value) || 1;
        
        // Ensure value is within valid range
        if (value < 1) {
            value = 1;
        } else if (value > 10) {
            value = 10;
        }
        
        quantityInput.value = value;
        selectedQuantity = value;
        updatePriceDisplay();
    }
}

function updatePriceDisplay() {
    // This function can be used to update price based on quantity
    // For now, we'll just update the cart count
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = selectedQuantity;
    }
}

// Cart and Wishlist Functions
function addToCart(event) {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
        showNotification('برای افزودن به سبد خرید ابتدا وارد شوید', 'warning');
        // Redirect to login page
        setTimeout(() => {
            window.location.href = '/login/?next=' + encodeURIComponent(window.location.pathname);
        }, 2000);
        return;
    }
    
    // Get the product ID from the page
    const productId = getProductId();
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const selectedColor = getSelectedColor();
    
    if (!productId) {
        showNotification('خطا در شناسایی محصول', 'error');
        return;
    }
    
    // Show loading state
    const button = event ? event.target : null;
    const originalText = button ? button.innerHTML : '';
    if (button) {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال افزودن...';
        button.disabled = true;
    }
    
    // Prepare data for the request
    const data = {
        product_id: productId,
        quantity: quantity,
        color: selectedColor
    };
    
    // Make AJAX request to add to cart
    fetch('/Product/add-to-cart/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 403) {
            // User not authenticated
            showNotification('برای افزودن به سبد خرید ابتدا وارد شوید', 'warning');
            setTimeout(() => {
                window.location.href = '/login/?next=' + encodeURIComponent(window.location.pathname);
            }, 2000);
            return response.json();
        }
        return response.json();
    })
    .then(data => {
        if (data && data.success) {
            showNotification(data.message, 'success');
            
            // Update cart count in header
            updateCartCount(data.cart_count);
            
            // Add animation to cart icon
            animateCartIcon();
        } else if (data) {
            showNotification(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('خطا در ارتباط با سرور', 'error');
    })
    .finally(() => {
        // Reset button state
        if (button) {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    });
}

// Helper function to check if user is logged in
function isUserLoggedIn() {
    // Check if there are any user-specific elements on the page
    const userElements = document.querySelectorAll('[data-user-id], .user-menu, .logout-link');
    return userElements.length > 0;
}

// Helper function to get product ID from the page
function getProductId() {
    // Try to get from data attribute
    const productElement = document.querySelector('[data-product-id]');
    if (productElement) {
        return productElement.dataset.productId;
    }
    
    // Try to get from URL
    const pathParts = window.location.pathname.split('/');
    const productIdIndex = pathParts.findIndex(part => part === 'Product') + 1;
    if (productIdIndex < pathParts.length) {
        return pathParts[productIdIndex];
    }
    
    // Fallback - you might need to adjust this based on your URL structure
    return null;
}

// Helper function to get selected color
function getSelectedColor() {
    const activeColorOption = document.querySelector('.color-option.active');
    if (activeColorOption) {
        return activeColorOption.dataset.color || 'default';
    }
    return 'default';
}

// Helper function to get CSRF token
function getCSRFToken() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
    if (csrfToken) {
        return csrfToken.value;
    }
    
    // Try to get from cookie
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Helper function to update cart count in header
function updateCartCount(count) {
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

function addToWishlist() {
    const productName = 'کیف محافظ گوشی هوشمند';
    showNotification(`${productName} به علاقه‌مندی‌ها اضافه شد`, 'success');
    
    // Change heart icon to filled
    const wishlistBtn = event.target.closest('.btn-secondary');
    if (wishlistBtn) {
        const heartIcon = wishlistBtn.querySelector('i');
        if (heartIcon) {
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
        }
    }
}

// Search Function
function handleSearch(event) {
    const searchTerm = event.target.value.trim();
    
    if (searchTerm.length > 2) {
        // Simulate search functionality
        console.log('جستجو برای:', searchTerm);
        // Here you would typically make an API call to search products
    }
}

// Review Functions
function showAllReviews() {
    showNotification('در حال بارگذاری همه نظرات...', 'info');
    // Here you would typically load more reviews or navigate to a reviews page
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

function getNotificationColor(type) {
    const colors = {
        'success': '#4CAF50',
        'warning': '#FF9800',
        'error': '#f44336',
        'info': '#2196F3'
    };
    return colors[type] || colors.info;
}

function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-content button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-content button:hover {
        opacity: 0.8;
    }
    
    .main-image img {
        transition: opacity 0.3s ease;
    }
    
    .cart-icon {
        transition: transform 0.2s ease;
    }
`;
document.head.appendChild(style);

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
if ('IntersectionObserver' in window) {
    lazyLoadImages();
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states for buttons
function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال پردازش...';
    button.disabled = true;
    
    return () => {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}



// Export functions for global access
window.changeMainImage = changeMainImage;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.showTab = showTab;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
window.showAllReviews = showAllReviews; 