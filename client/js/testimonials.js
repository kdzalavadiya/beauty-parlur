/**
 * Testimonials slider functionality - God Level Edition
 */
(function() {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize testimonials slider with enhanced features
        initTestimonialsSlider();
    });

    /**
     * Initialize the testimonial slider functionality with advanced animations
     */
    function initTestimonialsSlider() {
        // Get testimonials section elements
        const testimonialsSection = document.querySelector('.testimonials-section');
        const testimonialsSlider = document.querySelector('.testimonials-slider');
        const testimonialSlides = document.querySelectorAll('.testimonial-slide');
       
        const dotsContainer = document.querySelector('.testimonial-dots');
        
        // Exit if elements don't exist
        if (!testimonialsSection || !testimonialsSlider || !testimonialSlides.length) {
            console.log("Testimonial elements not found");
            return;
        }
        
        console.log("Initializing advanced testimonial slider with", testimonialSlides.length, "slides");
        
        // Add live region for accessibility
        testimonialsSlider.setAttribute('aria-live', 'polite');
        
        // Set up variables
        let currentSlide = 0;
        let isAnimating = false;
        let autoplayTimer = null;
        let touchStartX = 0;
        let touchEndX = 0;

        // Add parallax effect elements to testimonial cards
        testimonialSlides.forEach(slide => {
            const card = slide.querySelector('.testimonial-card');
            if (card) {
                // Add shine effect element
                const shine = document.createElement('div');
                shine.className = 'card-shine';
                card.appendChild(shine);
                
                // Setup mouse move effect for 3D hover
                card.addEventListener('mousemove', handleCardMouseMove);
                card.addEventListener('mouseleave', handleCardMouseLeave);
            }
            
            // Add star pulsing effect
            const stars = slide.querySelectorAll('.testimonial-rating i');
            stars.forEach((star, i) => {
                star.style.setProperty('--i', i);
            });
        });
        
        // Create dots if container exists but no dots
        if (dotsContainer && !dotsContainer.querySelector('.testimonial-dot')) {
            createDots();
        }
        
        // Set initial position with animation
        setTimeout(() => {
            updateSlides(true);
        }, 100);
        
      
        
        // Add touch and drag events
        testimonialsSlider.addEventListener('touchstart', handleTouchStart, { passive: true });
        testimonialsSlider.addEventListener('touchend', handleTouchEnd, { passive: true });
        

        
        // Add keyboard navigation
        testimonialsSection.addEventListener('keydown', handleKeyboard);
        
        // Start autoplay with fade-in delay
        setTimeout(() => {
            startAutoplay();
            
            // Pause autoplay on hover or focus
            testimonialsSlider.addEventListener('mouseenter', stopAutoplay);
            testimonialsSlider.addEventListener('mouseleave', startAutoplay);
            testimonialsSlider.addEventListener('focusin', stopAutoplay);
            testimonialsSlider.addEventListener('focusout', startAutoplay);
        }, 1000);
        
        /**
         * Handle card mouse move for 3D effect
         */
        function handleCardMouseMove(e) {
            if (window.innerWidth < 768) return;
            
            const card = this;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 20;
            const rotateX = (centerY - y) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Update shine effect
            const shine = card.querySelector('.card-shine');
            if (shine) {
                const shineX = (x / rect.width) * 100;
                const shineY = (y / rect.height) * 100;
                shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)`;
            }
        }
        
        /**
         * Handle card mouse leave to reset 3D effect
         */
        function handleCardMouseLeave() {
            this.style.transform = '';
            
            // Reset shine effect
            const shine = this.querySelector('.card-shine');
            if (shine) {
                shine.style.background = 'none';
            }
        }
        

        
        /**
         * Create pagination dots
         */
        function createDots() {
            // Calculate total number of slides
            for (let i = 0; i < testimonialSlides.length; i++) {
                const dot = document.createElement('button');
                dot.className = 'testimonial-dot';
                dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
            
            updateActiveDot();
        }
        
        /**
         * Update active dot
         */
        function updateActiveDot() {
            const dots = document.querySelectorAll('.testimonial-dot');
            
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                    dot.setAttribute('aria-current', 'true');
                } else {
                    dot.classList.remove('active');
                    dot.setAttribute('aria-current', 'false');
                }
            });
        }
        

        
        /**
         * Go to previous slide
         */
        function slidePrev() {
            if (isAnimating) return;
            
            if (currentSlide > 0) {
                goToSlide(currentSlide - 1);
            } else {
                // Loop to the end
                goToSlide(testimonialSlides.length - 1);
            }
        }
        
        /**
         * Go to next slide
         */
        function slideNext() {
            if (isAnimating) return;
            
            if (currentSlide < testimonialSlides.length - 1) {
                goToSlide(currentSlide + 1);
            } else {
                // Loop to the beginning
                goToSlide(0);
            }
        }
        
        /**
         * Go to specific slide
         */
        function goToSlide(index) {
            if (isAnimating || index === currentSlide) return;
            
            isAnimating = true;
            
            // Get direction for animation
            const direction = index > currentSlide ? 'next' : 'prev';
            
            // Set previous active slide
            const prevActive = currentSlide;
            
            // Update current slide index
            currentSlide = index;
            
            // Update slide classes with direction-aware transitions
            updateSlides(false, direction, prevActive);
            
            // Reset autoplay
            if (autoplayTimer) {
                stopAutoplay();
                startAutoplay();
            }
        }
        
        /**
         * Update slider with active classes and transitions
         */
        function updateSlides(immediate = false, direction = 'next', prevActive = null) {
            // Reset all slides
            testimonialSlides.forEach((slide, i) => {
                // Clear existing classes first
                slide.classList.remove('active', 'prev', 'next');
                
                // Clear any inline styles from dragging
                if (immediate) {
                    slide.style.transform = '';
                    slide.style.opacity = '';
                    slide.style.transition = 'none';
                    
                    // Force reflow
                    void slide.offsetWidth;
                    slide.style.transition = '';
                }
                
                // Set ARIA attributes for accessibility
                if (i === currentSlide) {
                    slide.setAttribute('aria-hidden', 'false');
                } else {
                    slide.setAttribute('aria-hidden', 'true');
                }
            });
            
            // If immediate update (init or reset), just set classes without transition logic
            if (immediate) {
                // Set active slide
                testimonialSlides[currentSlide].classList.add('active');
                
                // Set previous slide
                const prevIndex = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
                testimonialSlides[prevIndex].classList.add('prev');
                
                // Set next slide
                const nextIndex = (currentSlide + 1) % testimonialSlides.length;
                testimonialSlides[nextIndex].classList.add('next');
            } else {
                // Handle direction-aware transitions
                if (direction === 'next') {
                    // Current becomes active, Next becomes new next, and prev becomes prev
                    testimonialSlides[currentSlide].classList.add('active');
                    
                    if (prevActive !== null) {
                        testimonialSlides[prevActive].classList.add('prev');
                    }
                    
                    const nextIndex = (currentSlide + 1) % testimonialSlides.length;
                    testimonialSlides[nextIndex].classList.add('next');
                } else {
                    // Current becomes active, Prev becomes new prev, and next becomes next
                    testimonialSlides[currentSlide].classList.add('active');
                    
                    if (prevActive !== null) {
                        testimonialSlides[prevActive].classList.add('next');
                    }
                    
                    const prevIndex = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
                    testimonialSlides[prevIndex].classList.add('prev');
                }
            }
            
            // Update active dot
            updateActiveDot();
            
            // Clear animation flag after transition
            setTimeout(() => {
                isAnimating = false;
            }, 700);
            
            // Announce for screen readers
            announceSlideChange();
        }
        
        /**
         * Handle touch start
         */
        function handleTouchStart(e) {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }
        
        /**
         * Handle touch end
         */
        function handleTouchEnd(e) {
            touchEndX = e.changedTouches[0].screenX;
            
            const touchDiff = touchStartX - touchEndX;
            
            // Detect swipe with threshold
            if (touchDiff > 70) {
                slideNext();
            } else if (touchDiff < -70) {
                slidePrev();
            }
            
            startAutoplay();
        }
        
        /**
         * Handle keyboard navigation
         */
        function handleKeyboard(e) {
            if (e.key === 'ArrowLeft') {
                slidePrev();
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                slideNext();
                e.preventDefault();
            }
        }
        
        /**
         * Start autoplay
         */
        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(() => {
                slideNext();
            }, 3000); // Change slide every 3 seconds
        }
        
        /**
         * Stop autoplay
         */
        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }
        
        /**
         * Announce slide change to screen readers
         */
        function announceSlideChange() {
            const liveRegion = testimonialsSection.querySelector('.sr-only');
            
            if (!liveRegion) {
                const newLiveRegion = document.createElement('div');
                newLiveRegion.className = 'sr-only';
                newLiveRegion.setAttribute('aria-live', 'polite');
                testimonialsSection.appendChild(newLiveRegion);
                
                setTimeout(() => {
                    newLiveRegion.textContent = `Showing testimonial ${currentSlide + 1} of ${testimonialSlides.length}`;
                }, 100);
            } else {
                liveRegion.textContent = `Showing testimonial ${currentSlide + 1} of ${testimonialSlides.length}`;
            }
        }
    }
})();