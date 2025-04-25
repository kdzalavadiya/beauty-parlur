/**
 * Enhanced Image Loader with WebP Support and Error Handling
 * Handles lazy loading, WebP detection, and image optimization
 * Version: 2.0.0
 */

// Flag to track WebP support
let supportsWebP = false;

// Check for WebP support once on load
(function checkWebPSupport() {
    const webPImg = new Image();
    webPImg.onload = function() { supportsWebP = (webPImg.width > 0) && (webPImg.height > 0); };
    webPImg.onerror = function() { supportsWebP = false; };
    webPImg.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
})();

/**
 * Initialize lazy loading for all images with data-src attribute
 * @param {string} selector - Optional custom selector for target images
 * @param {Object} options - Optional configuration options
 */
function initLazyLoading(selector = 'img[data-src]', options = {}) {
    // Default configuration
    const config = {
        rootMargin: options.rootMargin || '0px 0px 200px 0px',
        threshold: options.threshold || 0.01,
        placeholderColor: options.placeholderColor || '#f5f5f5',
        retryLimit: options.retryLimit || 2,
        retryDelay: options.retryDelay || 3000,
        logErrors: options.logErrors !== undefined ? options.logErrors : true
    };

    // Skip if not supported or no elements match
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers without IntersectionObserver
        loadAllImagesImmediately(selector);
        return;
    }

    const images = document.querySelectorAll(selector);
    if (!images.length) return;

    // Create and configure IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                observer.unobserve(img);
                loadImage(img, 0, config);
            }
        });
    }, {
        rootMargin: config.rootMargin,
        threshold: config.threshold
    });

    // Set up each image
    images.forEach(img => {
        // Set default dimensions if present to prevent layout shifts
        if (img.hasAttribute('width') && img.hasAttribute('height')) {
            img.style.aspectRatio = `${img.getAttribute('width')} / ${img.getAttribute('height')}`;
        }

        // Add a placeholder color until the image loads
        img.style.backgroundColor = config.placeholderColor;

        // Check for existing loading attribute
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }

        // Start observing
        observer.observe(img);
    });

    // Expose the function globally if it's not already defined
    if (typeof window.initLazyLoading !== 'function') {
        window.initLazyLoading = initLazyLoading;
    }
}

/**
 * Load a single image with retry logic
 * @param {HTMLImageElement} img - The image element to load
 * @param {number} retryCount - Current retry attempt count
 * @param {Object} config - Configuration options
 */
function loadImage(img, retryCount = 0, config) {
    if (!img || !img.hasAttribute('data-src')) return;

    // Get the source URL
    let srcUrl = img.getAttribute('data-src');
    
    // Try WebP version if supported
    if (supportsWebP && !srcUrl.endsWith('.svg') && !srcUrl.includes('base64')) {
        const webpUrl = srcUrl.replace(/\.(jpe?g|png)$/i, '.webp');
        // Only use webP if we have it 
        if (webpUrl !== srcUrl) {
            const webpTest = new Image();
            webpTest.onload = () => { img.src = webpUrl; };
            webpTest.onerror = () => { img.src = srcUrl; };
            webpTest.src = webpUrl;
            return;
        }
    }

    // Standard loading for non-WebP images
    img.onload = function() {
        img.removeAttribute('data-src');
        // Remove placeholder styles
        img.style.backgroundColor = '';
        // Add animation class if not present
        if (!img.classList.contains('fade-in')) {
            img.classList.add('fade-in');
        }
    };

    img.onerror = function() {
        // Try again if under retry limit
        if (retryCount < config.retryLimit) {
            setTimeout(() => {
                loadImage(img, retryCount + 1, config);
            }, config.retryDelay);
            return;
        }
        
        // Handle permanent failure
        if (config.logErrors) {
            console.warn('Failed to load image after retries:', srcUrl);
        }
        
        // Replace with fallback
        const alt = img.alt || 'Image';
        const fallbackUrl = `https://placehold.co/600x400/f178b6/ffffff?text=${encodeURIComponent(alt)}`;
        img.src = fallbackUrl;
        
        // Add error class for styling
        img.classList.add('img-load-error');
    };

    // Start loading
    img.src = srcUrl;
}

/**
 * Fallback function for browsers without IntersectionObserver
 * @param {string} selector - Selector for target images
 */
function loadAllImagesImmediately(selector) {
    const images = document.querySelectorAll(selector);
    images.forEach(img => {
        if (img.hasAttribute('data-src')) {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        }
    });
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with default settings
    initLazyLoading();
    
    // Also handle background images with data-bg attribute
    const bgElements = document.querySelectorAll('[data-bg]');
    if (bgElements.length) {
        const bgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    bgObserver.unobserve(element);
                    const bgUrl = element.getAttribute('data-bg');
                    element.style.backgroundImage = `url(${bgUrl})`;
                    element.removeAttribute('data-bg');
                    element.classList.add('bg-loaded');
                }
            });
        }, { rootMargin: '0px 0px 200px 0px', threshold: 0.01 });
        
        bgElements.forEach(element => bgObserver.observe(element));
    }
}); 