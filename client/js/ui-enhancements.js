/**
 * UI Enhancements
 * Advanced UI/UX improvements for New Real Bridal Studio
 * Optimized for performance
 */

document.addEventListener('DOMContentLoaded', function() {
    // Detect if touch device once at initialization
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    
    // Add class to html element for CSS targeting
    document.documentElement.classList.add(isTouchDevice ? 'touch-device' : 'no-touch');
    
    // Initialize all enhancements with appropriate optimizations for device type
    initSmoothScrolling();
    initMicroInteractions();
    
    // Only use hover effects on non-touch devices for better performance
    if (!isTouchDevice) {
        initHoverEffects();
    }
    
    // Delay non-critical initializations to improve initial load time
    requestAnimationFrame(() => {
        initContentRevealAnimations();
        initStickyHeader();
        initTimelineAnimations();
        initLazyLoading();
        initResponsiveNav();
    });

    // Show body after initializing (prevents FOUC)
    document.body.classList.add('loaded');

    // Initialize back to top with a slight delay to ensure other operations complete first
    setTimeout(initBackToTop, 500);
});

/**
 * Utility function to debounce frequent events like scroll and resize
 */
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Smooth scrolling functionality for anchor links
 */
function initSmoothScrolling() {
    // Cache DOM queries for better performance
    const anchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    const header = document.querySelector('header') || document.querySelector('nav');
    const headerHeight = header ? header.offsetHeight + 20 : 20;
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Micro-interactions for buttons and interactive elements
 */
function initMicroInteractions() {
    // Add pulse effect to primary call-to-action buttons
    document.querySelectorAll('.hero-content .btn, .timeline-cta .btn').forEach(btn => {
        btn.classList.add('pulse-effect');
    });
    
    // Add ripple effect to all buttons on click - using event delegation for better performance
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn')) {
            const button = e.target.closest('.btn');
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            button.appendChild(ripple);
            
            ripple.addEventListener('animationend', function() {
                ripple.remove();
            });
        }
    });
    
    // Add typewriter effect to hero title on first load
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle && !sessionStorage.getItem('titleAnimated')) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.classList.add('typewriter');
        
        let i = 0;
        const typeSpeed = 50; // ms per character
        let lastTypingTime = 0;
        
        // Use requestAnimationFrame for better performance
        function typeWriter(timestamp) {
            if (!lastTypingTime) lastTypingTime = timestamp;
            
            const elapsed = timestamp - lastTypingTime;
            
            if (elapsed > typeSpeed) {
                if (i < originalText.length) {
                    heroTitle.textContent += originalText.charAt(i);
                    i++;
                    lastTypingTime = timestamp;
                } else {
                    heroTitle.classList.remove('typewriter');
                    sessionStorage.setItem('titleAnimated', 'true');
                    return; // Stop the animation frame loop
                }
            }
            
            if (i < originalText.length) {
                requestAnimationFrame(typeWriter);
            }
        }
        
        // Start the animation
        requestAnimationFrame(typeWriter);
    }
}

/**
 * Sticky header implementation with debounced scroll event
 */
function initStickyHeader() {
    const header = document.querySelector('nav');
    if (!header) return;
    
    const headerHeight = header.offsetHeight;
    let lastScrollTop = 0;
    
    // Use debounced scroll event for better performance
    const handleScroll = debounce(() => {
        const scrollTop = window.scrollY;
        
        // Add sticky class after scrolling past header height
        if (scrollTop > headerHeight) {
            header.classList.add('nav-sticky');
            
            // Hide header when scrolling down, show when scrolling up
            if (scrollTop > lastScrollTop) {
                header.classList.add('nav-hidden');
                header.classList.remove('nav-visible');
            } else {
                header.classList.remove('nav-hidden');
                header.classList.add('nav-visible');
            }
        } else {
            header.classList.remove('nav-sticky', 'nav-hidden', 'nav-visible');
        }
        
        lastScrollTop = scrollTop;
    }, 10);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Advanced hover effects for cards and images
 */
function initHoverEffects() {
    // Tilt effect for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = ((x / rect.width) - 0.5) * 20;
            const yPercent = ((y / rect.height) - 0.5) * 20;
            
            this.style.transform = `perspective(1000px) rotateX(${-yPercent}deg) rotateY(${xPercent}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
    
    // Add classes for gallery items using event delegation
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
        galleryContainer.addEventListener('mouseenter', function(e) {
            if (e.target.closest('.gallery-item')) {
                e.target.closest('.gallery-item').classList.add('zoom-effect');
            }
        }, true);
        
        galleryContainer.addEventListener('mouseleave', function(e) {
            if (e.target.closest('.gallery-item')) {
                e.target.closest('.gallery-item').classList.remove('zoom-effect');
            }
        }, true);
    }
}

/**
 * Content reveal animations when scrolling using Intersection Observer
 */
function initContentRevealAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                // Different animations based on element type
                if (el.classList.contains('service-card')) {
                    el.classList.add('fade-in-up');
                } else if (el.classList.contains('gallery-item')) {
                    el.classList.add('fade-in');
                } else if (el.classList.contains('section-title')) {
                    el.classList.add('fade-in-up');
                } else if (el.classList.contains('testimonial-item')) {
                    el.classList.add('fade-in-right');
                } else {
                    el.classList.add('fade-in');
                }
                
                // Stop observing after animation
                observer.unobserve(el);
            }
        });
    }, observerOptions);
    
    // Batch DOM operations for better performance
    const elementsToObserve = [
        ...document.querySelectorAll('.service-card'), 
        ...document.querySelectorAll('.gallery-item'),
        ...document.querySelectorAll('.section-title'),
        ...document.querySelectorAll('.testimonial-item'),
        ...document.querySelectorAll('.about-content'),
        ...document.querySelectorAll('.contact-form')
    ];
    
    elementsToObserve.forEach(el => observer.observe(el));
}

/**
 * Timeline animations and functionality
 */
function initTimelineAnimations() {
    const timelineSection = document.getElementById('wedding-timeline');
    
    if (!timelineSection) {
        console.log('Timeline section not found');
        return;
    }
    
    console.log('Timeline section found, initializing animations');
    
    const timelineItems = timelineSection.querySelectorAll('.timeline-item');
    console.log('Found timeline items:', timelineItems.length);
    
    // Set initial state - only first item active
    if (timelineItems.length > 0) {
        timelineItems[0].classList.add('active');
        console.log('Set first timeline item as active');
    }
    
    // Create observer for timeline items
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add active class to highlight current item
                const currentIndex = Array.from(timelineItems).indexOf(entry.target);
                
                // When a new item becomes fully visible, update active state
                if (entry.intersectionRatio > 0.75) {
                    timelineItems.forEach(item => item.classList.remove('active'));
                    entry.target.classList.add('active');
                }
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: [0.2, 0.75]
    });
    
    // Observe all timeline items
    timelineItems.forEach((item, index) => {
        // Add delay based on index
        item.style.animationDelay = `${index * 0.2}s`;
        observer.observe(item);
    });
    
    // Add click interaction to timeline items
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            timelineItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Lazy loading implementation for images
 */
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                    }
                    lazyImage.classList.remove('lazy');
                    observer.unobserve(lazyImage);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(lazyImage => {
            lazyImageObserver.observe(lazyImage);
        });
    }
    
    // Enable CSS for non-JS users
    document.querySelectorAll('link[rel="stylesheet"][media="print"]').forEach(link => {
        link.media = 'all';
    });
}

/**
 * Responsive navigation implementation
 */
function initResponsiveNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.mobile-sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const sidebarClose = document.querySelector('.sidebar-close');
    const navLinks = document.querySelectorAll('.mobile-sidebar a');

    if (!menuToggle || !sidebar) return;
    
    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
        sidebar.classList.add('active');
        document.body.classList.add('no-scroll');
        if (sidebarOverlay) {
            sidebarOverlay.classList.add('active');
        }
        
        // Set expanded state for accessibility
        this.setAttribute('aria-expanded', 'true');
        sidebar.setAttribute('aria-hidden', 'false');
    });
    
    // Close mobile menu functions
    function closeMobileMenu() {
        sidebar.classList.remove('active');
        document.body.classList.remove('no-scroll');
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
        }
        
        // Reset accessibility attributes
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
        }
        sidebar.setAttribute('aria-hidden', 'true');
    }
    
    // Close button event
    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeMobileMenu);
    }
    
    // Close on overlay click
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Close on nav link click for mobile
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Handle resize - close mobile menu if viewport changes to desktop
    let windowWidth = window.innerWidth;
    window.addEventListener('resize', function() {
        if (window.innerWidth !== windowWidth) {
            windowWidth = window.innerWidth;
            
            if (windowWidth > 768 && sidebar.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });
}

/**
 * Remove will-change property after animations to free resources
 */
function cleanupWillChange() {
    // Wait for all initial animations to complete
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-right');
        animatedElements.forEach(el => {
            el.style.willChange = 'auto';
            el.classList.add('animated');
        });
    }, 2000);
}

// Call the cleanup function with a delay after page load
window.addEventListener('load', () => {
    // Wait for all animations to be triggered
    setTimeout(cleanupWillChange, 3000);
});

/**
 * Back to top button functionality
 */
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    const toggleBackToTopButton = () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    };
    
    // Initial check
    toggleBackToTopButton();
    
    // Add scroll event listener with passive flag for better performance
    window.addEventListener('scroll', debounce(toggleBackToTopButton, 100), { passive: true });
    
    // Smooth scroll to top when clicked
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Add animation class
        this.classList.add('clicked');
        
        // Use modern browser scrollTo with smooth behavior first
        // This provides a more reliable experience in modern browsers
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Reset animation class after animation completes
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 600);
        } else {
            // Fallback for browsers that don't support smooth scrolling
            const scrollToTop = () => {
                const currentPosition = window.scrollY;
                
                if (currentPosition > 0) {
                    // Calculate a faster scroll that feels smooth
                    const scrollStep = Math.max(currentPosition / 8, 60);
                    window.scrollTo(0, currentPosition - scrollStep);
                    requestAnimationFrame(scrollToTop);
                } else {
                    // Remove animation class once at top
                    backToTopButton.classList.remove('clicked');
                }
            };
            
            requestAnimationFrame(scrollToTop);
        }
    });
} 