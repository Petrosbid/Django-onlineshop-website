// Order Details Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize order details page functionality
    
    // Handle print functionality
    const printButton = document.querySelector('.btn-primary');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Handle back to dashboard button
    const backButton = document.querySelector('.btn-secondary');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.history.back();
        });
    }
    
    // Add smooth scrolling for timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add any timeline interaction if needed
            console.log('Timeline item clicked:', this.querySelector('h4').textContent);
        });
    });
    
    // Handle order status updates (if real-time updates are needed)
    function updateOrderStatus() {
        // This function can be used to check for order status updates
        // In a real application, you might use WebSockets or AJAX polling
        console.log('Checking for order status updates...');
    }
    
    // Set up periodic status checks (every 30 seconds)
    // setInterval(updateOrderStatus, 30000);
    
    // Add loading states for buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('btn-secondary')) {
                this.style.opacity = '0.7';
                this.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    this.style.opacity = '1';
                    this.style.pointerEvents = 'auto';
                }, 1000);
            }
        });
    });
    
    // Handle responsive behavior
    function handleResponsive() {
        const container = document.querySelector('.order-details-container');
        if (window.innerWidth < 768) {
            container.style.padding = '1rem';
        } else {
            container.style.padding = '2rem';
        }
    }
    
    // Call on load and resize
    handleResponsive();
    window.addEventListener('resize', handleResponsive);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + P for print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            window.print();
        }
        
        // Escape key to go back
        if (e.key === 'Escape') {
            window.history.back();
        }
    });
    
    // Add tooltips for better UX
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
            
            this.tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.remove();
                this.tooltip = null;
            }
        });
    });
});

// Export functions for potential use in other scripts
window.OrderDetails = {
    print: function() {
        window.print();
    },
    
    goBack: function() {
        window.history.back();
    },
    
    updateStatus: function() {
        // Placeholder for status update functionality
        console.log('Order status update requested');
    }
}; 