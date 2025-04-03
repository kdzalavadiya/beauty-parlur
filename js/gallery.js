/**
 * Gallery Functionality
 * - Enhanced touch interactions
 * - Improved animations
 * - Better mobile experience
 * - Optimized image loading with fade-in effects
 */

(function() {
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded - initializing gallery functionality');
        initGallery();
        // Initialize before-after slider if it exists
        initBeforeAfterSlider();
    });

    // Also initialize on window load to ensure all images are loaded properly
    window.addEventListener('load', function() {
        console.log('Window loaded - reinitializing gallery if needed');
        refreshGalleryItems();
    });

    // Store common gallery elements to avoid duplication
    let filterButtons, galleryItems, galleryLinks, lightbox;

    /**
     * Initialize gallery functionality
     */
    function initGallery() {
        // Fetch all necessary DOM elements once
        filterButtons = document.querySelectorAll('.gallery-filter .filter-btn');
        galleryItems = document.querySelectorAll('.gallery-item');
        galleryLinks = document.querySelectorAll('.gallery-zoom');
        lightbox = document.querySelector('.lightbox');
        
        if (!filterButtons.length || !galleryItems.length) {
            console.log('Gallery elements not found');
            return;
        }
        
        console.log(`Found ${filterButtons.length} filter buttons and ${galleryItems.length} gallery items`);
        
        // Initialize filter buttons
        initFilterButtons();
        
        // Setup lightbox functionality
        if (galleryLinks.length && lightbox) {
            setupLightbox();
        }

        // Initialize with "all" filter
        filterGalleryItems('all');
    }

    /**
     * Initialize filter buttons with event handlers
     */
    function initFilterButtons() {
        // First mark the 'all' button as active by default
        const allButton = document.querySelector('.filter-btn[data-filter="all"]');
        if (allButton) {
            allButton.classList.add('active');
        }

        // Add click event to each filter button
        filterButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get filter value
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    // Reset any inline styles that might be interfering
                    btn.style.color = '';
                });
                
                this.classList.add('active');
                // Ensure text is white for active state
                this.style.color = 'white';
                
                // Filter items
                filterGalleryItems(filter);
                
                // Announce filter change for screen readers
                announceFilterChange(filter);
            });
        });
    }
    
    /**
     * Filter gallery items
     */
    function filterGalleryItems(filter) {
        console.log(`Filtering gallery: ${filter}`);
        
        // Add staggered animation with slight delay between items
        galleryItems.forEach((item, index) => {
            // Get the item's category
            const category = item.getAttribute('data-category');
            
            // Determine if this item should be shown
            const shouldShow = filter === 'all' || category === filter;
            
            // Reset any previous inline styles
            item.style.transform = '';
            
            // Use setTimeout for staggered animation
            setTimeout(() => {
                if (shouldShow) {
                    // Show the item with a fade-in effect
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    item.style.display = 'block';
                    item.classList.add('visible');
                } else {
                    // Hide the item with a fade-out effect
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    item.classList.remove('visible');
                    // Actually hide it after animation completes
                    setTimeout(() => {
                        if (!shouldShow) {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            }, index * 50); // 50ms delay between each item
        });
        
        // Update the available gallery links for lightbox
        updateLightboxItems();
    }
    
    /**
     * Update available lightbox items based on filtered gallery
     */
    function updateLightboxItems() {
        // Get all visible gallery items
        const visibleItems = Array.from(galleryItems).filter(
            item => item.style.display !== 'none'
        );
        
        // Update gallery links to only include visible items
        galleryLinks = Array.from(document.querySelectorAll('.gallery-zoom')).filter(
            link => {
                const item = link.closest('.gallery-item');
                return item && item.style.display !== 'none';
            }
        );
        
        console.log(`Updated lightbox navigation with ${galleryLinks.length} visible items`);
    }

    /**
     * Setup lightbox functionality
     */
    function setupLightbox() {
        // Get lightbox elements
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const lightboxLoader = lightbox.querySelector('.lightbox-loader');
        
        let currentIndex = 0;
        
        // Process when clicking gallery image
        document.addEventListener('click', function(e) {
            const link = e.target.closest('.gallery-zoom');
            if (link) {
                e.preventDefault();
                
                // Find the index in the current filtered gallery links
                const index = Array.from(galleryLinks).indexOf(link);
                if (index !== -1) {
                    openLightbox(index);
                }
            }
        });
        
        // Open lightbox with specified image and index
        function openLightbox(index) {
            currentIndex = index;
            
            // Show loading indicator
            if (lightboxLoader) lightboxLoader.style.display = 'block';
            if (lightboxImg) lightboxImg.style.opacity = '0';
            
            // Display the lightbox
            lightbox.style.display = 'flex';
            document.body.classList.add('lightbox-open'); // Prevent scroll
            
            setTimeout(() => {
                lightbox.style.opacity = '1';
            }, 10);
            
            // Load the image
            if (lightboxImg) {
                // Clear previous src to force reload
                lightboxImg.src = '';
                
                lightboxImg.onload = function() {
                    // Hide loader and show image when loaded
                    if (lightboxLoader) lightboxLoader.style.display = 'none';
                    lightboxImg.style.opacity = '1';
                };
                
                lightboxImg.onerror = function() {
                    console.error('Failed to load image:', galleryLinks[index].getAttribute('href'));
                    if (lightboxLoader) lightboxLoader.style.display = 'none';
                    lightboxImg.src = 'https://placehold.co/800x600/f0f0f0/ccc?text=Image+Error';
                    lightboxImg.style.opacity = '1';
                };
                
                lightboxImg.src = galleryLinks[index].getAttribute('href');
                lightboxImg.alt = galleryLinks[index].closest('.gallery-img').querySelector('img').alt || 'Gallery image';
                
                // Update navigation button state
                updateNavButtons();
            }
        }
        
        // Close lightbox
        function closeLightbox() {
            lightbox.style.opacity = '0';
            document.body.classList.remove('lightbox-open'); // Re-enable scroll
            
            setTimeout(() => {
                lightbox.style.display = 'none';
                if (lightboxImg) lightboxImg.src = '';
            }, 300);
        }
        
        // Navigate to previous image
        function prevImage() {
            if (currentIndex > 0) {
                openLightbox(currentIndex - 1);
            }
        }
        
        // Navigate to next image
        function nextImage() {
            if (currentIndex < galleryLinks.length - 1) {
                openLightbox(currentIndex + 1);
            }
        }
        
        // Update navigation buttons based on current index
        function updateNavButtons() {
            if (prevBtn) {
                if (currentIndex <= 0) {
                    prevBtn.classList.add('disabled');
                    prevBtn.setAttribute('aria-disabled', 'true');
                } else {
                    prevBtn.classList.remove('disabled');
                    prevBtn.setAttribute('aria-disabled', 'false');
                }
            }
            
            if (nextBtn) {
                if (currentIndex >= galleryLinks.length - 1) {
                    nextBtn.classList.add('disabled');
                    nextBtn.setAttribute('aria-disabled', 'true');
                } else {
                    nextBtn.classList.remove('disabled');
                    nextBtn.setAttribute('aria-disabled', 'false');
                }
            }
        }
        
        // Add event listeners for lightbox controls
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                prevImage();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                nextImage();
            });
        }
        
        // Close lightbox on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.style.display === 'flex') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft' && lightbox.style.display === 'flex') {
                prevImage();
            } else if (e.key === 'ArrowRight' && lightbox.style.display === 'flex') {
                nextImage();
            }
        });
        
        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Add touch swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        lightbox.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        lightbox.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe right, go to previous
                prevImage();
            } else if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe left, go to next
                nextImage();
            }
        }
    }

    /**
     * Initialize before-after slider in the section if it exists
     */
    function initBeforeAfterSlider() {
        const sliders = document.querySelectorAll('.before-after-slider');
        if (!sliders.length) return;
        
        sliders.forEach(slider => {
            const container = slider.parentElement;
            const beforeImg = container.querySelector('.before-img');
            const afterImg = container.querySelector('.after-img');
            
            // Make sure images are loaded
            const images = container.querySelectorAll('img');
            let imagesLoaded = 0;
            
            images.forEach(img => {
                if (img.complete) {
                    imagesLoaded++;
                    if (imagesLoaded === images.length) {
                        // Set up initial position
                        updatePosition(50);
                    }
                } else {
                    img.onload = function() {
                        imagesLoaded++;
                        if (imagesLoaded === images.length) {
                            // Set up initial position
                            updatePosition(50);
                        }
                    };
                }
            });
            
            let isDragging = false;
            
            function updatePosition(position) {
                afterImg.style.clipPath = `inset(0 0 0 ${100 - position}%)`;
                slider.style.left = `${position}%`;
                
                // Update ARIA value for accessibility
                slider.setAttribute('aria-valuenow', position);
            }
            
            function startSliding(e) {
                e.preventDefault();
                isDragging = true;
                container.classList.add('active');
                document.addEventListener('mousemove', slide);
                document.addEventListener('touchmove', slide, { passive: false });
                document.addEventListener('mouseup', stopSliding);
                document.addEventListener('touchend', stopSliding);
                slide(e);
            }
            
            function slide(e) {
                if (!isDragging) return;
                
                let posX;
                if (e.type.includes('touch')) {
                    e.preventDefault();
                    posX = e.touches[0].clientX;
                } else {
                    posX = e.clientX;
                }
                
                const containerRect = container.getBoundingClientRect();
                let position = ((posX - containerRect.left) / containerRect.width) * 100;
                position = Math.max(0, Math.min(100, position));
                
                updatePosition(position);
            }
            
            function stopSliding() {
                isDragging = false;
                container.classList.remove('active');
                document.removeEventListener('mousemove', slide);
                document.removeEventListener('touchmove', slide);
                document.removeEventListener('mouseup', stopSliding);
                document.removeEventListener('touchend', stopSliding);
            }
            
            // Add keyboard support for accessibility
            slider.addEventListener('keydown', function(e) {
                const currentPosition = parseFloat(slider.getAttribute('aria-valuenow') || 50);
                let newPosition = currentPosition;
                
                switch(e.key) {
                    case 'ArrowLeft':
                        newPosition = Math.max(0, currentPosition - 5);
                        break;
                    case 'ArrowRight':
                        newPosition = Math.min(100, currentPosition + 5);
                        break;
                    case 'Home':
                        newPosition = 0;
                        break;
                    case 'End':
                        newPosition = 100;
                        break;
                    default:
                        return;
                }
                
                e.preventDefault();
                updatePosition(newPosition);
            });
            
            // Initialize ARIA attributes for accessibility
            slider.setAttribute('role', 'slider');
            slider.setAttribute('aria-valuemin', '0');
            slider.setAttribute('aria-valuemax', '100');
            slider.setAttribute('aria-valuenow', '50');
            slider.setAttribute('aria-valuetext', 'Slide to compare before and after images');
            
            slider.addEventListener('mousedown', startSliding);
            slider.addEventListener('touchstart', startSliding, { passive: false });
        });
    }

    /**
     * Announce filter change for screen readers
     */
    function announceFilterChange(filter) {
        let liveRegion = document.getElementById('gallery-live');
        
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'gallery-live';
            liveRegion.className = 'sr-only';
            liveRegion.setAttribute('aria-live', 'polite');
            document.querySelector('.gallery-section').appendChild(liveRegion);
        }
        
        // Count visible items
        const visibleCount = Array.from(galleryItems).filter(item => {
            const category = item.getAttribute('data-category');
            return filter === 'all' || category === filter;
        }).length;
        
        // Set announcement text
        if (filter === 'all') {
            liveRegion.textContent = `Showing all ${visibleCount} gallery items`;
        } else {
            liveRegion.textContent = `Showing ${visibleCount} ${filter} items`;
        }
    }

    /**
     * Refresh gallery items after all images are loaded
     * Can be called after window load or dynamic content changes
     */
    function refreshGalleryItems() {
        const gallerySection = document.querySelector('.gallery-section');
        if (!gallerySection) return;
        
        // First ensure all images are loaded
        const lazyImages = gallerySection.querySelectorAll('img[data-src]');
        
        lazyImages.forEach(img => {
            if (!img.classList.contains('loaded')) {
                // Create a new image object to preload
                const tempImg = new Image();
                tempImg.onload = function() {
                    // Replace src with data-src
                    img.src = img.getAttribute('data-src');
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                };
                tempImg.src = img.getAttribute('data-src');
            }
        });
        
        // Reinitialize gallery if needed
        if (!filterButtons || !galleryItems) {
            initGallery();
        } else {
            // Apply current filter
            const activeFilter = document.querySelector('.gallery-filter .filter-btn.active');
            if (activeFilter) {
                filterGalleryItems(activeFilter.getAttribute('data-filter'));
            } else {
                filterGalleryItems('all');
            }
        }
    }
})(); 