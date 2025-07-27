// Search and Filter Functionality for Products List Page

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

// Product data structure (sample data based on the HTML)
const productData = [
    {
        id: 1,
        name: 'S25 Ultra',
        category: 'mobile',
        brand: 'samsung',
        price: 102490000,
        description: 'گوشی موبایل سامسونگ مدل گلکسی S25 Ultra ظرفیت 256 گیگابایت رم 12 گیگابایت - ویتنام',
        image: '../images/s25-2.jpg',
        colors: ['black', 'blue'],
        inStock: true,
        rating: 4.5,
        discount: 0
    },
    {
        id: 2,
        name: '16Pro Max',
        category: 'mobile',
        brand: 'apple',
        price: 142300000,
        description: 'گوشی موبایل اپل مدل Iphone 16 Pro Max ظرفیت 256 گیگابایت رم 8 گیگابایت - ویتنام',
        image: '../images/16pro-3.jpg',
        colors: ['black', 'white'],
        inStock: true,
        rating: 4.8,
        discount: 5
    },
    {
        id: 3,
        name: 'Xiaomi 15 pro',
        category: 'mobile',
        brand: 'xiaomi',
        price: 72000000,
        description: 'گوشی موبایل شیائومی مدل Xiaomi 15 pro ظرفیت 256 گیگابایت رم 12 گیگابایت - ویتنام',
        image: '../images/xiaomi 15pr-4.jpg',
        colors: ['black', 'red'],
        inStock: true,
        rating: 4.2,
        discount: 15
    },
    {
        id: 4,
        name: 'Nokia Magic Max 5G',
        category: 'mobile',
        brand: 'nokia',
        price: 22453000,
        description: 'گوشی موبایل شیائومی مدل Nokia Magic Max 5G ظرفیت 256 گیگابایت رم 12 گیگابایت - ویتنام',
        image: '../images/nokia-4.jpg',
        colors: ['blue', 'green'],
        inStock: false,
        rating: 3.8,
        discount: 25
    },
    {
        id: 5,
        name: 'Apple Airpods 4',
        category: 'headphone',
        brand: 'apple',
        price: 13500000,
        description: 'ایرپاد 4 اپل با قابلیت active noise cancellation Airpods 4 with Active Noise Cancellation',
        image: '../images/airpadpro-2.jpg',
        colors: ['white'],
        inStock: true,
        rating: 4.6,
        discount: 0
    },
    {
        id: 6,
        name: 'Galaxy Buds 3 pro',
        category: 'headphone',
        brand: 'samsung',
        price: 8619000,
        description: 'هندزفری بلوتوثی سامسونگ مدل Galaxy Buds 3 pro Samsung Galaxy Buds 3 pro Bluetooth Earbuds',
        image: '../images/buds3pro-1.jpg',
        colors: ['black', 'white'],
        inStock: true,
        rating: 4.3,
        discount: 10
    },
    {
        id: 7,
        name: 'Flip Buds pro TWSEJ20GT',
        category: 'headphone',
        brand: 'xiaomi',
        price: 9899000,
        description: 'هندزفری شیائومی مدل Flip Buds pro TWSEJ20GT Xiaomi Flip Buds pro TWSEJ20GT Bluetooth',
        image: '../images/flipbudspro-1.jpg',
        colors: ['black'],
        inStock: true,
        rating: 4.1,
        discount: 20
    },
    {
        id: 8,
        name: 'T13 ANC 2',
        category: 'headphone',
        brand: 'qcy',
        price: 1289000,
        description: 'هندزفری بلوتوثی کیو سی وای مدل T13 ANC 2 QCY T13 ANC 2 Bluetooth Earphons',
        image: '../images/t13anc2-1.jpg',
        colors: ['black', 'blue'],
        inStock: false,
        rating: 3.9,
        discount: 30
    },
    {
        id: 9,
        name: 'Galaxy Watch6 44mm',
        category: 'watch',
        brand: 'samsung',
        price: 12290000,
        description: 'ساعت هوشمند سامسونگ مدل Galaxy Watch6 44mm Samsung Galaxy Watch6 44mm Smart Watch',
        image: '../images/watch644mm-4.jpg',
        colors: ['black', 'blue'],
        inStock: true,
        rating: 4.4,
        discount: 0
    },
    {
        id: 10,
        name: 'Ultra 49mm loop',
        category: 'watch',
        brand: 'apple',
        price: 49900000,
        description: 'ساعت هوشمند اپل مدل Ultra 49mm loop Iphone Watch Ultra 49mm Alpine loop',
        image: '../images/watch49mmloop-1.jpg',
        colors: ['black'],
        inStock: true,
        rating: 4.7,
        discount: 0
    },
    {
        id: 11,
        name: 'Solar Pro',
        category: 'watch',
        brand: 'haylou',
        price: 4390000,
        description: 'ساعت هوشمند هایلو مدل Solar Pro Alpine Haylou Solar Pro Alpine Smart Watch',
        image: '../images/solarpro-2.jpg',
        colors: ['black', 'blue'],
        inStock: true,
        rating: 4.0,
        discount: 15
    },
    {
        id: 12,
        name: 'GS Pro',
        category: 'watch',
        brand: 'mibro',
        price: 6500000,
        description: 'ساعت هوشمند میبرو مدل GS Pro Alpine Mibro Watch GS Pro Alpine Smart Watch',
        image: '../images/gspro-1.jpg',
        colors: ['black'],
        inStock: false,
        rating: 3.7,
        discount: 20
    },
    {
        id: 13,
        name: 'MacBook Air MW123 M4',
        category: 'laptop',
        brand: 'apple',
        price: 805000000,
        description: 'لبتاپ اپل 13.6 اینچی مدل MacBook Air MW123 M4 MacBook Air MW123 M4 2025 16GB RAM 256GB SSD',
        image: '../images/macbook-1.webp',
        colors: ['white'],
        inStock: true,
        rating: 4.8,
        discount: 0
    },
    {
        id: 14,
        name: 'Surface Studio-i7',
        category: 'laptop',
        brand: 'microsoft',
        price: 88700000,
        description: 'لبتاپ 14.4 اینچی مایکروسافت Surface Studio-(i7-32GB-1TB) Microsoft Surface Laptop Studio(i7-32GB-1TB)',
        image: '../images/surfacestudio-2.webp',
        colors: ['black'],
        inStock: true,
        rating: 4.5,
        discount: 5
    },
    {
        id: 15,
        name: 'Legion Pro 5 2024',
        category: 'laptop',
        brand: 'lenovo',
        price: 63319000,
        description: 'لبتاپ لنوو Legion Pro 5 2024-BB 14650HX i7 64GB 1TB SSD Lenovo Legion Pro 5 2024-BB 14650HX i7 64GB 1TB SSD',
        image: '../images/lenovo-1.webp',
        colors: ['black'],
        inStock: true,
        rating: 4.3,
        discount: 10
    },
    {
        id: 16,
        name: 'ROG Strix G18 G814JI',
        category: 'laptop',
        brand: 'asus',
        price: 76129000,
        description: 'لبتاپ ایسوس ROG Strix G18 G814JI-C 13650HX i7 16GB 2TB SSD ASUS ROG Strix G18 G814JI-C 13650HX i7 16GB 2TB SSD',
        image: '../images/asus-1.webp',
        colors: ['black'],
        inStock: false,
        rating: 4.2,
        discount: 15
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeSearchFilter();
    setupEventListeners();
    loadAllProducts();
});

// Initialize search and filter functionality
function initializeSearchFilter() {
    allProducts = [...productData];
    filteredProducts = [...allProducts];
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
                applyFilters();
            }, 300);
        });
    }

    // Enter key in search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Load all products (simulate API call)
function loadAllProducts() {
    // In a real application, this would be an API call
    console.log('Loading products...');
    setTimeout(() => {
        applyFilters();
    }, 100);
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        currentFilters.search = searchInput.value;
        applyFilters();
    }
}

// Apply all filters
function applyFilters() {
    // Get filter values
    currentFilters.category = document.getElementById('categoryFilter').value;
    currentFilters.brand = document.getElementById('brandFilter').value;
    currentFilters.priceRange = document.getElementById('priceFilter').value;
    currentFilters.sortBy = document.getElementById('sortFilter').value;
    
    // Get advanced filter values
    currentFilters.colors = getSelectedColors();
    currentFilters.stockStatus = getSelectedStockStatus();
    currentFilters.ratings = getSelectedRatings();
    currentFilters.discounts = getSelectedDiscounts();

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
    showNotification(`تعداد ${filteredProducts.length} محصول یافت شد`, 'info');
}

// Filter functions
function matchesSearch(product) {
    if (!currentFilters.search) return true;
    const searchTerm = currentFilters.search.toLowerCase();
    return product.name.toLowerCase().includes(searchTerm) ||
           product.description.toLowerCase().includes(searchTerm) ||
           product.brand.toLowerCase().includes(searchTerm);
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

// Sort products
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
        default:
            // Keep original order
            break;
    }
}

// Update results count
function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = filteredProducts.length.toLocaleString('fa-IR');
    }
}

// Update active filters display
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

    // Create filter tags
    activeFilters.forEach(filter => {
        const tag = document.createElement('div');
        tag.className = 'active-filter-tag';
        tag.innerHTML = `
            <span>${filter.label}</span>
            <span class="remove-filter" onclick="removeFilter('${filter.type}', '${filter.value}')">×</span>
        `;
        activeFiltersContainer.appendChild(tag);
    });
}

// Remove specific filter
function removeFilter(type, value) {
    switch (type) {
        case 'search':
            currentFilters.search = '';
            document.getElementById('searchInput').value = '';
            break;
        case 'category':
            currentFilters.category = '';
            document.getElementById('categoryFilter').value = '';
            break;
        case 'brand':
            currentFilters.brand = '';
            document.getElementById('brandFilter').value = '';
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

// Clear all filters
function clearFilters() {
    // Reset all form elements
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('brandFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('sortFilter').value = '';

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

// Toggle advanced filters
function toggleAdvancedFilters() {
    const advancedFilters = document.getElementById('advancedFilters');
    const button = document.querySelector('.advanced-filter-btn');
    
    if (advancedFilters.classList.contains('active')) {
        advancedFilters.classList.remove('active');
        button.innerHTML = '<i class="fas fa-sliders-h"></i> فیلترهای پیشرفته';
    } else {
        advancedFilters.classList.add('active');
        button.innerHTML = '<i class="fas fa-chevron-up"></i> مخفی کردن';
    }
}

// Display products (this would be implemented based on your HTML structure)
function displayProducts() {
    // This function would update the product display based on filteredProducts
    // For now, we'll just log the results
    console.log('Filtered products:', filteredProducts);
    
    // In a real implementation, you would:
    // 1. Clear the current product display
    // 2. Loop through filteredProducts
    // 3. Create product cards/elements
    // 4. Add them to the DOM
}

// Show notification
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
        font-family: Tanha, sans-serif;
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
        'success': '#28a745',
        'warning': '#ffc107',
        'error': '#dc3545',
        'info': '#17a2b8'
    };
    return colors[type] || colors.info;
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
`;
document.head.appendChild(style);

// Export functions for global access
window.performSearch = performSearch;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.toggleAdvancedFilters = toggleAdvancedFilters;
window.removeFilter = removeFilter; 