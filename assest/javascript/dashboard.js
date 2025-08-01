document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    if (menuItems.length > 0) {
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                menuItems.forEach(i => i.parentElement.classList.remove('active'));
                this.parentElement.classList.add('active');
            });
        });
    }

    // Order details button click handler
    const detailButtons = document.querySelectorAll('.btn-details');
    if (detailButtons.length > 0) {
        detailButtons.forEach(button => {
            button.addEventListener('click', function() {
                const orderRow = this.closest('tr');
                if (orderRow) {
                    const orderNumber = orderRow.querySelector('td:first-child');
                    if (orderNumber) {
                        alert(`جزئیات سفارش ${orderNumber.textContent} در حال بارگذاری...`);
                    }
                }
            });
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.header-search input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const tableRows = document.querySelectorAll('.orders-table tbody tr');
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Add smooth scrolling
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    if (anchorLinks.length > 0) {
        anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
});
