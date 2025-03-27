/**
 * Gallery functionality with filtering and lightbox
 */

(function() {
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded - initializing gallery functionality');
        initGalleryFunctionality();
        initBeforeAfterSlider();
    });

    // Also initialize on window load to ensure all resources are loaded
    window.addEventListener('load', function() {
        console.log('Window loaded - reinitializing gallery if needed');
        // Check if gallery items have proper classes
        const items = document.querySelectorAll('.gallery-item');
        const allActive = document.querySelector('.filter-btn[data-filter="all"].active');
        
        if (items.length && !allActive) {
            console.log('Gallery needs reinitialization');
            initGalleryFunctionality();
            
            // Ensure "All" filter is active and clicked
            setTimeout(function() {
                const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
                if (allFilterBtn) {
                    console.log('Clicking All filter button');
                    allFilterBtn.click();
                }
            }, 100);
        }
    });

    // Store common gallery elements to avoid duplication
    let filterButtons, galleryItems, galleryLinks;

    /**
     * Gallery Filtering and Lightbox
     */
    function initGalleryFunctionality() {
        // Fetch all necessary DOM elements once
        filterButtons = document.querySelectorAll('.filter-btn');
        galleryItems = document.querySelectorAll('.gallery-item');
        galleryLinks = Array.from(document.querySelectorAll('.gallery-zoom'));
        
        if (!filterButtons.length || !galleryItems.length) {
            console.log('Gallery elements not found');
            return;
        }
        
        console.log(`Found ${filterButtons.length} filter buttons and ${galleryItems.length} gallery items`);
        
        // Ensure all gallery items have show class initially
        galleryItems.forEach(item => {
            item.classList.add('show');
            item.style.visibility = 'visible';
            item.style.height = 'auto';
        });
        
        // Initialize filter buttons
        initFilterButtons();
        
        // Setup lightbox functionality
        if (galleryLinks.length) {
            setupLightbox();
            preloadGalleryImages();
        }
    }

    // Make initGalleryFunctionality globally accessible
    window.initGalleryFunctionality = initGalleryFunctionality;

    /**
     * Initialize filter buttons with event handlers
     */
    function initFilterButtons() {
        // Add keyboard navigation for filters
        filterButtons.forEach((button, index) => {
            // Make filters keyboard accessible
            button.setAttribute('role', 'tab');
            button.setAttribute('tabindex', '0');
            button.setAttribute('aria-selected', button.classList.contains('active') ? 'true' : 'false');
            
            // Handle click
            button.addEventListener('click', function() {
                filterGallery(this);
            });
            
            // Handle keyboard
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    filterGallery(this);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextButton = filterButtons[index + 1] || filterButtons[0];
                    nextButton.focus();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevButton = filterButtons[index - 1] || filterButtons[filterButtons.length - 1];
                    prevButton.focus();
                }
            });
        });
    }
    
    /**
     * Filter gallery items based on selected category
     */
    function filterGallery(button) {
        // Update active button
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        
        const filterValue = button.getAttribute('data-filter');
        const galleryEmpty = document.querySelector('.gallery-empty');
        let visibleItems = 0;
        let itemsToShow = [];
        
        console.log(`Filtering gallery to: ${filterValue}`);
        
        // First, hide items that don't match
        galleryItems.forEach(item => {
            // Remove any existing animation classes first
            item.classList.remove('fadeIn', 'fadeOut');
            
            // Force browser reflow for animation to work properly
            void item.offsetWidth;
            
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
                // Collect items to show for staggered animation
                itemsToShow.push(item);
                visibleItems++;
            } else {
                // Hide items that don't match
                if (item.classList.contains('show')) {
                    item.classList.add('fadeOut');
                    
                    // Use a timeout to actually hide the element after animation
                    setTimeout(() => {
                        item.classList.remove('show');
                        item.style.visibility = 'hidden';
                        item.style.height = '0';
                    }, 400); // Match to CSS animation duration
                }
            }
        });
        
        // Show items with staggered animation
        itemsToShow.forEach((item, index) => {
            setTimeout(() => {
                if (!item.classList.contains('show')) {
                    item.classList.add('fadeIn');
                    item.classList.add('show');
                    item.style.visibility = 'visible';
                    item.style.height = 'auto';
                }
            }, 50 * index); // 50ms delay between each item animation
        });
        
        // Show or hide empty state message based on number of visible items
        if (galleryEmpty) {
            if (visibleItems === 0) {
                galleryEmpty.classList.add('show');
                galleryEmpty.classList.add('fadeIn');
                galleryEmpty.classList.remove('fadeOut');
            } else {
                galleryEmpty.classList.remove('show');
                galleryEmpty.classList.add('fadeOut');
                galleryEmpty.classList.remove('fadeIn');
            }
        }
        
        // Update lightbox navigation based on the filtered items
        updateLightboxNavigation(filterValue);
        
        // Announce for screen readers
        announceToScreenReader(`Filtered gallery to show ${filterValue === 'all' ? 'all items' : filterValue + ' items'}. ${visibleItems} items displayed.`);
        
        // Log for debugging
        console.log(`Filtered to ${filterValue}, found ${visibleItems} items`);
    }
    
    /**
     * Update lightbox navigation to only navigate through filtered items
     */
    function updateLightboxNavigation(filterValue) {
        // Update the available gallery links for lightbox navigation
        if (filterValue === 'all') {
            galleryLinks = Array.from(document.querySelectorAll('.gallery-zoom'));
        } else {
            galleryLinks = Array.from(document.querySelectorAll(`.gallery-item.${filterValue} .gallery-zoom`));
        }
    }

    /**
     * Setup lightbox functionality for gallery items
     */
    function setupLightbox() {
        // Set up lightbox functionality
        galleryLinks.forEach((link, index) => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const imgSrc = this.getAttribute('href');
                const imgAlt = this.parentNode.previousElementSibling.getAttribute('alt') || 'Gallery Image';
                createLightbox(imgSrc, imgAlt, index);
            });
        });
    }
    
    /**
     * Create lightbox element with image
     */
    function createLightbox(imgSrc, imgAlt, currentIndex) {
        // Create lightbox element if it doesn't exist
        let lightbox = document.querySelector('.lightbox');
        
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.setAttribute('role', 'dialog');
            lightbox.setAttribute('aria-modal', 'true');
            lightbox.setAttribute('aria-label', 'Image lightbox');
            document.body.appendChild(lightbox);
        }
        
        // Get only visible/filtered gallery links
        const filteredGalleryLinks = galleryLinks.filter(link => {
            const galleryItem = link.closest('.gallery-item');
            return galleryItem && galleryItem.classList.contains('show');
        });
        
        // If the current image is not in the filtered set, default to the first one
        let currentLightboxIndex = filteredGalleryLinks.findIndex(link => link.getAttribute('href') === imgSrc);
        if (currentLightboxIndex === -1 && filteredGalleryLinks.length > 0) {
            imgSrc = filteredGalleryLinks[0].getAttribute('href');
            imgAlt = filteredGalleryLinks[0].parentNode.previousElementSibling.getAttribute('alt') || 'Gallery Image';
            currentLightboxIndex = 0;
        }
        
        // Update lightbox content
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <div class="lightbox-loader"></div>
                <img src="${imgSrc}" alt="${imgAlt}" onload="this.previousElementSibling.style.display='none';">
                <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                <button class="lightbox-nav lightbox-prev" aria-label="Previous image">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="lightbox-nav lightbox-next" aria-label="Next image">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div class="lightbox-counter"></div>
                <div class="lightbox-zoom-controls">
                    <button class="lightbox-zoom-in" aria-label="Zoom in">
                        <i class="fas fa-search-plus"></i>
                    </button>
                    <button class="lightbox-zoom-out" aria-label="Zoom out">
                        <i class="fas fa-search-minus"></i>
                    </button>
                    <button class="lightbox-zoom-reset" aria-label="Reset zoom">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Show lightbox
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);
        
        // Update counter immediately
        updateLightboxCounter();
        
        // Get lightbox elements
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const counter = lightbox.querySelector('.lightbox-counter');
        const zoomInBtn = lightbox.querySelector('.lightbox-zoom-in');
        const zoomOutBtn = lightbox.querySelector('.lightbox-zoom-out');
        const zoomResetBtn = lightbox.querySelector('.lightbox-zoom-reset');
        
        // Set initial image zoom level
        let zoomLevel = 1;
        let dragEnabled = false;
        let startX = 0;
        let startY = 0;
        let translateX = 0;
        let translateY = 0;
        
        // Update counter function
        function updateLightboxCounter() {
            const counter = lightbox.querySelector('.lightbox-counter');
            if (counter && filteredGalleryLinks.length > 0) {
                counter.textContent = `${currentLightboxIndex + 1} / ${filteredGalleryLinks.length}`;
            }
        }
        
        // Handle zoom reset
        function resetZoom() {
            zoomLevel = 1;
            translateX = 0;
            translateY = 0;
            dragEnabled = false;
            lightboxImg.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
            lightboxImg.style.cursor = 'default';
        }
        
        // Navigate to previous image
        function prevImage() {
            if (filteredGalleryLinks.length <= 1) return;
            
            resetZoom();
            currentLightboxIndex = (currentLightboxIndex - 1 + filteredGalleryLinks.length) % filteredGalleryLinks.length;
            const newLink = filteredGalleryLinks[currentLightboxIndex];
            const newSrc = newLink.getAttribute('href');
            const newAlt = newLink.parentNode.previousElementSibling.getAttribute('alt') || 'Gallery Image';
            
            // Show loader
            lightbox.querySelector('.lightbox-loader').style.display = 'block';
            
            // Update image
            lightboxImg.src = newSrc;
            lightboxImg.alt = newAlt;
            
            // Update counter
            updateLightboxCounter();
            
            // Announce for screen readers
            announceToScreenReader(`Image ${currentLightboxIndex + 1} of ${filteredGalleryLinks.length}, ${newAlt}`);
        }
        
        // Navigate to next image
        function nextImage() {
            if (filteredGalleryLinks.length <= 1) return;
            
            resetZoom();
            currentLightboxIndex = (currentLightboxIndex + 1) % filteredGalleryLinks.length;
            const newLink = filteredGalleryLinks[currentLightboxIndex];
            const newSrc = newLink.getAttribute('href');
            const newAlt = newLink.parentNode.previousElementSibling.getAttribute('alt') || 'Gallery Image';
            
            // Show loader
            lightbox.querySelector('.lightbox-loader').style.display = 'block';
            
            // Update image
            lightboxImg.src = newSrc;
            lightboxImg.alt = newAlt;
            
            // Update counter
            updateLightboxCounter();
            
            // Announce for screen readers
            announceToScreenReader(`Image ${currentLightboxIndex + 1} of ${filteredGalleryLinks.length}, ${newAlt}`);
        }
        
        // Close lightbox
        closeBtn.addEventListener('click', function() {
            lightbox.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(lightbox);
            }, 300);
        });
        
        // Navigation buttons
        if (prevBtn && filteredGalleryLinks.length > 1) {
            prevBtn.addEventListener('click', prevImage);
        }
        
        if (nextBtn && filteredGalleryLinks.length > 1) {
            nextBtn.addEventListener('click', nextImage);
        }
        
        // Close lightbox when clicking outside image
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeBtn.click();
            }
        });
        
        // Handle keyboard navigation
        document.addEventListener('keydown', handleKeyDown);
        
        function handleKeyDown(e) {
            if (!lightbox.classList.contains('active')) return;
            
            switch (e.key) {
                case 'Escape':
                    closeBtn.click();
                    break;
                case 'ArrowLeft':
                    prevBtn.click();
                    break;
                case 'ArrowRight':
                    nextBtn.click();
                    break;
                case '+':
                    if (zoomInBtn) zoomInBtn.click();
                    break;
                case '-':
                    if (zoomOutBtn) zoomOutBtn.click();
                    break;
                case '0':
                    if (zoomResetBtn) zoomResetBtn.click();
                    break;
            }
        }
        
        // Cleanup keyboard event listener when lightbox is closed
        lightbox.addEventListener('transitionend', function(e) {
            if (e.target === lightbox && !lightbox.classList.contains('active')) {
                document.removeEventListener('keydown', handleKeyDown);
            }
        });
        
        // Zoom functionality
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', function() {
                if (zoomLevel < 3) { // Limit max zoom
                    zoomLevel += 0.5;
                    lightboxImg.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
                    if (zoomLevel > 1) {
                        dragEnabled = true;
                        lightboxImg.style.cursor = 'move';
                    }
                }
            });
        }
        
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', function() {
                if (zoomLevel > 1) {
                    zoomLevel -= 0.5;
                    lightboxImg.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
                    if (zoomLevel === 1) {
                        dragEnabled = false;
                        translateX = 0;
                        translateY = 0;
                        lightboxImg.style.transform = `scale(1) translate(0px, 0px)`;
                        lightboxImg.style.cursor = 'default';
                    }
                }
            });
        }
        
        if (zoomResetBtn) {
            zoomResetBtn.addEventListener('click', resetZoom);
        }
        
        // Double click to zoom
        lightboxImg.addEventListener('dblclick', function(e) {
            if (zoomLevel === 1) {
                zoomLevel = 2;
                
                // Calculate zoom center point
                const rect = lightboxImg.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
                
                // Center the zoom on click position
                translateX = (rect.width / 2 - offsetX) / 2;
                translateY = (rect.height / 2 - offsetY) / 2;
                
                lightboxImg.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
                dragEnabled = true;
                lightboxImg.style.cursor = 'move';
            } else {
                resetZoom();
            }
        });
        
        // Image dragging when zoomed
        lightboxImg.addEventListener('mousedown', function(e) {
            if (!dragEnabled) return;
            
            e.preventDefault();
            startX = e.clientX;
            startY = e.clientY;
            
            function moveHandler(e) {
                const deltaX = (e.clientX - startX) / zoomLevel;
                const deltaY = (e.clientY - startY) / zoomLevel;
                
                translateX += deltaX;
                translateY += deltaY;
                
                lightboxImg.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
                
                startX = e.clientX;
                startY = e.clientY;
            }
            
            function upHandler() {
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', upHandler);
            }
            
            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
        });
        
        // Touch swipe for navigation and zoomed panning
        let touchStartX = 0;
        let touchStartY = 0;
        
        lightbox.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            
            if (dragEnabled) {
                startX = touchStartX;
                startY = touchStartY;
            }
        }, { passive: true });
        
        lightbox.addEventListener('touchmove', function(e) {
            if (dragEnabled) {
                e.preventDefault();
                const deltaX = (e.touches[0].clientX - startX) / zoomLevel;
                const deltaY = (e.touches[0].clientY - startY) / zoomLevel;
                
                translateX += deltaX;
                translateY += deltaY;
                
                lightboxImg.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
                
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }
        }, { passive: false });
        
        lightbox.addEventListener('touchend', function(e) {
            if (dragEnabled) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;
            
            // Detect horizontal swipe
            if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    prevBtn.click(); // Swipe right = prev
                } else {
                    nextBtn.click(); // Swipe left = next
                }
            }
        });
        
        // Update counter initially
        updateLightboxCounter();
        
        // Set initial focus to close button for accessibility
        setTimeout(() => {
            closeBtn.focus();
        }, 100);
        
        // Announce to screen readers
        announceToScreenReader(`Lightbox opened. Image ${currentLightboxIndex + 1} of ${filteredGalleryLinks.length}, ${imgAlt}. Use arrow keys to navigate.`);
    }

    /**
     * Before/After Image Slider
     */
    function initBeforeAfterSlider() {
        const containers = document.querySelectorAll('.before-after-container');
        if (!containers.length) return;
        
        containers.forEach(container => {
            const slider = container.querySelector('.before-after-slider');
            const beforeImg = container.querySelector('.before-img');
            const afterImg = container.querySelector('.after-img');
            const handle = container.querySelector('.slider-handle');
            
            if (!slider || !beforeImg || !afterImg || !handle) return;
            
            // Add ARIA attributes
            container.setAttribute('role', 'figure');
            container.setAttribute('aria-label', 'Before and after comparison slider');
            slider.setAttribute('role', 'slider');
            slider.setAttribute('aria-valuemin', '0');
            slider.setAttribute('aria-valuemax', '100');
            slider.setAttribute('aria-valuenow', '50');
            slider.setAttribute('tabindex', '0');
            
            // Set initial position
            let sliderPosition = 50;
            updateSliderPosition(sliderPosition);
            
            // Handle mouse/touch events
            slider.addEventListener('mousedown', startSliding);
            slider.addEventListener('touchstart', startSliding, { passive: true });
            
            // Handle keyboard events
            slider.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    sliderPosition = Math.max(0, sliderPosition - 5);
                    updateSliderPosition(sliderPosition);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    sliderPosition = Math.min(100, sliderPosition + 5);
                    updateSliderPosition(sliderPosition);
                }
            });
            
            function startSliding(e) {
                e.preventDefault();
                
                document.addEventListener('mousemove', moveSlider);
                document.addEventListener('touchmove', moveSlider, { passive: true });
                document.addEventListener('mouseup', stopSliding);
                document.addEventListener('touchend', stopSliding);
                
                slider.focus();
            }
            
            function moveSlider(e) {
                let clientX;
                
                if (e.type === 'touchmove') {
                    clientX = e.touches[0].clientX;
                } else {
                    clientX = e.clientX;
                }
                
                const rect = container.getBoundingClientRect();
                let position = ((clientX - rect.left) / rect.width) * 100;
                position = Math.min(100, Math.max(0, position));
                
                sliderPosition = position;
                updateSliderPosition(sliderPosition);
            }
            
            function stopSliding() {
                document.removeEventListener('mousemove', moveSlider);
                document.removeEventListener('touchmove', moveSlider);
                document.removeEventListener('mouseup', stopSliding);
                document.removeEventListener('touchend', stopSliding);
            }
            
            function updateSliderPosition(position) {
                slider.style.left = `${position}%`;
                beforeImg.style.width = `${position}%`;
                handle.style.left = `${position}%`;
                
                // Update ARIA values
                slider.setAttribute('aria-valuenow', Math.round(position));
                announceToScreenReader(`Slider position: ${Math.round(position)}%`);
            }
        });
    }
    
    /**
     * Helper function to announce messages to screen readers
     */
    function announceToScreenReader(message) {
        let announce = document.getElementById('screen-reader-announce');
        
        if (!announce) {
            announce = document.createElement('div');
            announce.id = 'screen-reader-announce';
            announce.setAttribute('aria-live', 'polite');
            announce.setAttribute('role', 'status');
            announce.style.position = 'absolute';
            announce.style.width = '1px';
            announce.style.height = '1px';
            announce.style.overflow = 'hidden';
            announce.style.clip = 'rect(0, 0, 0, 0)';
            document.body.appendChild(announce);
        }
        
        announce.textContent = '';
        
        // Use setTimeout to ensure the change is registered
        setTimeout(() => {
            announce.textContent = message;
        }, 50);
    }
    
    // Make announceToScreenReader globally accessible
    window.announceToScreenReader = announceToScreenReader;

    /**
     * Preload gallery images for smoother lightbox experience
     */
    function preloadGalleryImages() {
        // Only preload the first few images to not overwhelm bandwidth
        const imagesToPreload = galleryLinks.slice(0, 3);
        
        imagesToPreload.forEach(link => {
            const imgSrc = link.getAttribute('href');
            const preloadImg = new Image();
            preloadImg.src = imgSrc;
        });
        
        // Preload other images after a delay or when idle
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                galleryLinks.slice(3).forEach(link => {
                    const imgSrc = link.getAttribute('href');
                    const preloadImg = new Image();
                    preloadImg.src = imgSrc;
                });
            });
        } else {
            setTimeout(() => {
                galleryLinks.slice(3).forEach(link => {
                    const imgSrc = link.getAttribute('href');
                    const preloadImg = new Image();
                    preloadImg.src = imgSrc;
                });
            }, 2000);
        }
    }
})(); 