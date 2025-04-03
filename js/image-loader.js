/**
 * Enhanced Image Loader with WebP Support
 * - Adds WebP format detection
 * - Implements better lazy loading with Intersection Observer
 * - Uses native loading="lazy" as fallback
 * - Adds blur-up loading effect
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check for WebP support
    const webpSupport = checkWebPSupport();
    
    // Load critical images immediately
    loadCriticalImages();
    
    // Special handling for before-after section
    loadBeforeAfterImages();
    
    // Initialize image lazy loading for other images
    initLazyLoading();
    
    // Add WebP format when supported
    if (webpSupport) {
        document.documentElement.classList.add('webp-support');
    } else {
        document.documentElement.classList.add('no-webp-support');
    }
    
    /**
     * Check if browser supports WebP format
     */
    function checkWebPSupport() {
        const canvas = document.createElement('canvas');
        if (canvas.getContext && canvas.getContext('2d')) {
            // Check if browser can render WebP format
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
        return false;
    }
    
    /**
     * Initialize lazy loading for images
     */
    function initLazyLoading() {
        // Select all images with data-src attribute (excluding critical and before-after images)
        const lazyImages = document.querySelectorAll('img[data-src]:not(.critical-image):not(.before-after-image)');
        
        // Create config for Intersection Observer
        const config = {
            rootMargin: '50px 0px',
            threshold: 0.01
        };
        
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            // Create new Intersection Observer
            const observer = new IntersectionObserver(function(entries, self) {
                entries.forEach(function(entry) {
                    // When image is intersecting viewport
                    if (entry.isIntersecting) {
                        // Get the image element
                        const img = entry.target;
                        // Load image
                        loadImage(img);
                        // Stop observing image
                        self.unobserve(img);
                    }
                });
            }, config);
            
            // Observe each lazy image
            lazyImages.forEach(function(img) {
                observer.observe(img);
            });
        } else {
            // Fallback for browsers that don't support Intersection Observer
            lazyImages.forEach(function(img) {
                img.setAttribute('loading', 'lazy');
                loadImage(img);
            });
        }
    }
    
    /**
     * Load critical images immediately
     */
    function loadCriticalImages() {
        // Mark hero images, logo, etc. with class="critical-image"
        document.querySelectorAll('img.critical-image, .hero img[data-src], .navbar img[data-src]').forEach(img => {
            loadImage(img);
        });
    }
    
    /**
     * Load before-after images with priority
     */
    function loadBeforeAfterImages() {
        // Specifically target before-after section images
        document.querySelectorAll('.before-after-container img').forEach(img => {
            img.classList.add('before-after-image');
            
            // If using data-src, load the image
            if (img.hasAttribute('data-src')) {
                const src = img.getAttribute('data-src');
                img.src = src;
                img.removeAttribute('data-src');
            }
            
            // Add loaded class when image is fully loaded
            img.addEventListener('load', function() {
                img.classList.add('loaded');
                
                // Trigger a check if all images in the container are loaded
                checkBeforeAfterContainerReady(img.closest('.before-after-container'));
            });
        });
    }
    
    /**
     * Check if a before-after container has all images loaded
     * @param {HTMLElement} container - The before-after container to check
     */
    function checkBeforeAfterContainerReady(container) {
        if (!container) return;
        
        const images = container.querySelectorAll('img');
        let allLoaded = true;
        
        images.forEach(img => {
            if (!img.complete) {
                allLoaded = false;
            }
        });
        
        if (allLoaded) {
            // All images are loaded, initialize the slider
            container.classList.add('images-loaded');
            
            // If the slider already exists, reset it
            const slider = container.querySelector('.before-after-slider');
            if (slider) {
                setTimeout(() => {
                    // Dispatch a custom event that the before-after JS can listen for
                    const event = new CustomEvent('beforeAfterImagesLoaded', {
                        bubbles: true,
                        detail: { container }
                    });
                    container.dispatchEvent(event);
                }, 100);
            }
        }
    }
    
    /**
     * Load image with appropriate format
     */
    function loadImage(img) {
        // Get data-src attribute
        const src = img.getAttribute('data-src');
        if (!src) return;
        
        // If WebP is supported and src is not SVG, try WebP
        if (webpSupport && !src.endsWith('.svg')) {
            // Create path to WebP version
            const webpSrc = getWebPPath(src);
            
            // Try to load WebP first
            const webpImg = new Image();
            webpImg.onload = function() {
                // If WebP loaded successfully, use it
                img.src = webpSrc;
                img.classList.add('loaded');
            };
            webpImg.onerror = function() {
                // If WebP failed, use original format
                img.src = src;
                img.classList.add('loaded');
            };
            webpImg.src = webpSrc;
        } else {
            // Use original format
            img.src = src;
            img.classList.add('loaded');
        }
        
        // Remove data-src to prevent double loading
        img.removeAttribute('data-src');
    }
    
    /**
     * Get WebP path from original image path
     */
    function getWebPPath(src) {
        // If already WebP, return as is
        if (src.endsWith('.webp')) {
            return src;
        }
        
        // Replace extension with .webp
        const extensions = ['.jpg', '.jpeg', '.png'];
        let webpSrc = src;
        
        for (const ext of extensions) {
            if (src.toLowerCase().endsWith(ext)) {
                webpSrc = src.substring(0, src.length - ext.length) + '.webp';
                break;
            }
        }
        
        return webpSrc;
    }
});

// Re-check images on page load
window.addEventListener('load', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    // Force load any remaining images
    lazyImages.forEach(function(img) {
        if (img.hasAttribute('data-src')) {
            img.src = img.getAttribute('data-src');
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        }
    });
}); 