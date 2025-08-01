// Enhanced Search and Filter Functionality for Products List Page

// Global variables
let allProducts = [];
let filteredProducts = [];
let currentFilters = {
    search: '',
    category: '',
    brand: '',
    priceRange: '',
    sortBy: '',
    colors: [],
    stockStatus: [],
    ratings: [],
    discounts: []
};
// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeSearchFilter();
    setupEventListeners();
    loadAllProducts();
    setupKeyboardShortcuts();
    initializeAnimations();
});

// Initialize search and filter functionality
function initializeSearchFilter() {
    allProducts = [...productData];
    filteredProducts = [...allProducts];
    updateResultsCount();
    updateActiveFilters();
    
    // Add loading animation
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.classList.add('fade-in');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search input with debounce
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentFilters.search = this.value;
                applyFilters();
            }, 300);
        });
        
        // Enter key in search
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Focus effects
        searchInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    }

    // Filter change events
    const filterElements = document.querySelectorAll('.filter-select, .color-option input, .stock-option input, .rating-option input, .discount-option input');
    filterElements.forEach(element => {
        element.addEventListener('change', function() {
            applyFilters();
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'k':
                    e.preventDefault();
                    document.getElementById('searchInput').focus();
                    break;
                case 'f':
                    e.preventDefault();
                    document.getElementById('searchInput').focus();
                    break;
            }
        }
    });
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // Escape to clear filters
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('searchInput');
            if (searchInput && document.activeElement === searchInput) {
                searchInput.value = '';
                currentFilters.search = '';
                applyFilters();
            }
        }
    });
}

// Initialize animations
function initializeAnimations() {
    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe product cards
    const productCards = document.querySelectorAll('.grid-cart');
    productCards.forEach(card => {
        observer.observe(card);
    });
}

// Load all products (simulate API call)
function loadAllProducts() {
    // Show loading state
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.classList.add('loading');
    }
    
    // Simulate API call delay
    setTimeout(() => {
        applyFilters();
        
        // Remove loading state
        if (productsGrid) {
            productsGrid.classList.remove('loading');
        }
    }, 500);
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        currentFilters.search = searchInput.value;
        applyFilters();
        
        // Add search animation
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.classList.add('searching');
            setTimeout(() => {
                searchBtn.classList.remove('searching');
            }, 1000);
        }
    }
}

// Apply all filters with enhanced performance
function applyFilters() {
    // Show loading state
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.classList.add('loading');
    }

    // Get filter values
    currentFilters.category = document.getElementById('categoryFilter')?.value || '';
    currentFilters.brand = document.getElementById('brandFilter')?.value || '';
    currentFilters.priceRange = document.getElementById('priceFilter')?.value || '';
    currentFilters.sortBy = document.getElementById('sortFilter')?.value || '';
    
    // Get advanced filter values
    currentFilters.colors = getSelectedColors();
    currentFilters.stockStatus = getSelectedStockStatus();
    currentFilters.ratings = getSelectedRatings();
    currentFilters.discounts = getSelectedDiscounts();

    // Use requestAnimationFrame for smooth performance
    requestAnimationFrame(() => {
        // Apply filters
        filteredProducts = allProducts.filter(product => {
            return matchesSearch(product) &&
                   matchesCategory(product) &&
                   matchesBrand(product) &&
                   matchesPriceRange(product) &&
                   matchesColors(product) &&
                   matchesStockStatus(product) &&
                   matchesRatings(product) &&
                   matchesDiscounts(product);
        });

        // Apply sorting
        sortProducts();

        // Update UI
        updateResultsCount();
        updateActiveFilters();
        displayProducts();
        
        // Remove loading state
        if (productsGrid) {
            productsGrid.classList.remove('loading');
        }
        
        // Show notification
        const message = filteredProducts.length > 0 
            ? `تعداد ${filteredProducts.length} محصول یافت شد` 
            : 'محصولی با این فیلترها یافت نشد';
        showNotification(message, filteredProducts.length > 0 ? 'info' : 'warning');
    });
}

// Enhanced filter functions with better performance
function matchesSearch(product) {
    if (!currentFilters.search) return true;
    const searchTerm = currentFilters.search.toLowerCase();
    const searchableText = `${product.name} ${product.description} ${product.brand}`.toLowerCase();
    return searchableText.includes(searchTerm);
}

function matchesCategory(product) {
    if (!currentFilters.category) return true;
    return product.category === currentFilters.category;
}

function matchesBrand(product) {
    if (!currentFilters.brand) return true;
    return product.brand === currentFilters.brand;
}

function matchesPriceRange(product) {
    if (!currentFilters.priceRange) return true;
    const [min, max] = currentFilters.priceRange.split('-').map(Number);
    return product.price >= min && product.price <= max;
}

function matchesColors(product) {
    if (currentFilters.colors.length === 0) return true;
    return currentFilters.colors.some(color => product.colors.includes(color));
}

function matchesStockStatus(product) {
    if (currentFilters.stockStatus.length === 0) return true;
    if (currentFilters.stockStatus.includes('in-stock')) {
        return product.inStock;
    }
    if (currentFilters.stockStatus.includes('out-of-stock')) {
        return !product.inStock;
    }
    return true;
}

function matchesRatings(product) {
    if (currentFilters.ratings.length === 0) return true;
    return currentFilters.ratings.some(rating => product.rating >= parseInt(rating));
}

function matchesDiscounts(product) {
    if (currentFilters.discounts.length === 0) return true;
    return currentFilters.discounts.some(discount => product.discount >= parseInt(discount));
}

// Get selected values from checkboxes with enhanced performance
function getSelectedColors() {
    const colorCheckboxes = document.querySelectorAll('.color-option input[type="checkbox"]:checked');
    return Array.from(colorCheckboxes).map(cb => cb.value);
}

function getSelectedStockStatus() {
    const stockCheckboxes = document.querySelectorAll('.stock-option input[type="checkbox"]:checked');
    return Array.from(stockCheckboxes).map(cb => cb.value);
}

function getSelectedRatings() {
    const ratingCheckboxes = document.querySelectorAll('.rating-option input[type="checkbox"]:checked');
    return Array.from(ratingCheckboxes).map(cb => cb.value);
}

function getSelectedDiscounts() {
    const discountCheckboxes = document.querySelectorAll('.discount-option input[type="checkbox"]:checked');
    return Array.from(discountCheckboxes).map(cb => cb.value);
}

// Enhanced sorting with better performance
function sortProducts() {
    switch (currentFilters.sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name, 'fa'));
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'discount':
            filteredProducts.sort((a, b) => b.discount - a.discount);
            break;
        default:
            // Keep original order
            break;
    }
}

// Update results count with animation
function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        const currentCount = parseInt(resultsCount.textContent) || 0;
        const targetCount = filteredProducts.length;
        
        // Animate count change
        animateCount(currentCount, targetCount, resultsCount);
    }
}

// Animate count changes
function animateCount(start, end, element) {
    const duration = 500;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current.toLocaleString('fa-IR');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Enhanced active filters display
function updateActiveFilters() {
    const activeFiltersContainer = document.getElementById('activeFilters');
    if (!activeFiltersContainer) return;

    activeFiltersContainer.innerHTML = '';

    // Add active filters as tags
    const activeFilters = [];

    if (currentFilters.search) {
        activeFilters.push({
            type: 'search',
            label: `جستجو: ${currentFilters.search}`,
            value: currentFilters.search
        });
    }

    if (currentFilters.category) {
        const categoryNames = {
            'mobile': 'گوشی موبایل',
            'laptop': 'لپ تاپ',
            'headphone': 'هندزفری',
            'watch': 'ساعت هوشمند'
        };
        activeFilters.push({
            type: 'category',
            label: `دسته: ${categoryNames[currentFilters.category]}`,
            value: currentFilters.category
        });
    }

    if (currentFilters.brand) {
        const brandNames = {
            'samsung': 'سامسونگ',
            'apple': 'اپل',
            'xiaomi': 'شیائومی',
            'nokia': 'نوکیا',
            'lenovo': 'لنوو',
            'asus': 'ایسوس',
            'microsoft': 'مایکروسافت'
        };
        activeFilters.push({
            type: 'brand',
            label: `برند: ${brandNames[currentFilters.brand]}`,
            value: currentFilters.brand
        });
    }

    if (currentFilters.colors.length > 0) {
        const colorNames = {
            'black': 'مشکی',
            'white': 'سفید',
            'blue': 'آبی',
            'red': 'قرمز',
            'green': 'سبز'
        };
        const colorLabels = currentFilters.colors.map(color => colorNames[color]).join(', ');
        activeFilters.push({
            type: 'colors',
            label: `رنگ: ${colorLabels}`,
            value: currentFilters.colors
        });
    }

    // Create filter tags with animation
    activeFilters.forEach((filter, index) => {
        const tag = document.createElement('div');
        tag.className = 'active-filter-tag';
        tag.style.animationDelay = `${index * 100}ms`;
        tag.innerHTML = `
            <span>${filter.label}</span>
            <span class="remove-filter" onclick="removeFilter('${filter.type}', '${filter.value}')" title="حذف فیلتر">×</span>
        `;
        activeFiltersContainer.appendChild(tag);
    });
}

// Enhanced remove filter function
function removeFilter(type, value) {
    switch (type) {
        case 'search':
            currentFilters.search = '';
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
            break;
        case 'category':
            currentFilters.category = '';
            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter) categoryFilter.value = '';
            break;
        case 'brand':
            currentFilters.brand = '';
            const brandFilter = document.getElementById('brandFilter');
            if (brandFilter) brandFilter.value = '';
            break;
        case 'colors':
            currentFilters.colors = currentFilters.colors.filter(color => color !== value);
            document.querySelectorAll('.color-option input[type="checkbox"]').forEach(cb => {
                if (currentFilters.colors.includes(cb.value)) {
                    cb.checked = true;
                } else {
                    cb.checked = false;
                }
            });
            break;
    }
    applyFilters();
}

// Enhanced clear filters function
function clearFilters() {
    // Add confirmation for clearing all filters
    if (Object.values(currentFilters).some(filter => 
        (Array.isArray(filter) && filter.length > 0) || 
        (typeof filter === 'string' && filter.length > 0)
    )) {
        if (!confirm('آیا مطمئن هستید که می‌خواهید همه فیلترها را پاک کنید؟')) {
            return;
        }
    }

    // Reset all form elements
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) categoryFilter.value = '';
    
    const brandFilter = document.getElementById('brandFilter');
    if (brandFilter) brandFilter.value = '';
    
    const priceFilter = document.getElementById('priceFilter');
    if (priceFilter) priceFilter.value = '';
    
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) sortFilter.value = '';

    // Reset checkboxes
    document.querySelectorAll('.color-option input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.stock-option input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.rating-option input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.discount-option input[type="checkbox"]').forEach(cb => cb.checked = false);

    // Reset filters object
    currentFilters = {
        search: '',
        category: '',
        brand: '',
        priceRange: '',
        sortBy: '',
        colors: [],
        stockStatus: [],
        ratings: [],
        discounts: []
    };

    // Apply filters
    applyFilters();
    showNotification('همه فیلترها پاک شدند', 'success');
}

// Enhanced toggle advanced filters
function toggleAdvancedFilters() {
    const advancedFilters = document.getElementById('advancedFilters');
    const button = document.querySelector('.advanced-filter-btn');
    
    if (advancedFilters.classList.contains('active')) {
        advancedFilters.classList.remove('active');
        button.innerHTML = '<i class="fas fa-sliders-h"></i> فیلترهای پیشرفته';
        button.setAttribute('aria-expanded', 'false');
    } else {
        advancedFilters.classList.add('active');
        button.innerHTML = '<i class="fas fa-chevron-up"></i> مخفی کردن';
        button.setAttribute('aria-expanded', 'true');
    }
}

// Enhanced display products function
function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    // Clear current products
    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h4>محصولی یافت نشد</h4>
                <p>لطفاً فیلترهای خود را تغییر دهید یا محصول دیگری جستجو کنید</p>
                <button onclick="clearFilters()" class="clear-filters-btn">
                    <i class="fas fa-times"></i>
                    پاک کردن فیلترها
                </button>
            </div>
        `;
        return;
    }

    // Create product cards with animation
    filteredProducts.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        productsGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'grid-cart';
    card.style.animationDelay = `${index * 100}ms`;
    card.setAttribute('data-category', product.category);
    card.setAttribute('data-brand', product.brand);
    
    card.innerHTML = `
        <div class="item-grid-cart">
            <div class="product-image-container">
                <div class="img-cart">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <div class="product-overlay">
                    <div class="overlay-actions">
                        <button class="quick-view-btn" onclick="quickView(${product.id})" title="نمایش سریع">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="wishlist-btn" onclick="addToWishlist(${product.id})" title="افزودن به علاقه‌مندی‌ها">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="compare-btn" onclick="addToCompare(${product.id})" title="افزودن به مقایسه">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    </div>
                </div>
                ${product.discount > 0 ? `<div class="discount-label"><span>${product.discount}٪</span></div>` : ''}
            </div>
            
            <div class="caption-item-cart">
                <div class="product-category">
                    <span>${getCategoryName(product.category)}</span>
                </div>
                <h5 class="title-cart">
                    <a href="/Product/${product.id}">${product.name}</a>
                </h5>
                
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-count">(${product.rating})</span>
                </div>
                
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)} تومان</span>
                    ${product.original_price ? `<span class="original-price">${formatPrice(product.original_price)} تومان</span>` : ''}
                </div>
                
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                        اضافه کردن به سبد خرید
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Helper functions
function getCategoryName(category) {
    const categoryNames = {
        'mobile': 'گوشی موبایل',
        'laptop': 'لپ تاپ',
        'headphone': 'هندزفری',
        'watch': 'ساعت هوشمند'
    };
    return categoryNames[category] || category;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

function formatPrice(price) {
    return price.toLocaleString('fa-IR');
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="${getNotificationIcon(type)}"></i>
            </div>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
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
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        z-index: 3000;
        max-width: 400px;
        animation: slideInNotification 0.3s ease;
        font-family: 'Tanha', sans-serif;
        border: 1px solid rgba(255,255,255,0.2);
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutNotification 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fas fa-check-circle',
        'warning': 'fas fa-exclamation-triangle',
        'error': 'fas fa-times-circle',
        'info': 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        'success': 'linear-gradient(135deg, #28a745, #20c997)',
        'warning': 'linear-gradient(135deg, #ffc107, #fd7e14)',
        'error': 'linear-gradient(135deg, #dc3545, #e83e8c)',
        'info': 'linear-gradient(135deg, #17a2b8, #31a9cc)'
    };
    return colors[type] || colors.info;
}

// Add enhanced CSS animations
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    @keyframes slideInNotification {
        from {
            transform: translateX(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutNotification {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(-100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-icon {
        font-size: 1.2rem;
        opacity: 0.9;
    }
    
    .notification-message {
        flex: 1;
        font-weight: 500;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1rem;
        cursor: pointer;
        padding: 0.2rem;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s ease;
    }
    
    .notification-close:hover {
        background-color: rgba(255,255,255,0.2);
    }
    
    .search-btn.searching {
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .search-input-group.focused {
        box-shadow: 0 4px 16px rgba(49, 169, 204, 0.3);
        transform: translateY(-1px);
    }
    
    .active-filter-tag {
        animation: slideUp 0.3s ease;
    }
    
    .grid-cart {
        animation: fadeIn 0.5s ease;
    }
    
    .no-products {
        animation: fadeIn 0.5s ease;
    }
    
    .no-products .clear-filters-btn {
        margin-top: 1rem;
        background: linear-gradient(135deg, #31a9cc, #5c48ee);
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Tanha', sans-serif;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .no-products .clear-filters-btn:hover {
        background: linear-gradient(135deg, #0f1e6a, #31a9cc);
        transform: translateY(-1px);
    }
`;
document.head.appendChild(enhancedStyles);

// Export functions for global access
window.performSearch = performSearch;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.toggleAdvancedFilters = toggleAdvancedFilters;
window.removeFilter = removeFilter;
window.quickView = function(productId) {
    console.log('Quick view for product:', productId);
    showNotification('نمایش سریع محصول', 'info');
};
window.addToWishlist = function(productId) {
    console.log('Add to wishlist:', productId);
    showNotification('محصول به لیست علاقه‌مندی‌ها اضافه شد', 'success');
};
window.addToCompare = function(productId) {
    console.log('Add to compare:', productId);
    showNotification('محصول به لیست مقایسه اضافه شد', 'info');
};
window.addToCart = function(productId) {
    console.log('Add to cart:', productId);
    showNotification('محصول به سبد خرید اضافه شد', 'success');
};