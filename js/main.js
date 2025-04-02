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
            setInterval(() => {
                let nextIndex = (currentIndex + 1) % carouselImages.length;
                showSlide(nextIndex);
            }, 5000);
        }
        
        // --- Handle form submission --- 
        const bookingForm = document.getElementById('booking-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const submitBtn = bookingForm.querySelector('.form-btn');
                const formInputs = bookingForm.querySelectorAll('.form-control');
                
                if(submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                    submitBtn.disabled = true;
                }
                formInputs.forEach(input => { input.disabled = true; });
                
                setTimeout(() => {
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
                }, 2000);
            });
        }
    }
})(); 