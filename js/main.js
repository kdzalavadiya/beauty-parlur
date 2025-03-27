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
        const navLinks = document.querySelector('.nav-links');
        const mobileSidebar = document.querySelector('.mobile-sidebar');
        const sidebarClose = document.querySelector('.sidebar-close');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
        const body = document.body;
        
        if (!navToggle) {
            console.error('Menu toggle not found!');
            return;
        }
        
        console.log('Navigation initialized with toggle button:', navToggle);
        
        // Add ARIA attributes for accessibility
        navToggle.setAttribute('aria-expanded', 'false');
        
        // Toggle mobile sidebar
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Menu toggle clicked');
            toggleSidebar();
        });
        
        // Close sidebar with close button
        if (sidebarClose) {
            sidebarClose.addEventListener('click', closeSidebar);
        }
        
        // Close sidebar when clicking on overlay
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', closeSidebar);
        }
        
        // Close sidebar when clicking on links
        if (sidebarLinks.length) {
            sidebarLinks.forEach(link => {
                link.addEventListener('click', function() {
                    // Add small delay to allow smooth scrolling to happen first
                    setTimeout(closeSidebar, 100);
                });
            });
        }
        
        // Close sidebar when ESC key is pressed
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileSidebar && mobileSidebar.classList.contains('active')) {
                closeSidebar();
            }
        });
        
        // Update active link in sidebar based on scroll position
        window.addEventListener('scroll', updateActiveNavLink, { passive: true });
        
        // Track touch events for swipe to close
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (mobileSidebar) {
            mobileSidebar.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            mobileSidebar.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
        }
        
        function handleSwipe() {
            // Swipe right to close (since sidebar is on the right)
            if (touchEndX > touchStartX + 50) {
                closeSidebar();
            }
        }
        
        function toggleSidebar() {
            if (mobileSidebar && mobileSidebar.classList.contains('active')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        }
        
        function openSidebar() {
            console.log('Opening sidebar');
            if (!mobileSidebar) return;
            
            // Update ARIA states
            navToggle.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
            mobileSidebar.classList.add('active');
            mobileSidebar.setAttribute('aria-hidden', 'false');
            
            // Show overlay
            if (sidebarOverlay) {
                sidebarOverlay.classList.add('active');
            }
            
            // Prevent body scrolling
            body.style.overflow = 'hidden';
            body.classList.add('nav-open');
            
            // Set focus to first focusable element in sidebar
            setTimeout(function() {
                const firstFocusable = mobileSidebar.querySelector('a, button');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }, 100);
            
            // Update active link
            updateActiveNavLink();
        }
        
        function closeSidebar() {
            console.log('Closing sidebar');
            if (!mobileSidebar) return;
            
            // Update ARIA states
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            mobileSidebar.classList.remove('active');
            mobileSidebar.setAttribute('aria-hidden', 'true');
            
            // Hide overlay
            if (sidebarOverlay) {
                sidebarOverlay.classList.remove('active');
            }
            
            // Restore body scrolling
            body.style.overflow = '';
            body.classList.remove('nav-open');
            
            // Return focus to toggle button
            setTimeout(function() {
                navToggle.focus();
            }, 100);
        }
        
        function updateActiveNavLink() {
            if (!sidebarLinks.length) return;
            
            // Get current scroll position
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
            
            // Get all sections
            const sections = Array.from(document.querySelectorAll('section[id]'));
            
            // Find current section
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                const sectionTop = section.offsetTop - 100;
                
                if (scrollPosition >= sectionTop) {
                    // Remove active class from all links
                    sidebarLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to current section link
                    const currentLink = document.querySelector(`.sidebar-nav a[href="#${section.id}"]`);
                    if (currentLink) {
                        currentLink.classList.add('active');
                    }
                    
                    break;
                }
            }
        }
    }
    
    /**
     * Initialize back to top button
     */
    function initBackToTop() {
        const backToTopButton = document.querySelector('.back-to-top');
        if (!backToTopButton) return;
        
        const showAt = 300; // Show button after scrolling this many pixels
        
        // Initial visibility check
        updateBackToTopVisibility();
        
        // Add scroll listener with passive flag for better performance
        window.addEventListener('scroll', updateBackToTopVisibility, {passive: true});
        
        // Click handler
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get current scroll position
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const scrollStep = Math.PI / (800 / 15); // Adjusted for smoother effect
            const cosParameter = scrollY / 2;
            let scrollCount = 0;
            let scrollMargin;
            
            // Use requestAnimationFrame for smooth animation
            const scrollInterval = setInterval(function() {
                // Stop when we reach top
                if (window.pageYOffset <= 0) {
                    clearInterval(scrollInterval);
                    return;
                }
                
                scrollCount += 1;
                // Cosine-based easing function for extremely smooth deceleration
                scrollMargin = cosParameter * Math.cos(scrollCount * scrollStep);
                
                // Only scroll if we're not at the top
                if (window.pageYOffset > 0) {
                    window.scrollTo(0, (scrollY - scrollMargin));
                } else {
                    clearInterval(scrollInterval);
                }
            }, 15); // 15ms for ~60fps
        });
        
        function updateBackToTopVisibility() {
            const scrollY = window.scrollY || window.pageYOffset;
            
            if (scrollY > showAt) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
                backToTopButton.classList.remove('hiding');
            }
        }
    }
    
    /**
     * Initialize smooth scroll for anchor links
     */
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page jump
                    if (history.pushState) {
                        history.pushState(null, null, `#${targetId}`);
                    }
                }
            });
        });
    }
    
    /**
     * Initialize lazy loading for images and content using Intersection Observer
     */
    function initLazyLoading() {
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            // Create observer for images
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        
                        if (src) {
                            // Create a hidden loader image to preload
                            const loader = new Image();
                            
                            loader.onload = function() {
                                // Once loaded, update the visible image and show it
                                img.src = src;
                                img.classList.add('loaded');
                                img.removeAttribute('data-src');
                                
                                // If in a skeleton loader, remove the skeleton class
                                const parent = img.closest('.skeleton-loader');
                                if (parent) {
                                    parent.classList.remove('skeleton-loader');
                                }
                            };
                            
                            loader.onerror = function() {
                                // If error, at least remove the skeleton
                                const parent = img.closest('.skeleton-loader');
                                if (parent) {
                                    parent.classList.remove('skeleton-loader');
                                }
                                img.classList.add('error');
                                console.error('Failed to load image:', src);
                            };
                            
                            loader.src = src;
                        }
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '200px 0px',
                threshold: 0.01
            });
            
            // Observe all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                // Add skeleton loader class to parent for loading state
                const parent = img.parentElement;
                if (parent && !parent.classList.contains('no-skeleton')) {
                    parent.classList.add('skeleton-loader');
                }
                
                imageObserver.observe(img);
            });
            
            // Also lazy load background images
            const bgImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const bgSrc = element.dataset.background;
                        
                        if (bgSrc) {
                            const loader = new Image();
                            
                            loader.onload = function() {
                                element.style.backgroundImage = `url(${bgSrc})`;
                                element.classList.add('loaded');
                                element.classList.remove('skeleton-loader');
                                element.removeAttribute('data-background');
                            };
                            
                            loader.src = bgSrc;
                        }
                        
                        observer.unobserve(element);
                    }
                });
            }, {
                rootMargin: '200px 0px',
                threshold: 0.01
            });
            
            // Observe all elements with data-background
            document.querySelectorAll('[data-background]').forEach(element => {
                element.classList.add('skeleton-loader');
                bgImageObserver.observe(element);
            });
            
            // Observe sections for animation on scroll
            const sectionObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '0px',
                threshold: 0.1
            });
            
            // Apply to all sections
            document.querySelectorAll('section').forEach(section => {
                if (!section.classList.contains('no-animation')) {
                    sectionObserver.observe(section);
                }
            });
        } else {
            // Fallback for browsers without Intersection Observer
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
                img.classList.add('loaded');
                img.removeAttribute('data-src');
            });
            
            document.querySelectorAll('[data-background]').forEach(element => {
                element.style.backgroundImage = `url(${element.dataset.background})`;
                element.classList.add('loaded');
                element.removeAttribute('data-background');
            });
        }
    }
    
    // Execute when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onDOMReady);
    } else {
        // DOM is already ready
        onDOMReady();
    }
    
    // Check if all required scripts are loaded properly
    window.addEventListener('load', function() {
        console.log('Page fully loaded');
        
        // Reinitialize gallery if needed
        if (document.querySelector('.gallery-filter') && typeof initGalleryFunctionality === 'function') {
            console.log('Reinitializing gallery filter');
            initGalleryFunctionality();
        }
        
        // Check if testimonials slider is initialized
        setTimeout(function() {
            if (!document.querySelector('.testimonials-container').style.transform) {
                console.warn('Testimonials slider may not be initialized properly');
                // Try to reinitialize
                if (typeof initTestimonialsSlider === 'function') {
                    console.log('Reinitializing testimonial slider');
                    initTestimonialsSlider();
                }
            } else {
                console.log('Testimonials slider seems to be working');
            }
        }, 1000);
    });
})(); 