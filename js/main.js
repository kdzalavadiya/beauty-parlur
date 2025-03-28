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
        
        // Clear any existing event listeners to avoid duplicates
        navToggle.outerHTML = navToggle.outerHTML;
        sidebarClose.outerHTML = sidebarClose.outerHTML;
        sidebarOverlay.outerHTML = sidebarOverlay.outerHTML;
        
        // Re-fetch elements after replacing
        const newNavToggle = document.querySelector('.menu-toggle');
        const newSidebarClose = document.querySelector('.sidebar-close');
        const newSidebarOverlay = document.querySelector('.sidebar-overlay');
        
        // Add ARIA attributes for accessibility
        newNavToggle.setAttribute('aria-expanded', 'false');
        mobileSidebar.setAttribute('aria-hidden', 'true');
        
        // Add event listeners to new elements
        
        // Toggle mobile sidebar - this is the most critical part
        newNavToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Menu toggle clicked!');
            
            // Simple toggle approach
            const isOpen = mobileSidebar.classList.contains('active');
            
            if (isOpen) {
                mobileSidebar.classList.remove('active');
                newNavToggle.classList.remove('active');
                newNavToggle.setAttribute('aria-expanded', 'false');
                mobileSidebar.setAttribute('aria-hidden', 'true');
                
                if (newSidebarOverlay) {
                    newSidebarOverlay.classList.remove('active');
                }
                
                // Restore body scrolling
                body.style.overflow = '';
                body.classList.remove('nav-open');
            } else {
                mobileSidebar.classList.add('active');
                newNavToggle.classList.add('active');
                newNavToggle.setAttribute('aria-expanded', 'true');
                mobileSidebar.setAttribute('aria-hidden', 'false');
                
                if (newSidebarOverlay) {
                    newSidebarOverlay.classList.add('active');
                }
                
                // Prevent body scrolling
                body.style.overflow = 'hidden';
                body.classList.add('nav-open');
            }
        });
        
        // Close sidebar with close button
        if (newSidebarClose) {
            newSidebarClose.addEventListener('click', function() {
                mobileSidebar.classList.remove('active');
                newNavToggle.classList.remove('active');
                newNavToggle.setAttribute('aria-expanded', 'false');
                mobileSidebar.setAttribute('aria-hidden', 'true');
                
                if (newSidebarOverlay) {
                    newSidebarOverlay.classList.remove('active');
                }
                
                // Restore body scrolling
                body.style.overflow = '';
                body.classList.remove('nav-open');
            });
        }
        
        // Close sidebar when clicking on overlay
        if (newSidebarOverlay) {
            newSidebarOverlay.addEventListener('click', function() {
                mobileSidebar.classList.remove('active');
                newNavToggle.classList.remove('active');
                newNavToggle.setAttribute('aria-expanded', 'false');
                mobileSidebar.setAttribute('aria-hidden', 'true');
                
                if (newSidebarOverlay) {
                    newSidebarOverlay.classList.remove('active');
                }
                
                // Restore body scrolling
                body.style.overflow = '';
                body.classList.remove('nav-open');
            });
        }
        
        // Handle sidebar link clicks
        if (sidebarLinks.length) {
            sidebarLinks.forEach(link => {
                // Clear existing listeners by cloning
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
                
                // Add event listener to new element
                newLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const href = this.getAttribute('href');
                    console.log('Sidebar link clicked:', href);
                    
                    if (!href || href === '#') {
                        // Just close the sidebar if no target
                        mobileSidebar.classList.remove('active');
                        newNavToggle.classList.remove('active');
                        newNavToggle.setAttribute('aria-expanded', 'false');
                        mobileSidebar.setAttribute('aria-hidden', 'true');
                        
                        if (newSidebarOverlay) {
                            newSidebarOverlay.classList.remove('active');
                        }
                        
                        // Restore body scrolling
                        body.style.overflow = '';
                        body.classList.remove('nav-open');
                        return;
                    }
                    
                    const targetId = href.substring(1);
                    
                    // First close the sidebar
                    mobileSidebar.classList.remove('active');
                    newNavToggle.classList.remove('active');
                    newNavToggle.setAttribute('aria-expanded', 'false');
                    mobileSidebar.setAttribute('aria-hidden', 'true');
                    
                    if (newSidebarOverlay) {
                        newSidebarOverlay.classList.remove('active');
                    }
                    
                    // Restore body scrolling
                    body.style.overflow = '';
                    body.classList.remove('nav-open');
                    
                    // Then scroll to the target after a slight delay
                    // This ensures the sidebar is closed before scrolling
                    setTimeout(function() {
                        const scrollSuccessful = scrollToSection(targetId);
                        
                        if (scrollSuccessful) {
                            // Update active state in navigation
                            document.querySelectorAll('.sidebar-nav a').forEach(navLink => {
                                navLink.classList.remove('active');
                            });
                            
                            // Add active class to the clicked link if not booking button
                            if (targetId !== 'booking') {
                                const activeLink = document.querySelector(`.sidebar-nav a[href="#${targetId}"]`);
                                if (activeLink) {
                                    activeLink.classList.add('active');
                                }
                            }
                        }
                    }, 400); // Match to sidebar transition duration
                });
            });
        }
        
        // Close sidebar when ESC key is pressed
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileSidebar && mobileSidebar.classList.contains('active')) {
                mobileSidebar.classList.remove('active');
                newNavToggle.classList.remove('active');
                newNavToggle.setAttribute('aria-expanded', 'false');
                mobileSidebar.setAttribute('aria-hidden', 'true');
                
                if (newSidebarOverlay) {
                    newSidebarOverlay.classList.remove('active');
                }
                
                // Restore body scrolling
                body.style.overflow = '';
                body.classList.remove('nav-open');
            }
        });
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
        
        // Click handler with improved smooth scrolling
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get current scroll position
            const currentPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            // Calculate scroll duration based on current position - longer duration for scrolling from further down the page
            // This creates a more natural feel as the page has more distance to cover
            const baseDuration = 300; // minimum duration in ms
            const scrollFactor = 0.15; // factor to add more time based on scroll position
            const maxDuration = 1200; // cap the maximum duration
            const calculatedDuration = Math.min(baseDuration + currentPosition * scrollFactor, maxDuration);
            
            // Add click animation
            this.classList.add('clicked');
            
            // Add a visual indicator that scrolling is in progress
            document.body.classList.add('smooth-scrolling');
            
            // Create smooth easing effect manually
            const startTime = performance.now();
            const duration = calculatedDuration;
            
            function scrollStep(timestamp) {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Use easeOutQuint easing function for smoother deceleration
                const easeOut = 1 - Math.pow(1 - progress, 5);
                
                // Calculate the next scroll position
                const scrollPosition = currentPosition - (currentPosition * easeOut);
                
                window.scrollTo(0, scrollPosition);
                
                if (progress < 1) {
                    window.requestAnimationFrame(scrollStep);
                } else {
                    // Ensure we're truly at the top when animation is complete
                    window.scrollTo(0, 0);
                    
                    // Remove click animation after scrolling completes
                    backToTopButton.classList.remove('clicked');
                    document.body.classList.remove('smooth-scrolling');
                    
                    // Announce for screen readers
                    announceToScreenReader('Returned to top of page');
                }
            }
            
            window.requestAnimationFrame(scrollStep);
        });
        
        function updateBackToTopVisibility() {
            const scrollY = window.scrollY || window.pageYOffset;
            
            if (scrollY > showAt) {
                if (!backToTopButton.classList.contains('visible')) {
                    backToTopButton.classList.add('visible');
                    
                    // Add entrance animation class
                    setTimeout(() => {
                        backToTopButton.classList.add('active');
                    }, 10);
                }
            } else {
                if (backToTopButton.classList.contains('active')) {
                    // Add exit animation
                    backToTopButton.classList.remove('active');
                    
                    // Wait for exit animation to complete before hiding
                    setTimeout(() => {
                        backToTopButton.classList.remove('visible');
                    }, 300);
                }
            }
        }
    }
    
    /**
     * Helper function for screen reader announcements
     */
    function announceToScreenReader(message) {
        const announcer = document.getElementById('sr-announcer') || document.createElement('div');
        
        if (!document.getElementById('sr-announcer')) {
            announcer.id = 'sr-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.className = 'sr-only';
            announcer.style.position = 'absolute';
            announcer.style.width = '1px';
            announcer.style.height = '1px';
            announcer.style.overflow = 'hidden';
            announcer.style.clip = 'rect(0, 0, 0, 0)';
            document.body.appendChild(announcer);
        }
        
        // Clear previous content and set new message
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 50);
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
    
    /**
     * Scroll to a section by ID with error handling
     * @param {string} sectionId - The ID of the section to scroll to
     */
    function scrollToSection(sectionId) {
        console.log('Scrolling to section:', sectionId);
        
        // Remove the # if it's included
        if (sectionId.startsWith('#')) {
            sectionId = sectionId.substring(1);
        }
        
        // Get the target element
        let targetElement = document.getElementById(sectionId);
        
        // If not found, try alternate methods
        if (!targetElement) {
            console.warn(`Section with ID "${sectionId}" not found, trying selector`);
            targetElement = document.querySelector(`section[id="${sectionId}"]`);
        }
        
        if (!targetElement) {
            console.warn(`Section "${sectionId}" still not found, trying section with class`);
            targetElement = document.querySelector(`section.${sectionId}`);
        }
        
        if (targetElement) {
            // Calculate position with offset for the header
            const headerOffset = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            console.log(`Scrolling to section "${sectionId}" at position:`, offsetPosition);
            
            // Scroll to the target section
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Update URL
            if (history.pushState) {
                history.pushState(null, null, `#${sectionId}`);
            }
            
            return true;
        } else {
            console.error(`Section "${sectionId}" not found on page`);
            return false;
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
        
        // Verify section IDs exist and are properly formatted
        console.log('Verifying section IDs...');
        const sectionIds = ['home', 'services', 'gallery', 'testimonials', 'contact', 'booking'];
        const missingIds = [];
        
        sectionIds.forEach(id => {
            const section = document.getElementById(id);
            if (!section) {
                console.warn(`Section with ID "${id}" not found!`);
                missingIds.push(id);
            } else {
                console.log(`Section "${id}" found at position:`, section.offsetTop);
            }
        });
        
        if (missingIds.length > 0) {
            console.error('Missing section IDs:', missingIds);
        } else {
            console.log('All section IDs found correctly');
        }
        
        // Verify mobile menu functionality
        const navToggle = document.querySelector('.menu-toggle');
        const mobileSidebar = document.querySelector('.mobile-sidebar');
        
        console.log('Mobile menu elements check:', {
            navToggle: !!navToggle,
            mobileSidebar: !!mobileSidebar 
        });
        
        // Ensure event listeners are attached
        if (navToggle && !navToggle._hasClickListener) {
            console.log('Re-attaching mobile menu click handler');
            
            // Clear existing listeners
            const newNavToggle = navToggle.cloneNode(true);
            navToggle.parentNode.replaceChild(newNavToggle, navToggle);
            
            newNavToggle.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Menu toggle clicked (from load handler)');
                
                if (mobileSidebar) {
                    const isOpen = mobileSidebar.classList.contains('active');
                    
                    if (isOpen) {
                        // Close sidebar
                        mobileSidebar.classList.remove('active');
                        newNavToggle.classList.remove('active');
                        
                        const sidebarOverlay = document.querySelector('.sidebar-overlay');
                        if (sidebarOverlay) {
                            sidebarOverlay.classList.remove('active');
                        }
                        
                        document.body.style.overflow = '';
                        document.body.classList.remove('nav-open');
                    } else {
                        // Open sidebar
                        mobileSidebar.classList.add('active');
                        newNavToggle.classList.add('active');
                        
                        const sidebarOverlay = document.querySelector('.sidebar-overlay');
                        if (sidebarOverlay) {
                            sidebarOverlay.classList.add('active');
                        }
                        
                        document.body.style.overflow = 'hidden';
                        document.body.classList.add('nav-open');
                    }
                }
            });
            newNavToggle._hasClickListener = true;
        }
        
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