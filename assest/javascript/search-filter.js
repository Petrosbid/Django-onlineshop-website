// Enhanced Search and Filter Functionality for Products List Page
// Updated to work with Django backend API

// Global variables
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

let isLoading = false;
let currentPage = 1;
let totalPages = 1; // Initialize totalPages

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeSearchFilter();
    setupEventListeners();
    setupKeyboardShortcuts();
    initializeAnimations();
    loadFilterOptions();
});

// Initialize search and filter functionality
function initializeSearchFilter() {
    // Get initial filter values from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentFilters.search = urlParams.get('search') || '';
    currentFilters.category = urlParams.get('category') || '';
    currentFilters.brand = urlParams.get('brand') || '';
    currentFilters.priceRange = urlParams.get('price_range') || '';
    currentFilters.sortBy = urlParams.get('sort') || '';
    
    // Set form values
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = currentFilters.search;
    
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) categoryFilter.value = currentFilters.category;
    
    const brandFilter = document.getElementById('brandFilter');
    if (brandFilter) brandFilter.value = currentFilters.brand;
    
    const priceFilter = document.getElementById('priceFilter');
    if (priceFilter) priceFilter.value = currentFilters.priceRange;
    
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) sortFilter.value = currentFilters.sortBy;
    
    updateResultsCount();
    updateActiveFilters();
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
                currentPage = 1; // Reset to first page
                applyFilters();
            }, 500);
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
            currentPage = 1; // Reset to first page
            applyFilters();
        });
    });

    // Setup infinite scroll or pagination
    setupPagination();
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
                currentPage = 1;
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

// Load filter options from backend
function loadFilterOptions() {
    fetch('/Product/api/filter-options/')
        .then(response => response.json())
        .then(data => {
            populateFilterOptions(data);
        })
        .catch(error => {
            console.error('Error loading filter options:', error);
        });
}

// Populate filter options
function populateFilterOptions(data) {
    // Populate category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter && data.categories) {
        categoryFilter.innerHTML = '<option value="">همه دسته‌ها</option>';
        data.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    }
    
    // Populate brand filter
    const brandFilter = document.getElementById('brandFilter');
    if (brandFilter && data.brands) {
        brandFilter.innerHTML = '<option value="">همه برندها</option>';
        data.brands.forEach(brand => {
            if (brand) {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                brandFilter.appendChild(option);
            }
        });
    }
    
    // Populate color options
    if (data.colors) {
        const colorOptions = document.querySelector('.color-options');
        if (colorOptions) {
            colorOptions.innerHTML = '';
            data.colors.forEach(color => {
                if (color) {
                    const colorOption = document.createElement('label');
                    colorOption.className = 'color-option';
                    colorOption.innerHTML = `
                        <input type="checkbox" value="${color}" onchange="applyFilters()">
                        <span class="color-swatch" style="background-color: ${getColorCode(color)};"></span>
                        ${color}
                    `;
                    colorOptions.appendChild(colorOption);
                }
            });
        }
    }
}

// Get color code for display
function getColorCode(colorName) {
    const colorMap = {
        'black': '#000000',
        'white': '#ffffff',
        'blue': '#007bff',
        'red': '#dc3545',
        'green': '#28a745',
        'yellow': '#ffc107',
        'purple': '#6f42c1',
        'orange': '#fd7e14',
        'pink': '#e83e8c',
        'gray': '#6c757d'
    };
    return colorMap[colorName.toLowerCase()] || '#cccccc';
}

// Setup pagination
function setupPagination() {
    // Infinite scroll or pagination buttons
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        // Add scroll event for infinite scroll
        window.addEventListener('scroll', function() {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
                if (!isLoading && currentPage < totalPages) {
                    loadMoreProducts();
                }
            }
        });
    }
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        currentFilters.search = searchInput.value;
        currentPage = 1;
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

// Apply all filters with backend API
function applyFilters() {
    if (isLoading) return;
    
    isLoading = true;
    
    // Show loading state
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.classList.add('loading');
    }

    // Build query parameters
    const params = new URLSearchParams();
    
    if (currentFilters.search) params.append('search', currentFilters.search);
    if (currentFilters.category) params.append('category', currentFilters.category);
    if (currentFilters.brand) params.append('brand', currentFilters.brand);
    if (currentFilters.priceRange) params.append('price_range', currentFilters.priceRange);
    if (currentFilters.sortBy) params.append('sort', currentFilters.sortBy);
    if (currentFilters.ratings.length > 0) params.append('min_rating', Math.min(...currentFilters.ratings));
    if (currentFilters.discounts.length > 0) params.append('discount', Math.min(...currentFilters.discounts));
    if (currentFilters.stockStatus.length > 0) params.append('stock', currentFilters.stockStatus[0]);
    if (currentFilters.colors.length > 0) {
        currentFilters.colors.forEach(color => params.append('colors', color));
    }
    
    params.append('page', currentPage);

    // Make API request
    fetch(`/Product/?${params.toString()}`, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        displayProducts(data.products);
        updateResultsCount(data.total_count);
        updatePagination(data);
        
        // Update URL without page reload
        updateURL(params);
        
        // Show notification
        const message = data.products.length > 0 
            ? `تعداد ${data.total_count} محصول یافت شد` 
            : 'محصولی با این فیلترها یافت نشد';
        showNotification(message, data.products.length > 0 ? 'info' : 'warning');
    })
    .catch(error => {
        console.error('Error applying filters:', error);
        showNotification('خطا در بارگذاری محصولات', 'error');
    })
    .finally(() => {
        isLoading = false;
        if (productsGrid) {
            productsGrid.classList.remove('loading');
        }
    });
}

// Load more products for pagination
function loadMoreProducts() {
    if (isLoading) return;
    
    currentPage++;
    isLoading = true;
    
    const params = new URLSearchParams();
    
    if (currentFilters.search) params.append('search', currentFilters.search);
    if (currentFilters.category) params.append('category', currentFilters.category);
    if (currentFilters.brand) params.append('brand', currentFilters.brand);
    if (currentFilters.priceRange) params.append('price_range', currentFilters.priceRange);
    if (currentFilters.sortBy) params.append('sort', currentFilters.sortBy);
    if (currentFilters.ratings.length > 0) params.append('min_rating', Math.min(...currentFilters.ratings));
    if (currentFilters.discounts.length > 0) params.append('discount', Math.min(...currentFilters.discounts));
    if (currentFilters.stockStatus.length > 0) params.append('stock', currentFilters.stockStatus[0]);
    if (currentFilters.colors.length > 0) {
        currentFilters.colors.forEach(color => params.append('colors', color));
    }
    
    params.append('page', currentPage);

    fetch(`/Product/?${params.toString()}`, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        appendProducts(data.products);
        updatePagination(data);
    })
    .catch(error => {
        console.error('Error loading more products:', error);
        currentPage--; // Revert page number on error
    })
    .finally(() => {
        isLoading = false;
    });
}

// Get selected values from checkboxes
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

// Update results count with animation
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        const currentCount = parseInt(resultsCount.textContent) || 0;
        const targetCount = count || 0;
        
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
        activeFilters.push({
            type: 'category',
            label: `دسته: ${currentFilters.category}`,
            value: currentFilters.category
        });
    }

    if (currentFilters.brand) {
        activeFilters.push({
            type: 'brand',
            label: `برند: ${currentFilters.brand}`,
            value: currentFilters.brand
        });
    }

    if (currentFilters.colors.length > 0) {
        const colorLabels = currentFilters.colors.join(', ');
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
    currentPage = 1;
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

    currentPage = 1;
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

// Display products from API data
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    // Clear current products
    productsGrid.innerHTML = '';

    if (products.length === 0) {
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
    products.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        productsGrid.appendChild(productCard);
    });
}

// Append products for pagination
function appendProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    // Create product cards with animation
    products.forEach((product, index) => {
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
    
    card.innerHTML = `
        <div class="item-grid-cart">
            <div class="product-image-container">
                <div class="img-cart">
                    <img src="${product.image}" alt="${product.title}" class="product-image">
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
                ${product.discount_percent > 0 ? `<div class="discount-label"><span>${product.discount_percent}٪</span></div>` : ''}
            </div>
            
            <div class="caption-item-cart">
                <div class="product-category">
                    <span>${product.category}</span>
                </div>
                <h5 class="title-cart">
                    <a href="${product.url}">${product.title}</a>
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

// Update pagination
function updatePagination(data) {
    totalPages = data.total_pages;
    currentPage = data.current_page;
    
    // Update pagination controls if they exist
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) {
        // Update pagination UI
        updatePaginationUI(data);
    }
}

// Update pagination UI
function updatePaginationUI(data) {
    const paginationContainer = document.querySelector('.pagination-container');
    if (!paginationContainer) return;
    
    let paginationHTML = '';
    
    if (data.has_previous) {
        paginationHTML += `<a href="#" onclick="goToPage(${data.current_page - 1})" class="page-link">
            <i class="fas fa-chevron-right"></i>
        </a>`;
    }
    
    for (let i = 1; i <= data.total_pages; i++) {
        if (i === data.current_page) {
            paginationHTML += `<span class="page-link active">${i}</span>`;
        } else if (i > data.current_page - 3 && i < data.current_page + 3) {
            paginationHTML += `<a href="#" onclick="goToPage(${i})" class="page-link">${i}</a>`;
        }
    }
    
    if (data.has_next) {
        paginationHTML += `<a href="#" onclick="goToPage(${data.current_page + 1})" class="page-link">
            <i class="fas fa-chevron-left"></i>
        </a>`;
    }
    
    paginationContainer.querySelector('.pagination').innerHTML = paginationHTML;
}

// Go to specific page
function goToPage(page) {
    currentPage = page;
    applyFilters();
}

// Update URL without page reload
function updateURL(params) {
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newURL);
}

// Helper functions
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
    
    .products-grid.loading {
        opacity: 0.6;
        pointer-events: none;
    }
    
    .products-grid.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        margin: -20px 0 0 -20px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #31a9cc;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(enhancedStyles);

// Export functions for global access
window.performSearch = performSearch;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.toggleAdvancedFilters = toggleAdvancedFilters;
window.removeFilter = removeFilter;
window.goToPage = goToPage;
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