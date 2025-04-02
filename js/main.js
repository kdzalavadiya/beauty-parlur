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
                    
                    // Then scroll to the target section
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        // Use smooth scrolling if supported
                        if ('scrollBehavior' in document.documentElement.style) {
                            targetSection.scrollIntoView({ behavior: 'smooth' });
                        } else {
                            // Fallback for browsers that don't support smooth scrolling
                            targetSection.scrollIntoView();
                        }
                    }
                    
                    // Restore body scrolling
                    body.style.overflow = '';
                    body.classList.remove('nav-open');
                });
            });
        }
        
        // Close menu on Escape key
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
                    newButton.classList.add('visible');
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
            if ('scrollBehavior' in document.documentElement.style) {
                // Native smooth scrolling
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // Fallback for browsers that don't support smooth scrolling
                window.scrollTo(0, 0);
            }
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
    
    // Execute when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onDOMReady);
    } else {
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
        addRedundantNavListeners();
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
                if (e.target === this) {
                    closeModal(this);
                }
            });
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                modals.forEach(modal => {
                    if (modal.classList.contains('active')) {
                        closeModal(modal);
                    }
                });
            }
        });
        
        // Functions to open and close modals
        function openModal(modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
            
            // Focus the first focusable element in the modal
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length) {
                focusableElements[0].focus();
            }
        }
        
        function closeModal(modal) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    }
    
    /**
     * Add redundant navigation listeners for better reliability
     */
    function addRedundantNavListeners() {
        const isOpen = mobileSidebar.classList.contains('active');
        console.log('Adding redundant navigation listeners, sidebar open:', isOpen);
    }

    /**
     * Helper function to safely get elements
     */
    function getElement(selector) {
        return document.querySelector(selector);
    }
    
})(); 