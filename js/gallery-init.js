/**
 * Gallery Initialization Script 
 * This script ensures the gallery is properly initialized and functioning
 */

(function() {
    // Run immediately and on DOM ready to ensure gallery is set up
    initializeGallery();
    document.addEventListener('DOMContentLoaded', initializeGallery);
    window.addEventListener('load', initializeGallery);
    
    function initializeGallery() {
        console.log('Gallery init script running');
        
        // Elements
        const galleryItems = document.querySelectorAll('.gallery-item');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
        
        if (!galleryItems.length || !filterButtons.length) {
            console.log('Gallery elements not found yet');
            return;
        }
        
        console.log(`Gallery init: Found ${galleryItems.length} items and ${filterButtons.length} filter buttons`);
        
        // Ensure all gallery items have the proper classes and styles
        galleryItems.forEach(item => {
            // Reset any transition/animation that might be in progress
            item.style.transition = 'none';
            
            // Apply show class and visibility
            item.classList.add('show');
            item.style.visibility = 'visible';
            item.style.height = 'auto';
            item.style.opacity = '1';
            item.style.transform = 'scale(1) translateY(0)';
            
            // Re-enable transitions after a small delay
            setTimeout(() => {
                item.style.transition = '';
            }, 50);
        });
        
        // Make sure filter buttons are clickable
        filterButtons.forEach(btn => {
            // Remove existing listeners to prevent duplicates
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            // Add fresh click event
            newBtn.addEventListener('click', function() {
                console.log(`Filter button clicked: ${this.getAttribute('data-filter')}`);
                
                // Update active status
                filterButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                const filterValue = this.getAttribute('data-filter');
                filterGalleryItems(filterValue);
            });
        });
        
        // Initial filter - set 'All' as active
        if (allFilterBtn && !allFilterBtn.classList.contains('active')) {
            console.log('Setting "All" filter as active initially');
            setTimeout(() => {
                allFilterBtn.click();
            }, 100);
        }
    }
    
    function filterGalleryItems(filterValue) {
        console.log(`Filtering gallery by: ${filterValue}`);
        const galleryItems = document.querySelectorAll('.gallery-item');
        const galleryEmpty = document.querySelector('.gallery-empty');
        let visibleItems = 0;
        
        galleryItems.forEach(item => {
            // Remove existing animation classes
            item.classList.remove('fadeIn', 'fadeOut');
            
            // Force reflow to ensure animations work
            void item.offsetWidth;
            
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
                // Show matching items
                item.classList.add('fadeIn');
                item.classList.add('show');
                item.style.visibility = 'visible';
                item.style.height = 'auto';
                visibleItems++;
            } else {
                // Hide non-matching items
                item.classList.add('fadeOut');
                setTimeout(() => {
                    item.classList.remove('show');
                    item.style.visibility = 'hidden';
                    item.style.height = '0';
                }, 400);
            }
        });
        
        // Show/hide empty state message
        if (galleryEmpty) {
            if (visibleItems === 0) {
                galleryEmpty.classList.add('show');
            } else {
                galleryEmpty.classList.remove('show');
            }
        }
        
        console.log(`Filter complete. Found ${visibleItems} matching items.`);
    }
})(); 