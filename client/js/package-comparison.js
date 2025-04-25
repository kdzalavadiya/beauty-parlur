/**
 * Package Comparison Tool
 * - Filtering packages by category
 * - Toggling between card and table view
 */
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const packageCards = document.querySelectorAll('.package-card');
    const viewToggle = document.getElementById('view-toggle');
    const cardView = document.getElementById('card-view');
    const gridView = document.getElementById('grid-view');
    
    // Initialize
    initPackageFilters();
    initViewToggle();
    
    /**
     * Initialize package category filtering
     */
    function initPackageFilters() {
        // Skip if elements are not found
        if (!filterButtons.length || !packageCards.length) {
            return;
        }
        
        // Add click event to each filter button
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Get selected filter
                const filter = this.getAttribute('data-filter');
                
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter packages
                filterPackages(filter);
            });
        });
    }
    
    /**
     * Filter packages by category
     */
    function filterPackages(filter) {
        packageCards.forEach(card => {
            // Get card categories
            const categories = card.getAttribute('data-category');
            
            // Show all if filter is 'all' or hide/show based on category match
            if (filter === 'all') {
                card.classList.remove('hidden');
            } else {
                if (categories.includes(filter)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            }
            
            // Add animation for appearing cards
            if (!card.classList.contains('hidden')) {
                card.style.animation = 'none';
                card.offsetHeight; // Force reflow
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            }
        });
    }
    
    /**
     * Initialize view toggle between card and table view
     */
    function initViewToggle() {
        // Skip if elements are not found
        if (!viewToggle || !cardView || !gridView) {
            return;
        }
        
        // Add change event to toggle switch
        viewToggle.addEventListener('change', function() {
            if (this.checked) {
                // Show table view
                cardView.classList.add('hidden');
                gridView.classList.add('active');
            } else {
                // Show card view
                cardView.classList.remove('hidden');
                gridView.classList.remove('active');
            }
        });
    }
    
    /**
     * Highlight packages when scrolled into view
     */
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    // Add pulsing glow to recommended package
                    if (card.classList.contains('package-premium')) {
                        card.classList.add('pulse-highlight');
                    }
                    // Stop observing after animation
                    observer.unobserve(card);
                }
            });
        }, {
            threshold: 0.2
        });
        
        // Observe each package card
        packageCards.forEach(card => {
            observer.observe(card);
        });
    }
    
    /**
     * Add mouseover effects for package cards
     */
    packageCards.forEach(card => {
        card.addEventListener('mouseover', function() {
            // Remove highlight from all other cards
            packageCards.forEach(c => {
                if (c !== card) {
                    c.style.transform = 'scale(0.98)';
                    c.style.opacity = '0.8';
                }
            });
        });
        
        card.addEventListener('mouseout', function() {
            // Restore all cards
            packageCards.forEach(c => {
                c.style.transform = '';
                c.style.opacity = '';
            });
        });
    });
}); 