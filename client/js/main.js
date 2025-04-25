/**
 * Main JavaScript file for Real Bridal Studio Website
 * Optimized for better performance
 */

// Use an IIFE to avoid polluting the global namespace
(function() {
    // Functions to execute when DOM is ready
    function onDOMReady() {
        // Initialize core functionality
        initNavigation();
        initBackToTop();
        initSmoothScroll();
        initLazyLoading();
        initAccessibility();
        initTestimonialSlider();
        initBookingForm();
        
        // Call the data loading functions
        loadServices();
        loadPackages();
        loadProducts();
        
        // Initialize UX enhancements
        initPerformanceOptimizations();
        initEnhancedNavigation();
        initMicroInteractions();
        initPersonalization();
        
        // Setup performance monitoring
        if ('performance' in window && 'mark' in window.performance) {
            performance.mark('essential_initialized');
        }
        
        // Remove loading screen if it's still visible
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
            loadingScreen.classList.add('hidden');
            setTimeout(function() {
                loadingScreen.style.display = 'none';
                
                // Mark page as fully visible for performance tracking
                if ('performance' in window && 'mark' in window.performance) {
                    performance.mark('visible_complete');
                    performance.measure('time_to_visible', 'navigationStart', 'visible_complete');
                }
            }, 300);
        }
    }
    
    /**
     * Enhance accessibility across the site
     */
    function initAccessibility() {
        // Add proper focus outlines for keyboard navigation
        document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])').forEach(element => {
            element.addEventListener('focusin', function() {
                this.classList.add('keyboard-focus');
            });
            
            element.addEventListener('focusout', function() {
                this.classList.remove('keyboard-focus');
            });
            
            // Also ensure element has a proper role for screen readers if needed
            if (element.tagName === 'DIV' && element.hasAttribute('onclick')) {
                if (!element.hasAttribute('role')) {
                    element.setAttribute('role', 'button');
                }
                if (!element.hasAttribute('tabindex')) {
                    element.setAttribute('tabindex', '0');
                }
            }
        });
        
        // Ensure all images have alt text
        document.querySelectorAll('img:not([alt])').forEach(img => {
            console.warn('Image missing alt text:', img.src);
            img.alt = ''; // Empty alt for decorative images
        });
        
        // Ensure proper heading hierarchy
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        let prevLevel = 0;
        
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.substring(1));
            if (level - prevLevel > 1 && prevLevel !== 0) {
                console.warn('Possible heading hierarchy issue:', heading);
            }
            prevLevel = level;
        });
        
        // Add skip to content link for keyboard users
        if (!document.getElementById('skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.id = 'skip-link';
            skipLink.className = 'skip-link';
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to content';
            document.body.insertBefore(skipLink, document.body.firstChild);
            
            // Add ID to main content section if not present
            const mainContent = document.querySelector('main') || document.querySelector('.hero') || document.querySelector('section:first-of-type');
            if (mainContent && !mainContent.id) {
                mainContent.id = 'main-content';
            }
        }
    }
    
    /**
     * Initialize navigation functionality
     */
    function initNavigation() {
        const navToggle = document.querySelector('.menu-toggle');
        const mobileSidebar = document.querySelector('.mobile-sidebar');
        const sidebarClose = document.querySelector('.sidebar-close');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        const sidebarLinks = document.querySelectorAll('.sidebar-nav a, .sidebar-btn');
        const body = document.body;
        
        console.log('Navigation initialization started');
        
        if (!navToggle || !mobileSidebar) {
            console.error('Mobile navigation elements not found:', { 
                navToggle: !!navToggle, 
                mobileSidebar: !!mobileSidebar 
            });
            return;
        }
        
        // Function to close the sidebar
        function closeSidebar() {
            mobileSidebar.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            mobileSidebar.setAttribute('aria-hidden', 'true');
            
            if (sidebarOverlay) {
                sidebarOverlay.classList.remove('active');
            }
            
            // Restore body scrolling
            body.style.overflow = '';
            body.classList.remove('nav-open');
        }
        
        // Function to open the sidebar
        function openSidebar() {
            mobileSidebar.classList.add('active');
            navToggle.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
            mobileSidebar.setAttribute('aria-hidden', 'false');
            
            if (sidebarOverlay) {
                sidebarOverlay.classList.add('active');
            }
        }
        
        // Toggle mobile sidebar
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Menu toggle clicked!');
            
            // Simple toggle approach
            const isOpen = mobileSidebar.classList.contains('active');
            
            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
        
        // Close sidebar with close button
        if (sidebarClose) {
            sidebarClose.addEventListener('click', function(e) {
                e.preventDefault();
                closeSidebar();
            });
        }
        
        // Close sidebar when clicking on overlay
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', function(e) {
                e.preventDefault();
                closeSidebar();
            });
        }
        
        // Handle sidebar link clicks
        if (sidebarLinks.length) {
            sidebarLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const href = this.getAttribute('href');
                    console.log('Sidebar link clicked:', href);
                    
                    if (!href || href === '#') {
                        // Just close the sidebar if no target
                        closeSidebar();
                        return;
                    }
                    
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    // First close the sidebar
                    closeSidebar();
                    
                    // Then scroll to the target after a small delay
                    setTimeout(() => {
                        if (targetElement) {
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        } else {
                            window.location.href = href;
                        }
                    }, 300);
                });
            });
        }
        
        // Handle window resize to properly reset state on desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && mobileSidebar.classList.contains('active')) {
                closeSidebar();
            }
        });
        
        // Add keyboard support for closing sidebar with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileSidebar.classList.contains('active')) {
                closeSidebar();
            }
        });
    }
    
    /**
     * Initialize back to top button
     */
    function initBackToTop() {
        const backToTopButton = document.querySelector('.back-to-top');
        if (!backToTopButton) return;
        
        // Clear existing listeners by cloning
        const newButton = backToTopButton.cloneNode(true);
        backToTopButton.parentNode.replaceChild(newButton, backToTopButton);
        
        // Show button on scroll
        window.addEventListener('scroll', function() {
            // Skip checking if there's no button
            if (!newButton) return;
            
            // Show the button after scrolling down 300px
            if (window.scrollY > 300) {
                if (!newButton.classList.contains('visible')) {
                    newButton.style.display = 'flex'; // Make sure to reset display property
                    // Small delay to allow display to take effect before opacity transition
                    setTimeout(() => {
                        newButton.classList.add('visible');
                    }, 10);
                }
            } else {
                newButton.classList.remove('visible');
            }
            
            // Add active animation when scroll position is at the bottom
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
                if (!newButton.classList.contains('active')) {
                    newButton.classList.add('active');
                }
            } else {
                if (newButton.classList.contains('active')) {
                    newButton.classList.remove('active');
                }
            }
        });
        
        // Wait for exit animation to complete before hiding
        newButton.addEventListener('transitionend', function(e) {
            if (e.propertyName === 'opacity' && !newButton.classList.contains('visible')) {
                newButton.style.display = 'none';
            }
        });
        
        // Scroll to top on click
        newButton.addEventListener('click', function() {
            // Add animation class to button
            newButton.classList.add('clicked');
            
            // Smooth scroll implementation
            const duration = 800; // ms - longer duration for smoother effect
            const startPosition = window.pageYOffset;
            const startTime = performance.now();
            
            // Use requestAnimationFrame for smoother animation
            function scrollAnimation(currentTime) {
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Easing function: easeOutCubic for smooth deceleration
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                window.scrollTo(0, startPosition * (1 - easeProgress));
                
                // Continue animation until we reach the top
                if (progress < 1) {
                    requestAnimationFrame(scrollAnimation);
                } else {
                    // Reset button styling when animation is complete
                    setTimeout(() => {
                        newButton.classList.remove('clicked');
                    }, 300);
                }
            }
            
            // Start the animation
            requestAnimationFrame(scrollAnimation);
        });
        
        // Ensure button is visible when needed
        if (window.scrollY > 300) {
            newButton.classList.add('visible');
            newButton.style.display = 'flex';
        }
        
        // Make button accessible
        if (!newButton.hasAttribute('aria-label')) {
            newButton.setAttribute('aria-label', 'Back to top');
        }
    }
    
    /**
     * Initialize smooth scrolling for anchor links
     */
    function initSmoothScroll() {
        // Get all anchor links that point to ID selectors
        const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        
        anchorLinks.forEach(link => {
            // Skip if the link already has a click event
            if (link.getAttribute('data-scroll-initialized') === 'true') {
                return;
            }
            
            // Mark as initialized
            link.setAttribute('data-scroll-initialized', 'true');
            
            // Add click event
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Scroll to the target
                    if ('scrollBehavior' in document.documentElement.style) {
                        // Native smooth scrolling
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        // Fallback for browsers that don't support smooth scrolling
                        targetElement.scrollIntoView();
                    }
                    
                    // Update URL hash without causing page jump
                        history.pushState(null, null, `#${targetId}`);
                    
                    // Focus the target for accessibility
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus({ preventScroll: true });
                    
                    // Remove tabindex after blur
                    targetElement.addEventListener('blur', function() {
                        targetElement.removeAttribute('tabindex');
                    }, { once: true });
                }
            });
        });
    }
    
    /**
     * Initialize lazy loading of images
     */
    function initLazyLoading() {
        // Use native lazy loading for browsers that support it
        if ('loading' in HTMLImageElement.prototype) {
            // Set all images to lazy load natively if they have data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
                img.loading = 'lazy';
                img.removeAttribute('data-src');
            });
        } else {
            // Fallback for browsers that don't support native lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                            const image = entry.target;
                            
                            // Check if the image has data-src
                            if (image.dataset.src) {
                                // Set src
                                image.src = image.dataset.src;
                                
                                // Set srcset if available
                                if (image.dataset.srcset) {
                                    image.srcset = image.dataset.srcset;
                                }
                                
                                // Remove data attributes
                                image.removeAttribute('data-src');
                                image.removeAttribute('data-srcset');
                                
                                // Add loaded class
                                image.classList.add('loaded');
                                
                                // Stop observing the image
                                observer.unobserve(image);
                            }
                    }
                });
            }, {
                    rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            // Observe all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
                    
                    // Handle image loading errors
                    img.addEventListener('error', function() {
                        console.error('Failed to load image:', src);
                        
                        // Replace with placeholder if loading fails
                        if (!img.src.includes('placeholder')) {
                            img.src = 'https://placehold.co/600x400/f0f0f0/ccc?text=Image+Error';
                        }
                    });
                });
                
                // Remove skeleton loading on image load
                document.querySelectorAll('img.skeleton-loading').forEach(img => {
                    img.addEventListener('load', function() {
                        img.classList.remove('skeleton-loading');
                        const parent = img.parentElement;
                        if (parent && !parent.classList.contains('no-skeleton')) {
                            parent.classList.remove('skeleton-loading');
                        }
                    });
                });
            }
        }
    }
    
    /**
     * Reveal elements when they come into view
     */
    function initScrollReveal() {
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const section = entry.target;
                        
                        // Don't animate if user prefers reduced motion
                        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                            // Skip animation, just make it visible
                            section.classList.add('visible');
        } else {
                            // Skip animation if section has the no-animation class
                            if (!section.classList.contains('no-animation')) {
                                section.classList.add('animate');
                            } else {
                                section.classList.add('visible');
                            }
                        }
                        
                        // Stop observing after revealing
                        observer.unobserve(section);
                    }
                });
            }, {
                rootMargin: '-50px 0px',
                threshold: 0.15
            });
            
            // Observe all sections with the fade-in class
            document.querySelectorAll('.fade-in, .fade-in-up, .slide-in, .section-animate').forEach(section => {
                revealObserver.observe(section);
            });
            } else {
            // Fallback for browsers that don't support IntersectionObserver
            document.querySelectorAll('.fade-in, .fade-in-up, .slide-in, .section-animate').forEach(section => {
                section.classList.add('visible');
            });
        }
    }
    
    // Call onDOMReady when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onDOMReady);
    } else {
        // DOM already loaded, call immediately
        onDOMReady();
    }
    
    // Initialize scroll reveal after a short delay
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initScrollReveal, 100);
    });
    
    // Re-run initialization after page is fully loaded
    window.addEventListener('load', function() {
        // Re-check image loading
        initLazyLoading();
        
        // Re-initialize scroll reveal
        initScrollReveal();
        
        // Init modals
        initModals();
        
        // Make sure navigation is working correctly
        // addRedundantNavListeners(); // Removed - Functionality seems redundant/incomplete
    });
    
    /**
     * Initialize modal functionality
     */
    function initModals() {
        // Get all modal triggers and modals
        const modalTriggers = document.querySelectorAll('[data-modal]');
        const modals = document.querySelectorAll('.modal');
        const closeButtons = document.querySelectorAll('.close-modal');
        
        // Add event listeners to modal triggers
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                
                const modalId = this.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                
                if (modal) {
                    openModal(modal);
                }
            });
        });
        
        // Add event listeners to close buttons
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    closeModal(modal);
                }
            });
        });
        
        // Close modal when clicking outside content
        modals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                // Ensure the click is directly on the modal overlay, not content
                if (e.target === this && modal) { 
                    closeModal(this);
                }
            });
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Find the currently active modal, if any
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    closeModal(activeModal);
                }
            }
        });
        
        // Functions to open and close modals
        function openModal(modal) {
            if (!modal) return; // Add null check
            modal.classList.add('active');
            
            // Focus the first focusable element in the modal
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length) {
                focusableElements[0].focus();
            }
        }
        
        function closeModal(modal) {
            if (!modal) return; // Add null check
            modal.classList.remove('active');
        }
    }
    
    /**
     * Testimonial Slider
     * Shows one testimonial at a time with controls
     */
    function initTestimonialSlider() {
        const slider = document.querySelector('.testimonials-slider');
        if (!slider) return;

        const slides = slider.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.testimonial-prev');
        const nextButton = document.querySelector('.testimonial-next');
        const dotsContainer = document.querySelector('.testimonial-dots');
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('testimonial-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.testimonial-dot');
        
        // Initialize the first slide
        updateSlides();
        
        // Add click event to navigation buttons
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateSlides();
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateSlides();
            });
        }
        
        // Add touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe right, go to previous
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateSlides();
            } else if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe left, go to next
                currentIndex = (currentIndex + 1) % totalSlides;
                updateSlides();
            }
        }
        
        // Function to go to a specific slide
        function goToSlide(index) {
            currentIndex = index;
            updateSlides();
        }
        
        // Update the slide classes based on current index
        function updateSlides() {
            slides.forEach((slide, index) => {
                // First remove all classes
                slide.classList.remove('active', 'prev');
                
                // Add appropriate class based on index
                if (index === currentIndex) {
                    slide.classList.add('active');
                } else if (index === ((currentIndex - 1 + totalSlides) % totalSlides)) {
                    slide.classList.add('prev');
                }
            });
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        // Auto play slides
        let autoPlayInterval;
        
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateSlides();
            }, 5000); // Change slide every 5 seconds
        }
        
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }
        
        // Start auto play by default
        startAutoPlay();
        
        // Pause on hover
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);
        
        // Pause on touch
        slider.addEventListener('touchstart', stopAutoPlay, { passive: true });
        slider.addEventListener('touchend', startAutoPlay, { passive: true });
    }

    /**
     * Initialize Booking Form Toggle and Carousel
     */
    function initBookingForm() {
        const bookNowBtn = document.querySelector('.btn-book-now');
        const bookingFormContainer = document.querySelector('.booking-form-container');
        const closeFormBtn = document.querySelector('.close-form-btn');

        // Add checks to ensure elements exist
        if (!bookNowBtn || !bookingFormContainer || !closeFormBtn) {
            return;
        }

        bookNowBtn.addEventListener('click', function() {
            bookingFormContainer.classList.toggle('active'); 
        });
        
        closeFormBtn.addEventListener('click', function() {
            bookingFormContainer.classList.remove('active');
        });
        
        // --- Image carousel functionality --- 
        const carouselImages = document.querySelectorAll('.booking-img');
        const indicators = document.querySelectorAll('.indicator');
        let currentIndex = 0;
        
        function showSlide(index) {
            if (!carouselImages.length || !indicators.length) return;
            carouselImages.forEach(img => img.classList.remove('active'));
            indicators.forEach(dot => dot.classList.remove('active'));
            if (carouselImages[index]) carouselImages[index].classList.add('active');
            if (indicators[index]) indicators[index].classList.add('active');
            currentIndex = index;
        }
        
        if (carouselImages.length) {
            showSlide(0);
        }
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => { showSlide(index); });
        });
        
        if (carouselImages.length > 1) {
            let interval = setInterval(() => {
                let nextIndex = (currentIndex + 1) % carouselImages.length;
                showSlide(nextIndex);
            }, 5000);

            // Pause carousel on hover
            bookingFormContainer.addEventListener('mouseenter', () => {
                clearInterval(interval);
            });

            // Resume carousel when mouse leaves
            bookingFormContainer.addEventListener('mouseleave', () => {
                interval = setInterval(() => {
                    let nextIndex = (currentIndex + 1) % carouselImages.length;
                    showSlide(nextIndex);
                }, 5000);
            });
        }
        
        // --- Handle form submission --- 
        const bookingForm = document.getElementById('booking-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const submitBtn = bookingForm.querySelector('.form-btn');
                const formInputs = bookingForm.querySelectorAll('.form-control');
                
                if(submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                    submitBtn.disabled = true;
                }
                formInputs.forEach(input => { input.disabled = true; });
                
                try {
                    // Collect form data
                    const formData = {
                        name: bookingForm.querySelector('input[name="name"]').value,
                        email: bookingForm.querySelector('input[name="email"]').value,
                        phone: bookingForm.querySelector('input[name="phone"]').value,
                        date: bookingForm.querySelector('input[name="date"]').value,
                        // Default values for service and time if not found in form
                        service: bookingForm.querySelector('select[name="service"]') ? 
                            bookingForm.querySelector('select[name="service"]').value : 'Bridal Makeup',
                        time: bookingForm.querySelector('select[name="time"]') ?
                            bookingForm.querySelector('select[name="time"]').value : '10:00 AM',
                        additionalInfo: bookingForm.querySelector('textarea[name="message"]') ?
                            bookingForm.querySelector('textarea[name="message"]').value : ''
                    };
                    
                    // Send the form data to the API
                    const response = await fetch('/api/bookings/guest', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        // Show success message
                        if (bookingFormContainer) {
                            bookingFormContainer.innerHTML = `
                                <div class="form-success-message">
                                    <i class="fas fa-check-circle"></i>
                                    <h4>Booking Confirmed!</h4>
                                    <p>Thank you for booking with us. We'll contact you shortly...</p>
                                    <button class="btn-book-now" onclick="location.reload()">Back Home</button>
                                </div>
                            `;
                        }
                    } else {
                        // Show error message
                        if (bookingFormContainer) {
                            bookingFormContainer.innerHTML = `
                                <div class="form-error-message">
                                    <i class="fas fa-exclamation-circle"></i>
                                    <h4>Booking Failed</h4>
                                    <p>${result.message || 'There was a problem with your booking. Please try again.'}</p>
                                    <button class="btn-book-now" onclick="location.reload()">Try Again</button>
                                </div>
                            `;
                        }
                    }
                } catch (error) {
                    console.error('Error submitting booking:', error);
                    
                    // Re-enable form elements
                    if(submitBtn) {
                        submitBtn.innerHTML = 'Book Now';
                        submitBtn.disabled = false;
                    }
                    formInputs.forEach(input => { input.disabled = false; });
                    
                    // Show error message
                    alert('Sorry, there was a problem submitting your booking. Please try again.');
                }
            });
        }
    }

    /**
     * Load dynamic service data from API
     */
    async function loadServices() {
        const serviceGrid = document.querySelector('#services .card-grid');
        if (!serviceGrid) {
            console.warn('Service grid container not found on index.html');
            return;
        }
        
        // Check for cached data first before showing loading indicator
        const cachedServices = getCachedData('services');
        if (cachedServices) {
            // Render cached data immediately while fetching fresh data in background
            renderServices(cachedServices, serviceGrid);
        } else {
            // Show loading indicator if no cached data
            serviceGrid.innerHTML = '<div class="loading-indicator"><p>Loading services...</p></div>'; 
        }

        // Function to fetch data with retry capability
        const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
            let retries = 0;
            
            while (retries < maxRetries) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
                    
                    const response = await fetch(url, { 
                        ...options,
                        signal: controller.signal 
                    });
                    clearTimeout(timeoutId);
                    
                    if (!response.ok) {
                        const errorText = await response.text();
                        let errorMsg = `HTTP error! status: ${response.status}`;
                        try {
                            const errorData = JSON.parse(errorText);
                            errorMsg = errorData.message || errorData.error || errorMsg;
                        } catch (e) { /* Ignore if not JSON */ }
                        throw new Error(errorMsg);
                    }
                    
                    // Check for empty response
                    const responseText = await response.text();
                    if (!responseText || responseText.trim() === '') {
                        throw new Error('Empty response from server');
                    }
                    
                    // Parse JSON
                    return JSON.parse(responseText);
                } catch (error) {
                    retries++;
                    console.warn(`Attempt ${retries}/${maxRetries} failed:`, error.message);
                    
                    if (retries >= maxRetries) {
                        throw error; // Re-throw if all retries failed
                    }
                    
                    // Exponential backoff delay between retries
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries - 1)));
                }
            }
        };

        try {
            // Attempt to fetch service data with retry
            const result = await fetchWithRetry('/api/services');
            
            if (result.success && Array.isArray(result.data)) {
                // Cache the valid response data
                setCachedData('services', result.data);
                
                // Render the services
                renderServices(result.data, serviceGrid);
            } else {
                throw new Error(result.message || 'Invalid data structure received from server');
            }
        } catch (error) {
            console.error('Error loading services:', error);
            
            // Only show error if we don't have cached data already displayed
            if (!cachedServices) {
                // Handle specific error types
                if (error.name === 'AbortError') {
                    serviceGrid.innerHTML = `<div class="error-message">Request timed out. Please try refreshing the page.</div>`;
                } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    // Network error or CORS issue
                    serviceGrid.innerHTML = `<div class="error-message">Network error. Please check your connection.</div>`;
                    
                    // Fallback to static content
                    setTimeout(() => {
                        loadStaticServices(serviceGrid);
                    }, 1000);
                } else {
                    // General error with message
                    serviceGrid.innerHTML = `<div class="error-message">Could not load services: ${error.message}</div>`;
                    
                    // Fallback to static content
                    setTimeout(() => {
                        loadStaticServices(serviceGrid);
                    }, 1000);
                }
            } else {
                // Just show a subtle notification if we're already displaying cached data
                const notification = document.createElement('div');
                notification.className = 'refresh-notification';
                notification.innerHTML = 'Using cached data. <button class="refresh-btn">Refresh</button>';
                
                // Add notification at the top of the services section
                const servicesSection = document.querySelector('#services');
                if (servicesSection && !servicesSection.querySelector('.refresh-notification')) {
                    servicesSection.insertBefore(notification, servicesSection.firstChild);
                    
                    // Add refresh button handler
                    notification.querySelector('.refresh-btn').addEventListener('click', () => {
                        notification.remove();
                        loadServices(); // Try loading again
                    });
                    
                    // Auto-remove after 10 seconds
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 10000);
                }
            }
        }
    }
    
    /**
     * Helper function to render services to the container
     * @param {Array} services - The array of service objects to render
     * @param {HTMLElement} container - The container element to render services in
     */
    function renderServices(services, container) {
        if (!container || !Array.isArray(services)) return;
        
        // Clear existing content
        container.innerHTML = '';
        
        if (services.length === 0) {
            container.innerHTML = '<p class="empty-message">No services currently available.</p>';
            return;
        }
        
        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        services.forEach((service, index) => {
            const card = document.createElement('div');
            card.className = 'card hover-lift fade-in-up'; 
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', Math.min((index + 1) * 100, 500)); // Cap delay for better performance
            
            // Validate required fields before rendering
            const name = service.name || 'Service Name';
            const price = typeof service.price === 'number' ? service.price.toFixed(0) : '0';
            const description = service.description || 'Service description not available';
            const imageUrl = service.imageUrl || 'https://placehold.co/600x400/f178b6/ffffff?text=Service';
            
            card.innerHTML = `
                <div class="card-img hover-zoom">
                    <img data-src="${imageUrl}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3C/svg%3E" alt="${name}" loading="lazy">
                    <div class="card-overlay"></div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${name}</h3>
                    <p class="card-price">From ₹${price}</p>
                    <p class="card-text">${description}</p>
                    <a href="#booking" class="card-btn" data-service="${name}">Book Now</a>
                </div>
            `;
            
            // Add click handler to pre-fill the booking form with this service
            const bookBtn = card.querySelector('.card-btn');
            if (bookBtn) {
                bookBtn.addEventListener('click', function(e) {
                    const serviceSelect = document.querySelector('select[name="service"]');
                    if (serviceSelect) {
                        // Find the option with matching text and select it
                        const serviceName = this.getAttribute('data-service');
                        for (let i = 0; i < serviceSelect.options.length; i++) {
                            if (serviceSelect.options[i].text === serviceName) {
                                serviceSelect.selectedIndex = i;
                                break;
                            }
                        }
                    }
                });
            }
            
            fragment.appendChild(card);
        });
        
        container.appendChild(fragment);
        
        // Initialize lazy loading for images
        initLazyLoading();
        
        // Refresh AOS animations if available
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        } else if (typeof window.refreshAOS === 'function') {
            window.refreshAOS();
        }
    }
    
    /**
     * Simple client-side caching using sessionStorage
     */
    function setCachedData(key, data, expirationMinutes = 30) {
        try {
            const now = new Date();
            const item = {
                value: data,
                expiry: now.getTime() + (expirationMinutes * 60 * 1000)
            };
            sessionStorage.setItem(`cache_${key}`, JSON.stringify(item));
            return true;
        } catch (error) {
            console.warn('Error saving to cache:', error);
            return false;
        }
    }
    
    function getCachedData(key) {
        try {
            const cachedItem = sessionStorage.getItem(`cache_${key}`);
            if (!cachedItem) return null;
            
            const item = JSON.parse(cachedItem);
            const now = new Date();
            
            // Check if the cached data has expired
            if (now.getTime() > item.expiry) {
                sessionStorage.removeItem(`cache_${key}`);
                return null;
            }
            
            return item.value;
        } catch (error) {
            console.warn('Error reading from cache:', error);
            return null;
        }
    }
    
    /**
     * Fallback function to load static service data when API fails
     * @param {HTMLElement} container - The container to render services in
     */
    function loadStaticServices(container) {
        if (!container) return;
        
        // Check if container already has content (not error message)
        if (container.querySelector('.card')) return;
        
        console.log('Loading static service data as fallback');
        
        const staticServices = [
            {
                name: "Bridal Makeup",
                price: 15000,
                description: "Complete makeup service for your special day, including hair styling and accessories.",
                imageUrl: "img/services/bridal-makeup.jpg"
            },
            {
                name: "Mehndi Design",
                price: 5000,
                description: "Beautiful and intricate mehndi designs for hands and feet.",
                imageUrl: "img/services/mehndi.jpg"
            },
            {
                name: "Hair Styling",
                price: 3000,
                description: "Professional hair styling for any occasion, from casual to formal.",
                imageUrl: "img/services/hair-styling.jpg"
            }
        ];
        
        container.innerHTML = '';
        
        staticServices.forEach((service, index) => {
            const card = document.createElement('div');
            card.className = 'card hover-lift fade-in-up'; 
            card.innerHTML = `
                <div class="card-img hover-zoom">
                    <img src="${service.imageUrl}" alt="${service.name}" loading="lazy" onerror="this.src='https://placehold.co/600x400/f178b6/ffffff?text=${encodeURIComponent(service.name)}'">
                    <div class="card-overlay"></div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${service.name}</h3>
                    <p class="card-price">From ₹${service.price}</p>
                    <p class="card-text">${service.description}</p>
                    <a href="#booking" class="card-btn">Book Now</a>
                </div>
            `;
            
            container.appendChild(card);
            
            // Add animation
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    /**
     * Load dynamic package data from API
     */
    async function loadPackages() {
        const packageGrid = document.querySelector('#packages .card-grid');
        const comparisonTable = document.querySelector('#package-comparison tbody');
        if (!packageGrid || !comparisonTable) {
            console.warn('Package containers not found on page');
            return;
        }
        
        // Check for cached data first
        const cachedPackages = getCachedData('packages');
        if (cachedPackages) {
            // Render cached data immediately while fetching fresh data in background
            renderPackages(cachedPackages, packageGrid, comparisonTable);
        } else {
            // Show loading indicators
            packageGrid.innerHTML = '<div class="loading-indicator"><p>Loading packages...</p></div>';
            comparisonTable.innerHTML = '<tr><td colspan="4" class="loading-indicator">Loading comparison data...</td></tr>';
        }
        
        try {
            // Use the same fetchWithRetry function defined in loadServices
            const result = await fetchWithRetry('/api/packages');
            
            if (result.success && Array.isArray(result.data)) {
                // Cache the valid response data
                setCachedData('packages', result.data);
                
                // Render the packages
                renderPackages(result.data, packageGrid, comparisonTable);
            } else {
                throw new Error(result.message || 'Invalid package data structure received from server');
            }
        } catch (error) {
            console.error('Error loading packages:', error);
            
            // Only show error if we don't have cached data already displayed
            if (!cachedPackages) {
                // Handle specific error types
                if (error.name === 'AbortError') {
                    const errorMsg = '<div class="error-message">Request timed out. Please try refreshing the page.</div>';
                    packageGrid.innerHTML = errorMsg;
                    comparisonTable.innerHTML = `<tr><td colspan="4" class="error-message">Request timed out.</td></tr>`;
                } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    // Network error or CORS issue
                    packageGrid.innerHTML = '<div class="error-message">Network error. Please check your connection.</div>';
                    comparisonTable.innerHTML = `<tr><td colspan="4" class="error-message">Network error.</td></tr>`;
                    
                    // Fallback to static content after a short delay
                    setTimeout(() => {
                        loadStaticPackages(packageGrid, comparisonTable);
                    }, 1000);
                } else {
                    // General error with message
                    packageGrid.innerHTML = `<div class="error-message">Could not load packages: ${error.message}</div>`;
                    comparisonTable.innerHTML = `<tr><td colspan="4" class="error-message">Could not load package comparison data.</td></tr>`;
                    
                    // Fallback to static content after a short delay
                    setTimeout(() => {
                        loadStaticPackages(packageGrid, comparisonTable);
                    }, 1000);
                }
            } else {
                // Just show a subtle notification if we're already displaying cached data
                const notification = document.createElement('div');
                notification.className = 'refresh-notification';
                notification.innerHTML = 'Using cached package data. <button class="refresh-btn">Refresh</button>';
                
                // Add notification at the top of the packages section
                const packagesSection = document.querySelector('#packages');
                if (packagesSection && !packagesSection.querySelector('.refresh-notification')) {
                    packagesSection.insertBefore(notification, packagesSection.firstChild);
                    
                    // Add refresh button handler
                    notification.querySelector('.refresh-btn').addEventListener('click', () => {
                        notification.remove();
                        loadPackages(); // Try loading again
                    });
                    
                    // Auto-remove after 10 seconds
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 10000);
                }
            }
        }
    }
    
    /**
     * Helper function to render packages to both card grid and comparison table
     * @param {Array} packages - The array of package objects to render
     * @param {HTMLElement} cardContainer - The container for package cards
     * @param {HTMLElement} tableContainer - The container for comparison table
     */
    function renderPackages(packages, cardContainer, tableContainer) {
        if (!cardContainer || !tableContainer || !Array.isArray(packages)) return;
        
        // Clear existing content
        cardContainer.innerHTML = '';
        tableContainer.innerHTML = '';
        
        if (packages.length === 0) {
            cardContainer.innerHTML = '<p class="empty-message">No packages currently available.</p>';
            tableContainer.innerHTML = '<tr><td colspan="4" class="empty-message">No packages available for comparison.</td></tr>';
            return;
        }
        
        // Render cards
        const cardFragment = document.createDocumentFragment();
        
        packages.forEach((pkg, index) => {
            const card = document.createElement('div');
            card.className = 'package-card hover-lift fade-in-up';
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', Math.min((index + 1) * 100, 500));
            
            // Validate required fields
            const name = pkg.name || 'Package';
            const price = typeof pkg.price === 'number' ? pkg.price.toFixed(0) : '0';
            const description = pkg.description || 'Package description not available';
            const features = Array.isArray(pkg.features) ? pkg.features : [];
            
            let featuresHtml = '';
            if (features.length > 0) {
                featuresHtml = '<ul class="package-features">' + 
                    features.map(feature => `<li>${feature}</li>`).join('') + 
                    '</ul>';
            }
            
            card.innerHTML = `
                <div class="package-header">
                    <h3>${name}</h3>
                    <p class="package-price">₹${price}</p>
                </div>
                <div class="package-body">
                    <p>${description}</p>
                    ${featuresHtml}
                </div>
                <div class="package-footer">
                    <a href="#booking" class="btn" data-package="${name}">Book This Package</a>
                </div>
            `;
            
            // Add click handler to pre-fill the booking form with this package
            const bookBtn = card.querySelector('.btn');
            if (bookBtn) {
                bookBtn.addEventListener('click', function(e) {
                    const packageSelect = document.querySelector('select[name="package"]');
                    if (packageSelect) {
                        // Find the option with matching text and select it
                        const packageName = this.getAttribute('data-package');
                        for (let i = 0; i < packageSelect.options.length; i++) {
                            if (packageSelect.options[i].text === packageName) {
                                packageSelect.selectedIndex = i;
                                break;
                            }
                        }
                    }
                });
            }
            
            cardFragment.appendChild(card);
        });
        
        cardContainer.appendChild(cardFragment);
        
        // Render comparison table rows
        const tableFragment = document.createDocumentFragment();
        
        // Extract all unique features across all packages
        const allFeatures = new Set();
        packages.forEach(pkg => {
            if (Array.isArray(pkg.features)) {
                pkg.features.forEach(feature => allFeatures.add(feature));
            }
            if (pkg.comparison && typeof pkg.comparison === 'object') {
                Object.keys(pkg.comparison).forEach(key => allFeatures.add(key));
            }
        });
        
        // Create rows for each feature
        allFeatures.forEach(feature => {
            const row = document.createElement('tr');
            
            // First cell contains feature name
            const featureCell = document.createElement('td');
            featureCell.textContent = feature;
            row.appendChild(featureCell);
            
            // Create cells for each package
            packages.forEach(pkg => {
                const cell = document.createElement('td');
                
                // Check if this package has this feature
                let hasFeature = false;
                let featureDetails = '';
                
                // Check in features array
                if (Array.isArray(pkg.features) && pkg.features.includes(feature)) {
                    hasFeature = true;
                }
                
                // Check in comparison object for more detailed info
                if (pkg.comparison && pkg.comparison[feature]) {
                    hasFeature = true;
                    featureDetails = pkg.comparison[feature];
                }
                
                // Set cell content
                if (hasFeature) {
                    if (featureDetails) {
                        cell.textContent = featureDetails;
                    } else {
                        cell.innerHTML = '<span class="feature-included">✓</span>';
                    }
                } else {
                    cell.innerHTML = '<span class="feature-not-included">✗</span>';
                }
                
                row.appendChild(cell);
            });
            
            tableFragment.appendChild(row);
        });
        
        tableContainer.appendChild(tableFragment);
        
        // Refresh AOS animations if available
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        } else if (typeof window.refreshAOS === 'function') {
            window.refreshAOS();
        }
    }

    /**
     * Load dynamic product data from API
     */
    async function loadProducts() {
        const productGrid = document.querySelector('#products .product-grid');
        if (!productGrid) {
            console.warn('Product grid container not found on page');
            return;
        }
        
        // Check for cached data first
        const cachedProducts = getCachedData('products');
        if (cachedProducts) {
            // Render cached data immediately while fetching fresh data in background
            renderProducts(cachedProducts, productGrid);
        } else {
            // Show loading indicator if no cached data
            productGrid.innerHTML = '<div class="loading-indicator"><p>Loading products...</p></div>'; 
        }

        try {
            // Use the same fetchWithRetry function defined for services
            const result = await fetchWithRetry('/api/products');
            
            if (result.success && Array.isArray(result.data)) {
                // Cache the valid response data
                setCachedData('products', result.data);
                
                // Render the products
                renderProducts(result.data, productGrid);
            } else {
                throw new Error(result.message || 'Invalid product data structure received from server');
            }
        } catch (error) {
            console.error('Error loading products:', error);
            
            // Only show error if we don't have cached data already displayed
            if (!cachedProducts) {
                // Handle specific error types
                if (error.name === 'AbortError') {
                    productGrid.innerHTML = '<div class="error-message">Request timed out. Please try refreshing the page.</div>';
                } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    // Network error or CORS issue
                    productGrid.innerHTML = '<div class="error-message">Network error. Please check your connection.</div>';
                    
                    // Fallback to static content after a short delay
                    setTimeout(() => {
                        loadStaticProducts(productGrid);
                    }, 1000);
                } else {
                    // General error with message
                    productGrid.innerHTML = `<div class="error-message">Could not load products: ${error.message}</div>`;
                    
                    // Fallback to static content after a short delay
                    setTimeout(() => {
                        loadStaticProducts(productGrid);
                    }, 1000);
                }
            } else {
                // Just show a subtle notification if we're already displaying cached data
                const notification = document.createElement('div');
                notification.className = 'refresh-notification';
                notification.innerHTML = 'Using cached product data. <button class="refresh-btn">Refresh</button>';
                
                // Add notification at the top of the products section
                const productsSection = document.querySelector('#products');
                if (productsSection && !productsSection.querySelector('.refresh-notification')) {
                    productsSection.insertBefore(notification, productsSection.firstChild);
                    
                    // Add refresh button handler
                    notification.querySelector('.refresh-btn').addEventListener('click', () => {
                        notification.remove();
                        loadProducts(); // Try loading again
                    });
                    
                    // Auto-remove after 10 seconds
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 10000);
                }
            }
        }
    }
    
    /**
     * Helper function to render products to the container
     * @param {Array} products - The array of product objects to render
     * @param {HTMLElement} container - The container element to render products in
     */
    function renderProducts(products, container) {
        if (!container || !Array.isArray(products)) return;
        
        // Clear existing content
        container.innerHTML = '';
        
        if (products.length === 0) {
            container.innerHTML = '<p class="empty-message">No products currently available.</p>';
            return;
        }
        
        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        products.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card hover-lift fade-in-up'; 
            productCard.setAttribute('data-aos', 'fade-up');
            productCard.setAttribute('data-aos-delay', Math.min((index + 1) * 100, 500)); // Cap delay for better performance
            
            // Validate required fields before rendering
            const name = product.name || 'Product Name';
            const price = typeof product.price === 'number' ? product.price.toFixed(0) : '0';
            const description = product.description || 'Product description not available';
            const imageUrl = product.imageUrl || 'https://placehold.co/600x400/f178b6/ffffff?text=Product';
            const inStock = product.inStock !== undefined ? product.inStock : true;
            
            productCard.innerHTML = `
                <div class="product-img hover-zoom">
                    <img data-src="${imageUrl}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3C/svg%3E" alt="${name}" loading="lazy">
                    ${!inStock ? '<span class="out-of-stock-badge">Out of Stock</span>' : ''}
                </div>
                <div class="product-content">
                    <h3 class="product-title">${name}</h3>
                    <p class="product-price">₹${price}</p>
                    <p class="product-text">${description}</p>
                    <button class="product-btn add-to-cart" data-product-id="${product.id || index}" ${!inStock ? 'disabled' : ''}>
                        ${inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            `;
            
            // Add click handler for add to cart button
            const addToCartBtn = productCard.querySelector('.add-to-cart');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', function(e) {
                    const productId = this.getAttribute('data-product-id');
                    // Add the product to cart (implement cart functionality separately)
                    if (typeof addProductToCart === 'function') {
                        addProductToCart(productId);
                    } else {
                        console.log('Adding product to cart:', productId);
                        // Fallback if cart function isn't available
                        showNotification('Added to cart!', 'success');
                    }
                });
            }
            
            fragment.appendChild(productCard);
        });
        
        container.appendChild(fragment);
        
        // Initialize lazy loading for images
        initLazyLoading();
        
        // Refresh AOS animations if available
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        } else if (typeof window.refreshAOS === 'function') {
            window.refreshAOS();
        }
    }
    
    /**
     * Fallback function to load static product data when API fails
     * @param {HTMLElement} container - The container to render products in
     */
    function loadStaticProducts(container) {
        if (!container) return;
        
        // Check if container already has content (not error message)
        if (container.querySelector('.product-card')) return;
        
        console.log('Loading static product data as fallback');
        
        const staticProducts = [
            {
                name: "Bridal Lipstick",
                price: 1200,
                description: "Long-lasting matte lipstick perfect for your wedding day.",
                imageUrl: "img/products/lipstick.jpg",
                inStock: true
            },
            {
                name: "Foundation",
                price: 2500,
                description: "Premium foundation with all-day coverage and natural finish.",
                imageUrl: "img/products/foundation.jpg",
                inStock: true
            },
            {
                name: "Eyeshadow Palette",
                price: 3000,
                description: "Stunning eyeshadow palette with 12 wedding-perfect shades.",
                imageUrl: "img/products/eyeshadow.jpg",
                inStock: false
            }
        ];
        
        container.innerHTML = '';
        
        staticProducts.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card hover-lift fade-in-up'; 
            
            const inStock = product.inStock !== undefined ? product.inStock : true;
            
            productCard.innerHTML = `
                <div class="product-img hover-zoom">
                    <img src="${product.imageUrl}" alt="${product.name}" loading="lazy" onerror="this.src='https://placehold.co/600x400/f178b6/ffffff?text=${encodeURIComponent(product.name)}'">
                    ${!inStock ? '<span class="out-of-stock-badge">Out of Stock</span>' : ''}
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">₹${product.price}</p>
                    <p class="product-text">${product.description}</p>
                    <button class="product-btn add-to-cart" data-product-id="${index}" ${!inStock ? 'disabled' : ''}>
                        ${inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            `;
            
            container.appendChild(productCard);
            
            // Add animation
            setTimeout(() => {
                productCard.style.opacity = '1';
                productCard.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    /**
     * Show a notification to the user
     * @param {string} message - The message to display
     * @param {string} type - The type of notification (success, error, info)
     */
    function showNotification(message, type = 'info') {
        if (!message) return;
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add to the DOM
        const notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            // Create container if it doesn't exist
            const container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
            container.appendChild(notification);
        } else {
            notificationContainer.appendChild(notification);
        }
        
        // Add close button functionality
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    /** 
     * Re-fetch dynamic data when the tab becomes visible again
     */
    function handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            console.log('Tab became visible, refreshing dynamic data...');
            // Re-load data for sections on the main page
            loadServices(); 
            loadPackages();
            loadProducts(); // Add product reloading
        }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    /**
     * Performance optimization - Implement resource hints and lazy loading
     */
    function initPerformanceOptimizations() {
        // Dynamically add preconnect for API domain
        const apiDomain = new URL('/api', window.location.href).origin;
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = apiDomain;
        document.head.appendChild(link);
        
        // Implement requestIdleCallback for non-critical operations
        const scheduleIdleTask = (callback) => {
            if ('requestIdleCallback' in window) {
                requestIdleCallback(callback, { timeout: 2000 });
            } else {
                setTimeout(callback, 1);
            }
        };
        
        // Prefetch likely next pages based on current page
        scheduleIdleTask(() => {
            const currentPath = window.location.pathname;
            let pagesToPrefetch = [];
            
            // Determine which pages are likely to be visited next
            if (currentPath === '/' || currentPath === '/index.html') {
                pagesToPrefetch = ['/services.html', '/products.html', '/contact.html'];
            } else if (currentPath.includes('services')) {
                pagesToPrefetch = ['/booking.html', '/products.html'];
            } else if (currentPath.includes('products')) {
                pagesToPrefetch = ['/cart.html', '/services.html'];
            }
            
            // Prefetch the pages
            pagesToPrefetch.forEach(page => {
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = page;
                document.head.appendChild(prefetchLink);
            });
        });
        
        // Implement intersection observer for image optimization
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Check if browser supports modern image formats
                        const supportsWebp = localStorage.getItem('supports_webp');
                        const supportsAvif = localStorage.getItem('supports_avif');
                        
                        if (img.dataset.src) {
                            let imgSrc = img.dataset.src;
                            
                            // Use better formats if supported
                            if (supportsAvif === 'true' && imgSrc.endsWith('.jpg')) {
                                imgSrc = imgSrc.replace('.jpg', '.avif');
                            } else if (supportsWebp === 'true' && imgSrc.endsWith('.jpg')) {
                                imgSrc = imgSrc.replace('.jpg', '.webp');
                            }
                            
                            img.src = imgSrc;
                            img.removeAttribute('data-src');
                        }
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '200px 0px', // Start loading 200px before it comes into view
                threshold: 0.01
            });
            
            // Apply observer to all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
        
        // Check and store image format support
        scheduleIdleTask(() => {
            // Check WebP support
            const webpTest = new Image();
            webpTest.onload = function() {
                localStorage.setItem('supports_webp', 'true');
            };
            webpTest.onerror = function() {
                localStorage.setItem('supports_webp', 'false');
            };
            webpTest.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
            
            // Check AVIF support
            const avifTest = new Image();
            avifTest.onload = function() {
                localStorage.setItem('supports_avif', 'true');
            };
            avifTest.onerror = function() {
                localStorage.setItem('supports_avif', 'false');
            };
            avifTest.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        });
    }
    
    /**
     * Enhanced navigation that adapts to context and scroll position
     */
    function initEnhancedNavigation() {
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');
        if (!header || !nav) return;
        
        let lastScrollTop = 0;
        let scrollTimeout;
        let headerHeight = header.offsetHeight;
        let isScrollingUp = false;
        
        // Create a condensed menu for scroll
        const condensedNav = document.createElement('div');
        condensedNav.className = 'condensed-nav';
        condensedNav.style.position = 'fixed';
        condensedNav.style.top = '0';
        condensedNav.style.left = '0';
        condensedNav.style.width = '100%';
        condensedNav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        condensedNav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        condensedNav.style.zIndex = '1000';
        condensedNav.style.transform = 'translateY(-100%)';
        condensedNav.style.transition = 'transform 0.3s ease-in-out';
        condensedNav.style.padding = '10px 20px';
        condensedNav.style.display = 'flex';
        condensedNav.style.justifyContent = 'space-between';
        condensedNav.style.alignItems = 'center';
        
        // Clone and simplify the nav for the condensed version
        const logoClone = document.querySelector('.logo') ? document.querySelector('.logo').cloneNode(true) : document.createElement('div');
        logoClone.style.transform = 'scale(0.8)';
        
        const navLinksContainer = document.createElement('div');
        const mainNavLinks = Array.from(nav.querySelectorAll('a')).slice(0, 5); // Get only the most important links
        
        mainNavLinks.forEach(link => {
            const newLink = link.cloneNode(true);
            newLink.style.fontSize = '0.9rem';
            newLink.style.padding = '8px 12px';
            newLink.style.margin = '0 5px';
            navLinksContainer.appendChild(newLink);
        });
        
        condensedNav.appendChild(logoClone);
        condensedNav.appendChild(navLinksContainer);
        document.body.appendChild(condensedNav);
        
        // Add scroll behavior with debounce for performance
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(function() {
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Determine scroll direction
                isScrollingUp = currentScrollTop < lastScrollTop;
                
                // Show condensed navbar when scrolling down past the header height
                if (currentScrollTop > headerHeight + 50) {
                    if (isScrollingUp) {
                        condensedNav.style.transform = 'translateY(0)';
                    } else {
                        condensedNav.style.transform = 'translateY(-100%)';
                    }
                } else {
                    condensedNav.style.transform = 'translateY(-100%)';
                }
                
                lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
            }, 10);
        }, {passive: true});
        
        // Add progress indicator for long pages
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.position = 'fixed';
        progressBar.style.top = '0';
        progressBar.style.left = '0';
        progressBar.style.height = '3px';
        progressBar.style.backgroundColor = 'var(--accent-color, #f178b6)';
        progressBar.style.width = '0%';
        progressBar.style.zIndex = '1001';
        progressBar.style.transition = 'width 0.1s ease-out';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scrollTop / height) * 100;
            progressBar.style.width = scrolled + '%';
        }, {passive: true});
        
        // Enhance active section highlighting
        const sections = document.querySelectorAll('section[id]');
        if (sections.length) {
            window.addEventListener('scroll', function() {
                const scrollPosition = window.scrollY + window.innerHeight / 3;
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    const sectionId = section.getAttribute('id');
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        // Update both navs
                        document.querySelectorAll('nav a').forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === '#' + sectionId) {
                                link.classList.add('active');
                            }
                        });
                        
                        condensedNav.querySelectorAll('a').forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === '#' + sectionId) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }, {passive: true});
        }
    }
    
    /**
     * Add micro-interactions for better feedback
     */
    function initMicroInteractions() {
        // Enhanced button interactions
        const allButtons = document.querySelectorAll('button, .btn, [role="button"], .card, .product-card');
        
        allButtons.forEach(button => {
            // Add hover state animation
            button.addEventListener('mouseenter', function() {
                this.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
                
                // Don't apply to cards with hover-lift class as they already have this effect
                if (!this.classList.contains('hover-lift') && 
                    !this.classList.contains('card') && 
                    !this.classList.contains('product-card')) {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                }
            });
            
            button.addEventListener('mouseleave', function() {
                if (!this.classList.contains('hover-lift') && 
                    !this.classList.contains('card') && 
                    !this.classList.contains('product-card')) {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                }
            });
            
            // Add click animation
            button.addEventListener('mousedown', function() {
                this.style.transition = 'transform 0.1s ease';
                this.style.transform = 'scale(0.97)';
            });
            
            button.addEventListener('mouseup', function() {
                this.style.transition = 'transform 0.2s ease';
                this.style.transform = 'scale(1)';
                
                // Create ripple effect
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.position = 'absolute';
                ripple.style.width = '10px';
                ripple.style.height = '10px';
                ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                ripple.style.borderRadius = '50%';
                ripple.style.pointerEvents = 'none';
                ripple.style.transformOrigin = 'center';
                ripple.style.animation = 'ripple-animation 0.6s linear';
                
                // Set button to relative for absolute positioning of ripple
                if (getComputedStyle(this).position === 'static') {
                    this.style.position = 'relative';
                    this.style.overflow = 'hidden';
                }
                
                // Position the ripple at click location
                const rect = this.getBoundingClientRect();
                const offsetX = event.clientX - rect.left;
                const offsetY = event.clientY - rect.top;
                
                ripple.style.left = `${offsetX}px`;
                ripple.style.top = `${offsetY}px`;
                
                this.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
            
            // Add proper focus states for accessibility
            button.addEventListener('focus', function() {
                this.style.outline = '2px solid var(--accent-color, #f178b6)';
                this.style.outlineOffset = '2px';
            });
            
            button.addEventListener('blur', function() {
                this.style.outline = 'none';
            });
        });
        
        // Add the ripple animation to stylesheet
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes ripple-animation {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                100% {
                    transform: scale(50);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styleSheet);
        
        // Image hover interactions
        const images = document.querySelectorAll('.hover-zoom img, .gallery-item img');
        images.forEach(img => {
            img.addEventListener('mouseenter', function() {
                // Don't interfere with the parent hover-zoom effect
                if (!this.parentElement.classList.contains('hover-zoom')) {
                    this.style.transition = 'transform 0.3s ease';
                    this.style.transform = 'scale(1.05)';
                }
            });
            
            img.addEventListener('mouseleave', function() {
                if (!this.parentElement.classList.contains('hover-zoom')) {
                    this.style.transform = 'scale(1)';
                }
            });
        });
        
        // Form field enhancements
        const formFields = document.querySelectorAll('input, textarea, select');
        formFields.forEach(field => {
            // Add smooth focus transition
            field.addEventListener('focus', function() {
                this.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
                this.style.borderColor = 'var(--accent-color, #f178b6)';
                this.style.boxShadow = '0 0 0 3px rgba(241, 120, 182, 0.2)';
            });
            
            field.addEventListener('blur', function() {
                this.style.boxShadow = 'none';
                
                // Keep border color if valid, show red if invalid
                if (this.checkValidity()) {
                    this.style.borderColor = '';
                } else {
                    this.style.borderColor = '#ff3860';
                }
            });
            
            // Real-time validation feedback
            field.addEventListener('input', function() {
                // Skip validation for empty optional fields
                if (!this.hasAttribute('required') && this.value === '') {
                    this.style.borderColor = '';
                    
                    // Remove any existing validation message
                    const existingMessage = this.parentNode.querySelector('.validation-message');
                    if (existingMessage) {
                        existingMessage.remove();
                    }
                    return;
                }
                
                // Check validity
                if (this.checkValidity()) {
                    this.style.borderColor = 'var(--accent-color, #f178b6)';
                    
                    // Remove any existing error message
                    const existingMessage = this.parentNode.querySelector('.validation-message');
                    if (existingMessage) {
                        existingMessage.remove();
                    }
                    
                    // For password fields, add strength indicator
                    if (this.type === 'password' && this.value.length > 0) {
                        let strengthMessage = document.createElement('div');
                        strengthMessage.className = 'validation-message';
                        
                        // Simple password strength check
                        const hasUpperCase = /[A-Z]/.test(this.value);
                        const hasLowerCase = /[a-z]/.test(this.value);
                        const hasNumbers = /\d/.test(this.value);
                        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(this.value);
                        const isLongEnough = this.value.length >= 8;
                        
                        const checks = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecial, isLongEnough];
                        const passedChecks = checks.filter(Boolean).length;
                        
                        let strength = 'weak';
                        let color = '#ff3860';
                        
                        if (passedChecks >= 4) {
                            strength = 'strong';
                            color = '#23d160';
                        } else if (passedChecks >= 3) {
                            strength = 'medium';
                            color = '#ffdd57';
                        }
                        
                        strengthMessage.textContent = `Password strength: ${strength}`;
                        strengthMessage.style.color = color;
                        strengthMessage.style.fontSize = '0.8rem';
                        strengthMessage.style.marginTop = '5px';
                        
                        // Remove any existing strength message
                        const existingStrength = this.parentNode.querySelector('.validation-message');
                        if (existingStrength) {
                            existingStrength.remove();
                        }
                        
                        this.parentNode.appendChild(strengthMessage);
                    }
                } else {
                    this.style.borderColor = '#ff3860';
                    
                    // Only show validation message if field has been interacted with
                    if (this.dataset.interacted === 'true') {
                        let message = '';
                        
                        // Get appropriate validation message
                        if (this.validity.valueMissing) {
                            message = 'This field is required';
                        } else if (this.validity.typeMismatch) {
                            if (this.type === 'email') {
                                message = 'Please enter a valid email address';
                            } else if (this.type === 'url') {
                                message = 'Please enter a valid URL';
                            } else {
                                message = 'Please enter a valid value';
                            }
                        } else if (this.validity.tooShort) {
                            message = `Please use at least ${this.minLength} characters`;
                        } else if (this.validity.tooLong) {
                            message = `Please use at most ${this.maxLength} characters`;
                        } else if (this.validity.patternMismatch) {
                            message = 'Please match the requested format';
                        }
                        
                        // Display validation message
                        let validationMessage = document.createElement('div');
                        validationMessage.className = 'validation-message';
                        validationMessage.textContent = message;
                        validationMessage.style.color = '#ff3860';
                        validationMessage.style.fontSize = '0.8rem';
                        validationMessage.style.marginTop = '5px';
                        
                        // Remove any existing message
                        const existingMessage = this.parentNode.querySelector('.validation-message');
                        if (existingMessage) {
                            existingMessage.remove();
                        }
                        
                        this.parentNode.appendChild(validationMessage);
                    }
                }
            });
            
            // Mark as interacted once user has engaged with the field
            field.addEventListener('blur', function() {
                this.dataset.interacted = 'true';
                
                // Trigger validation on blur
                const event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                this.dispatchEvent(event);
            });
        });
    }
    
    /**
     * Implement personalization features
     */
    function initPersonalization() {
        // Get or initialize user preferences
        let userPreferences = JSON.parse(localStorage.getItem('user_preferences')) || {
            visitCount: 0,
            lastVisit: null,
            viewedProducts: [],
            viewedServices: [],
            darkMode: false,
            fontSize: 'medium',
        };
        
        // Update visit count and last visit
        userPreferences.visitCount++;
        userPreferences.lastVisit = new Date().toISOString();
        localStorage.setItem('user_preferences', JSON.stringify(userPreferences));
        
        // Recently viewed tracking
        function trackItemView(id, type, name) {
            if (!id || !type || !name) return;
            
            const key = `viewed${type.charAt(0).toUpperCase() + type.slice(1)}s`;
            
            // Only store the 10 most recent items
            userPreferences[key] = userPreferences[key] || [];
            
            // Check if item is already in the list
            const existingIndex = userPreferences[key].findIndex(item => item.id === id);
            if (existingIndex !== -1) {
                // Move to the top of the list
                const existingItem = userPreferences[key].splice(existingIndex, 1)[0];
                existingItem.viewCount = (existingItem.viewCount || 0) + 1;
                existingItem.lastViewed = new Date().toISOString();
                userPreferences[key].unshift(existingItem);
            } else {
                // Add new item to the beginning
                userPreferences[key].unshift({
                    id,
                    name,
                    viewCount: 1,
                    lastViewed: new Date().toISOString()
                });
                
                // Keep only the 10 most recent
                if (userPreferences[key].length > 10) {
                    userPreferences[key].pop();
                }
            }
            
            localStorage.setItem('user_preferences', JSON.stringify(userPreferences));
        }
        
        // Track viewed products
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function() {
                const productId = this.querySelector('.add-to-cart')?.dataset.productId;
                const productName = this.querySelector('.product-title')?.textContent;
                
                if (productId && productName) {
                    trackItemView(productId, 'product', productName);
                }
            });
        });
        
        // Track viewed services
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', function() {
                const serviceId = this.dataset.serviceId;
                const serviceName = this.querySelector('.service-title')?.textContent;
                
                if (serviceId && serviceName) {
                    trackItemView(serviceId, 'service', serviceName);
                }
            });
        });
        
        // Add recently viewed section if user has viewed items
        if (userPreferences.viewedProducts.length > 0 || userPreferences.viewedServices.length > 0) {
            scheduleIdleTask(() => {
                const recentlyViewedSection = document.createElement('section');
                recentlyViewedSection.id = 'recently-viewed';
                recentlyViewedSection.className = 'section';
                
                const container = document.createElement('div');
                container.className = 'container';
                
                const heading = document.createElement('h2');
                heading.textContent = 'Recently Viewed';
                heading.className = 'section-title';
                
                container.appendChild(heading);
                
                // Create tabs for products and services
                const tabContainer = document.createElement('div');
                tabContainer.className = 'tabs-container';
                
                const tabsNav = document.createElement('div');
                tabsNav.className = 'tabs-nav';
                
                const productsTab = document.createElement('button');
                productsTab.textContent = 'Products';
                productsTab.className = 'tab-btn active';
                productsTab.dataset.tab = 'products';
                
                const servicesTab = document.createElement('button');
                servicesTab.textContent = 'Services';
                servicesTab.className = 'tab-btn';
                servicesTab.dataset.tab = 'services';
                
                tabsNav.appendChild(productsTab);
                tabsNav.appendChild(servicesTab);
                
                const tabsContent = document.createElement('div');
                tabsContent.className = 'tabs-content';
                
                // Products tab content
                const productsContent = document.createElement('div');
                productsContent.className = 'tab-content active';
                productsContent.dataset.tab = 'products';
                
                if (userPreferences.viewedProducts.length > 0) {
                    const productsGrid = document.createElement('div');
                    productsGrid.className = 'product-grid';
                    
                    // Display up to 4 most recently viewed products
                    userPreferences.viewedProducts.slice(0, 4).forEach((product, index) => {
                        // Here we would normally fetch the product details from the API
                        // For now, just create a simple card with the name
                        const productCard = document.createElement('div');
                        productCard.className = 'product-card';
                        productCard.innerHTML = `
                            <div class="product-content">
                                <h3 class="product-title">${product.name}</h3>
                                <p class="product-text">Recently viewed</p>
                                <button class="product-btn view-details" data-product-id="${product.id}">
                                    View Details
                                </button>
                            </div>
                        `;
                        
                        productsGrid.appendChild(productCard);
                    });
                    
                    productsContent.appendChild(productsGrid);
                } else {
                    productsContent.innerHTML = '<p class="empty-message">No products viewed yet.</p>';
                }
                
                // Services tab content
                const servicesContent = document.createElement('div');
                servicesContent.className = 'tab-content';
                servicesContent.dataset.tab = 'services';
                
                if (userPreferences.viewedServices.length > 0) {
                    const servicesGrid = document.createElement('div');
                    servicesGrid.className = 'service-grid';
                    
                    // Display up to 4 most recently viewed services
                    userPreferences.viewedServices.slice(0, 4).forEach((service, index) => {
                        const serviceCard = document.createElement('div');
                        serviceCard.className = 'service-card';
                        serviceCard.innerHTML = `
                            <div class="service-content">
                                <h3 class="service-title">${service.name}</h3>
                                <p class="service-text">Recently viewed</p>
                                <button class="service-btn view-details" data-service-id="${service.id}">
                                    View Details
                                </button>
                            </div>
                        `;
                        
                        servicesGrid.appendChild(serviceCard);
                    });
                    
                    servicesContent.appendChild(servicesGrid);
                } else {
                    servicesContent.innerHTML = '<p class="empty-message">No services viewed yet.</p>';
                }
                
                tabsContent.appendChild(productsContent);
                tabsContent.appendChild(servicesContent);
                
                tabContainer.appendChild(tabsNav);
                tabContainer.appendChild(tabsContent);
                
                container.appendChild(tabContainer);
                recentlyViewedSection.appendChild(container);
                
                // Add to the page before the footer
                const footer = document.querySelector('footer');
                if (footer) {
                    document.body.insertBefore(recentlyViewedSection, footer);
                } else {
                    document.body.appendChild(recentlyViewedSection);
                }
                
                // Add tab switching functionality
                tabsNav.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        // Remove active class from all buttons and content
                        tabsNav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                        tabsContent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                        
                        // Add active class to clicked button and corresponding content
                        this.classList.add('active');
                        const tabName = this.dataset.tab;
                        tabsContent.querySelector(`.tab-content[data-tab="${tabName}"]`).classList.add('active');
                    });
                });
            });
        }
        
        // Return visit welcome
        if (userPreferences.visitCount > 1) {
            scheduleIdleTask(() => {
                const days = Math.floor((new Date() - new Date(userPreferences.lastVisit)) / (1000 * 60 * 60 * 24));
                
                let welcomeMessage = '';
                if (days === 0) {
                    welcomeMessage = 'Welcome back today!';
                } else if (days === 1) {
                    welcomeMessage = 'Nice to see you again after yesterday\'s visit!';
                } else {
                    welcomeMessage = `Welcome back! It's been ${days} days since your last visit.`;
                }
                
                showNotification(welcomeMessage, 'info');
            });
        }
        
        // Implement a function to get recommendations based on view history
        window.getPersonalizedRecommendations = function() {
            const viewedProducts = userPreferences.viewedProducts || [];
            const viewedServices = userPreferences.viewedServices || [];
            
            return {
                products: viewedProducts.map(p => p.id),
                services: viewedServices.map(s => s.id)
            };
        };
    }

})(); 