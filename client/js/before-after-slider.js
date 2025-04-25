/**
 * Before & After Slider - JavaScript functionality
 * For New Real Bridal Studio
 */

document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.before-after-slider');
    
    // Initialize all sliders
    sliders.forEach(slider => {
        initializeSlider(slider);
    });
    
    // Listen for the custom event from image-loader.js
    document.addEventListener('beforeAfterImagesLoaded', (e) => {
        const container = e.detail.container;
        const slider = container.querySelector('.before-after-slider');
        
        if (slider) {
            // Re-initialize slider when images are loaded
            console.log('Reinitializing slider after images loaded');
            initializeSlider(slider, true);
        }
    });
    
    /**
     * Initialize a single before-after slider
     * @param {HTMLElement} slider - The slider element to initialize
     * @param {boolean} skipAnimation - Whether to skip the initial animation
     */
    function initializeSlider(slider, skipAnimation = false) {
        const container = slider.parentElement;
        const beforeImg = container.querySelector('.before-img');
        const afterImg = container.querySelector('.after-img');
        const handle = slider.querySelector('.slider-handle');
        
        // Check if images are loaded
        const beforeImgElement = beforeImg.querySelector('img');
        const afterImgElement = afterImg.querySelector('img');
        
        // If images aren't loaded yet, we'll let the event listener handle initialization
        if (beforeImgElement && !beforeImgElement.complete && afterImgElement && !afterImgElement.complete) {
            console.log('Images not loaded yet, deferring initialization');
            return;
        }
        
        if (skipAnimation) {
            // Set initial position without animation
            setSliderPosition(50);
        } else {
            // Add initialization animation class
            container.classList.add('init-animation');
            
            // Remove animation class after completion
            setTimeout(() => {
                container.classList.remove('init-animation');
                
                // Set initial position (50%) after animation completes
                setSliderPosition(50);
            }, 1600);
        }
        
        // Handle mouse and touch events
        slider.addEventListener('mousedown', startSliding);
        slider.addEventListener('touchstart', startSliding, { passive: false });
        
        // Handle keyboard events for accessibility
        slider.addEventListener('keydown', handleKeyboard);
        
        /**
         * Start sliding interaction
         * @param {Event} e - Mouse or touch event
         */
        function startSliding(e) {
            // Prevent default only for mouse events to avoid issues on touch devices
            if (e.type === 'mousedown') {
                e.preventDefault();
            }
            
            // Add event listeners for dragging
            document.addEventListener('mousemove', moveSlider);
            document.addEventListener('touchmove', moveSlider, { passive: false });
            document.addEventListener('mouseup', stopSliding);
            document.addEventListener('touchend', stopSliding);
            document.addEventListener('mouseleave', stopSliding);
            
            // Add active class for styling to both slider and container
            slider.classList.add('active');
            container.classList.add('active');
            
            // Call moveSlider to update on initial click/touch
            moveSlider(e);
        }
        
        /**
         * Move slider to new position based on mouse/touch position
         * @param {Event} e - Mouse or touch event
         */
        function moveSlider(e) {
            // Prevent default to avoid scrolling during touch slide
            e.preventDefault();
            
            let posX;
            
            // Get position from mouse or touch event
            if (e.type === 'touchmove' || e.type === 'touchstart') {
                posX = e.touches[0].clientX;
            } else {
                posX = e.clientX;
            }
            
            // Calculate position relative to container
            const containerRect = container.getBoundingClientRect();
            const containerLeft = containerRect.left;
            const containerWidth = containerRect.width;
            
            // Calculate percentage position
            let percentage = ((posX - containerLeft) / containerWidth) * 100;
            
            // Clamp to valid range
            percentage = Math.min(Math.max(percentage, 0), 100);
            
            // Update slider position
            setSliderPosition(percentage);
        }
        
        /**
         * Stop sliding interaction
         */
        function stopSliding() {
            // Remove event listeners
            document.removeEventListener('mousemove', moveSlider);
            document.removeEventListener('touchmove', moveSlider);
            document.removeEventListener('mouseup', stopSliding);
            document.removeEventListener('touchend', stopSliding);
            document.removeEventListener('mouseleave', stopSliding);
            
            // Remove active class from slider and container
            slider.classList.remove('active');
            container.classList.remove('active');
        }
        
        /**
         * Handle keyboard navigation for accessibility
         * @param {KeyboardEvent} e - Keyboard event
         */
        function handleKeyboard(e) {
            const step = 5; // Step size in percentage
            let currentPercentage = parseFloat(slider.style.left || '50') || 50;
            
            if (e.key === 'ArrowLeft') {
                // Move slider left
                setSliderPosition(Math.max(0, currentPercentage - step));
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                // Move slider right
                setSliderPosition(Math.min(100, currentPercentage + step));
                e.preventDefault();
            } else if (e.key === 'Home') {
                // Move slider to start
                setSliderPosition(0);
                e.preventDefault();
            } else if (e.key === 'End') {
                // Move slider to end
                setSliderPosition(100);
                e.preventDefault();
            }
        }
        
        /**
         * Set slider position based on percentage
         * @param {number} percentage - Position percentage (0-100)
         */
        function setSliderPosition(percentage) {
            // Update clip-path for after image
            afterImg.style.clipPath = `inset(0% 0% 0% ${100 - percentage}%)`;
            afterImg.style.webkitClipPath = `inset(0% 0% 0% ${100 - percentage}%)`;
            
            // Update slider handle position
            slider.style.left = `${percentage}%`;
            
            // Update ARIA value
            slider.setAttribute('aria-valuenow', Math.round(percentage));
        }
    }
    
    // Make sliders accessible
    makeSliderKeyboardAccessible();
    
    /**
     * Ensure sliders are keyboard accessible
     */
    function makeSliderKeyboardAccessible() {
        document.querySelectorAll('.before-after-slider').forEach(slider => {
            // Make sure slider is focusable
            if (!slider.hasAttribute('tabindex')) {
                slider.setAttribute('tabindex', '0');
            }
            
            // Add ARIA attributes
            slider.setAttribute('role', 'slider');
            slider.setAttribute('aria-valuemin', '0');
            slider.setAttribute('aria-valuemax', '100');
            slider.setAttribute('aria-valuenow', '50');
            slider.setAttribute('aria-orientation', 'horizontal');
            slider.setAttribute('aria-label', 'Before-After Slider');
            slider.setAttribute('aria-description', 'Use arrow keys to move the slider and reveal the before and after images.');
        });
    }
    
    /**
     * Add animations when sliders come into view
     */
    function setupIntersectionObserver() {
        const options = {
            root: null,
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const container = entry.target;
                    const slider = container.querySelector('.before-after-slider');
                    const afterImg = container.querySelector('.after-img');
                    
                    if (!slider || !afterImg) return;

                    // Reset initial position
                    slider.style.transition = 'none';
                    afterImg.style.transition = 'none';
                    slider.style.left = '0%';
                    afterImg.style.clipPath = 'inset(0% 0% 0% 100%)';
                    
                    // Force reflow
                    void slider.offsetWidth;
                    
                    // Animate slider from left to right
                    setTimeout(() => {
                        slider.style.transition = 'left 1.5s ease-in-out';
                        afterImg.style.transition = 'clip-path 1.5s ease-in-out';
                        slider.style.left = '50%';
                        afterImg.style.clipPath = 'inset(0% 0% 0% 50%)';
                        
                        // Remove transition after animation completes
                        setTimeout(() => {
                            slider.style.transition = '';
                            afterImg.style.transition = '';
                        }, 1500);
                    }, 300);
                    
                    // Unobserve after animation
                    observer.unobserve(container);
                }
            });
        }, options);
        
        // Observe all slider containers
        document.querySelectorAll('.before-after-container').forEach(container => {
            observer.observe(container);
        });
    }
    
    // Setup animations when sliders come into view
    setupIntersectionObserver();
}); 