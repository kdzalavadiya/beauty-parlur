/**
 * Testimonials slider functionality
 */
(function() {
    // Check if testimonials section exists
    const testimonialsSection = document.querySelector('#testimonials');
    if (!testimonialsSection) return;

    // Elements
    const container = testimonialsSection.querySelector('.testimonials-container');
    const testimonials = Array.from(testimonialsSection.querySelectorAll('.testimonial'));
    const prevBtn = testimonialsSection.querySelector('.testimonial-prev');
    const nextBtn = testimonialsSection.querySelector('.testimonial-next');
    
    // Variables
    let currentIndex = 0;
    let isAnimating = false;
    const totalSlides = testimonials.length;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Add dots navigation
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'testimonial-dots';
    testimonialsSection.querySelector('.testimonials-slider').appendChild(dotsContainer);
    
    // Create dots
    testimonials.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot';
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.setAttribute('type', 'button');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(dotsContainer.querySelectorAll('.testimonial-dot'));
    
    // Initialize
    function init() {
        // Set initial slide
        goToSlide(0);
        
        // Event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Touch events
        container.addEventListener('touchstart', handleTouchStart, false);
        container.addEventListener('touchmove', handleTouchMove, false);
        container.addEventListener('touchend', handleTouchEnd, false);
        
        // Keyboard navigation
        testimonialsSection.addEventListener('keydown', handleKeydown);
        
        // Resize handling
        window.addEventListener('resize', handleResize);
        handleResize();
    }
    
    // Go to specified slide
    function goToSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Update current index
        currentIndex = index;
        
        // Handle wrap-around
        if (currentIndex < 0) currentIndex = totalSlides - 1;
        if (currentIndex >= totalSlides) currentIndex = 0;
        
        // Move container
        const slideWidth = testimonials[0].offsetWidth;
        container.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
        
        // Update aria attributes
        testimonials.forEach((testimonial, i) => {
            testimonial.setAttribute('aria-hidden', i !== currentIndex);
            if (i === currentIndex) {
                testimonial.removeAttribute('tabindex');
            } else {
                testimonial.setAttribute('tabindex', '-1');
            }
        });
        
        // Update active dot
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
            dot.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
        });
        
        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, 400); // Match this with CSS transition time
    }
    
    // Previous slide
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Next slide
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // Handle touch start
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
    }
    
    // Handle touch move
    function handleTouchMove(e) {
        touchEndX = e.touches[0].clientX;
    }
    
    // Handle touch end
    function handleTouchEnd() {
        const touchDiff = touchStartX - touchEndX;
        
        // Determine if it was a swipe (minimum threshold)
        if (Math.abs(touchDiff) > 50) {
            if (touchDiff > 0) {
                nextSlide(); // Swipe left, go to next
            } else {
                prevSlide(); // Swipe right, go to previous
            }
        }
    }
    
    // Handle keyboard navigation
    function handleKeydown(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    }
    
    // Handle resize
    function handleResize() {
        // Ensure slides are positioned correctly after resize
        goToSlide(currentIndex);
    }
    
    // Initialize
    init();
})(); 