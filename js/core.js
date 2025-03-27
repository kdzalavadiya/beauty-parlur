/**
 * Core JavaScript functionality for Real Bridal Studio
 * Contains only the most critical functions needed for initial page loading
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize critical features
    try {
        initMobileNavigation();
        initSmoothScrolling();
        initScrolledNav();
        initBackToTop();
        
        // Show content and hide loading screen quickly
        requestAnimationFrame(() => {
            setTimeout(() => {
                document.querySelector('.loading-screen').classList.add('hidden');
            }, 300);
        });
        
        // Load additional scripts only when needed
        loadScriptsDynamically();
        
    } catch (error) {
        console.error('Initialization error:', error);
        document.querySelector('.loading-screen').classList.add('hidden');
    }
});

/**
 * Mobile Navigation - Optimized
 */
function initMobileNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });
    
    // Close menu when clicking a link (event delegation)
    navLinks.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
}

/**
 * Smooth Scrolling - Optimized
 */
function initSmoothScrolling() {
    // Use event delegation instead of multiple listeners
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        if (target.tagName === 'A' && target.getAttribute('href') && target.getAttribute('href').startsWith('#')) {
            const targetId = target.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            e.preventDefault();
            
            const navHeight = document.querySelector('nav')?.offsetHeight || 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            
            window.scrollTo({
                top: targetPosition - navHeight,
                behavior: 'smooth'
            });
        }
    });
}

/**
 * Handle scrolled navigation bar - Optimized with throttling
 */
function initScrolledNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    // Throttle scroll event for better performance
    let lastScrollPosition = 0;
    let ticking = false;
    
    function handleScroll() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        lastScrollPosition = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll(lastScrollPosition);
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Initial check
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    }
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    
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
}

/**
 * Dynamically load additional scripts
 */
function loadScriptsDynamically() {
    // Load particles.js if hero section exists
    if (document.getElementById('particles-js')) {
        loadScript('https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js', function() {
            loadScript('js/particles-config.js');
        });
    }
    
    // Load form scripts if forms exist
    if (document.getElementById('contact-form') || document.getElementById('booking-form')) {
        loadScript('js/form-handlers.js');
    }
    
    // Load gallery scripts if gallery exists
    if (document.querySelector('.gallery-grid')) {
        loadScript('js/gallery.js');
    }
    
    // Load testimonials slider if it exists
    if (document.querySelector('.testimonials-slider')) {
        loadScript('js/testimonials.js');
    }
    
    // Add back-to-top button
    createBackToTopButton();
    
    // Load animations on idle
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(function() {
            loadScript('js/animations.js');
        }, { timeout: 2000 });
    } else {
        setTimeout(function() {
            loadScript('js/animations.js');
        }, 2000);
    }
}

/**
 * Helper function to load scripts dynamically
 */
function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    
    if (callback) {
        script.onload = callback;
    }
    
    document.body.appendChild(script);
}

/**
 * Create back to top button for better mobile navigation
 */
function createBackToTopButton() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide button based on scroll position
    let lastScrollTop = 0;
    const scrollThreshold = 600;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > scrollThreshold) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
        
        // Hide when scrolling down, show when scrolling up
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            button.classList.add('hiding');
        } else {
            button.classList.remove('hiding');
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
    
    document.body.appendChild(button);
}

/**
 * Utility function: Debounce
 * Limits the rate at which a function is invoked
 * @param {Function} func - The function to debounce
 * @param {Number} wait - Time in milliseconds to wait
 * @returns {Function} - The debounced function
 */
function debounce(func, wait = 100) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// Export utility functions for use in other modules
window.RealBridal = window.RealBridal || {};
window.RealBridal.utils = {
    debounce: debounce
}; 