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

/**
 * Core JavaScript functionality for New Real Bridal Studio website
 * Handles browser compatibility, performance monitoring, and core utilities
 */

(function() {
    // Browser compatibility checks and feature detection
    const browserSupport = {
        // Check browser features
        init: function() {
            this.checkBrowserSupport();
            this.applyCompatibilityFixes();
            this.notifyUserOfCompatibilityIssues();
        },
        
        // Feature detection
        features: {
            flexbox: typeof document.documentElement.style.flexBasis !== 'undefined',
            grid: typeof document.documentElement.style.grid !== 'undefined',
            webp: false, // Will be set by checkWebpSupport()
            webgl: false, // Will be set by checkWebGL()
            backdrop: typeof document.documentElement.style.backdropFilter !== 'undefined',
            speechRecognition: ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window),
            touchEvents: ('ontouchstart' in window) || (navigator.maxTouchPoints > 0),
            passiveEvents: false, // Will be set by checkPassiveEvents()
            intersectionObserver: 'IntersectionObserver' in window,
            localStorage: false, // Will be set by checkLocalStorage()
            es6: false // Will be set by checkES6Support()
        },
        
        // Browser detection
        browser: {
            name: 'unknown',
            version: 0,
            isIE: false,
            isEdge: false,
            isFirefox: false,
            isChrome: false,
            isSafari: false,
            isOpera: false,
            isMobile: false,
            isOldBrowser: false
        },
        
        checkBrowserSupport: function() {
            console.log('Checking browser compatibility...');
            
            // Detect browser
            this.detectBrowser();
            
            // Check for WebP support
            this.checkWebpSupport();
            
            // Check for WebGL
            this.checkWebGL();
            
            // Check for passive events support
            this.checkPassiveEvents();
            
            // Check localStorage support
            this.checkLocalStorage();
            
            // Check ES6 support
            this.checkES6Support();
            
            // Log results
            console.log('Browser support check completed:', this.features);
            console.log('Browser info:', this.browser);
        },
        
        detectBrowser: function() {
            const ua = navigator.userAgent;
            this.browser.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
            
            // Detect browser name and version
            if (ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0) {
                this.browser.isIE = true;
                this.browser.name = 'Internet Explorer';
                this.browser.isOldBrowser = true;
            } else if (ua.indexOf('Edge/') > 0) {
                this.browser.isEdge = true;
                this.browser.name = 'Edge Legacy';
            } else if (ua.indexOf('Edg/') > 0) {
                this.browser.isEdge = true;
                this.browser.name = 'Edge (Chromium)';
            } else if (ua.indexOf('Firefox/') > 0) {
                this.browser.isFirefox = true;
                this.browser.name = 'Firefox';
            } else if (ua.indexOf('Chrome/') > 0) {
                this.browser.isChrome = true;
                this.browser.name = 'Chrome';
            } else if (ua.indexOf('Safari/') > 0 && ua.indexOf('Chrome/') === -1) {
                this.browser.isSafari = true;
                this.browser.name = 'Safari';
            } else if (ua.indexOf('OPR/') > 0 || ua.indexOf('Opera/') > 0) {
                this.browser.isOpera = true;
                this.browser.name = 'Opera';
            }
            
            // Check for old versions
            if (
                (this.browser.isChrome && parseInt(ua.match(/Chrome\/(\d+)/)[1], 10) < 70) ||
                (this.browser.isFirefox && parseInt(ua.match(/Firefox\/(\d+)/)[1], 10) < 60) ||
                (this.browser.isSafari && parseInt(ua.match(/Version\/(\d+)/)[1], 10) < 12)
            ) {
                this.browser.isOldBrowser = true;
            }
        },
        
        checkWebpSupport: function() {
            const webpImage = new Image();
            webpImage.onload = () => { 
                this.features.webp = true; 
                document.documentElement.classList.add('webp');
            };
            webpImage.onerror = () => { 
                this.features.webp = false; 
                document.documentElement.classList.add('no-webp');
            };
            webpImage.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
        },
        
        checkWebGL: function() {
            try {
                const canvas = document.createElement('canvas');
                this.features.webgl = !!(
                    window.WebGLRenderingContext && 
                    (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
                );
            } catch (e) {
                this.features.webgl = false;
            }
            
            if (this.features.webgl) {
                document.documentElement.classList.add('webgl');
            } else {
                document.documentElement.classList.add('no-webgl');
            }
        },
        
        checkPassiveEvents: function() {
            try {
                let opts = Object.defineProperty({}, 'passive', {
                    get: function() {
                        this.features.passiveEvents = true;
                        return true;
                    }
                });
                window.addEventListener('test', null, opts);
                window.removeEventListener('test', null, opts);
            } catch (e) {
                this.features.passiveEvents = false;
            }
        },
        
        checkLocalStorage: function() {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                this.features.localStorage = true;
            } catch (e) {
                this.features.localStorage = false;
                console.warn('localStorage not supported');
            }
        },
        
        checkES6Support: function() {
            try {
                // Check for ES6 features like arrow functions, template literals, let/const, etc.
                new Function('(a = 0) => a');
                this.features.es6 = true;
            } catch (e) {
                this.features.es6 = false;
                console.warn('ES6 features not fully supported');
            }
        },
        
        applyCompatibilityFixes: function() {
            // Add polyfills and fallbacks for browsers without certain features
            
            // Add CSS classes to html element for feature-based styling
            const htmlEl = document.documentElement;
            
            // Add browser classes
            htmlEl.classList.add(this.browser.name.toLowerCase().replace(/\s+/g, '-'));
            if (this.browser.isMobile) htmlEl.classList.add('mobile-device');
            if (this.browser.isOldBrowser) htmlEl.classList.add('legacy-browser');
            
            // Add feature classes
            if (!this.features.flexbox) htmlEl.classList.add('no-flexbox');
            if (!this.features.grid) htmlEl.classList.add('no-grid');
            if (!this.features.backdrop) htmlEl.classList.add('no-backdrop-filter');
            
            // Adjust for low-end devices or older browsers
            if (this.browser.isOldBrowser || !this.features.webgl) {
                // Reduce animations and effects for performance
                htmlEl.classList.add('reduced-motion');
                
                // Force reduced animations regardless of user preference
                document.querySelector('body').style.setProperty('--transition-speed', '0.1s');
                document.querySelector('body').style.setProperty('--animation-speed', '0.1s');
                
                console.log('Applied reduced animations for compatibility');
            }
            
            // Apply fix for backdrop-filter
            if (!this.features.backdrop) {
                // Add a fallback for glass morphism effects
                const glassElements = document.querySelectorAll('.ai-glass-container, .glass-effect');
                glassElements.forEach(el => {
                    el.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                });
                
                console.log('Applied backdrop-filter fallbacks');
            }
        },
        
        notifyUserOfCompatibilityIssues: function() {
            if (this.browser.isOldBrowser) {
                // Create a notification for users with older browsers
                const notification = document.createElement('div');
                notification.className = 'browser-compatibility-alert';
                notification.innerHTML = `
                    <div class="compatibility-content">
                        <p><strong>Your browser may not support all features of this website.</strong></p>
                        <p>For the best experience, please update your browser or try Chrome, Firefox, or Edge.</p>
                        <button class="close-notification">×</button>
                    </div>
                `;
                
                document.body.appendChild(notification);
                
                // Add click handler for the close button
                notification.querySelector('.close-notification').addEventListener('click', function() {
                    notification.style.display = 'none';
                    
                    // Save dismissal in localStorage if available
                    if (browserSupport.features.localStorage) {
                        localStorage.setItem('browser-alert-dismissed', 'true');
                    }
                });
                
                // Only show if not previously dismissed
                if (browserSupport.features.localStorage && localStorage.getItem('browser-alert-dismissed') === 'true') {
                    notification.style.display = 'none';
                }
                
                console.log('Added browser compatibility notification');
            }
        }
    };
    
    // Initialize browser support module when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        browserSupport.init();
    });
    
    // Make browserSupport available to other scripts
    window.browserSupport = browserSupport;
    
})(); 