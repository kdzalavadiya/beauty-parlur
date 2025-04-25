/**
 * Back to Top Button functionality
 * Shows a button when user scrolls down and allows smooth scrolling to top
 */
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const backToTopBtn = document.getElementById('back-to-top-btn');
    
    // Scroll threshold in pixels to show the button
    const scrollThreshold = 300;
    
    // Check if element exists
    if (!backToTopBtn) {
        console.error('Back to top button not found');
        return;
    }
    
    // Show button when scrolled down
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        
        if (scrollPosition > scrollThreshold) {
            backToTopBtn.classList.add('visible');
            
            // Add pulsing animation if scrolled really far
            if (scrollPosition > window.innerHeight * 2) {
                backToTopBtn.classList.add('pulsing');
            } else {
                backToTopBtn.classList.remove('pulsing');
            }
        } else {
            backToTopBtn.classList.remove('visible');
            backToTopBtn.classList.remove('pulsing');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Add a class for click animation
        backToTopBtn.classList.add('clicked');
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Remove the click animation class after animation completes
        setTimeout(() => {
            backToTopBtn.classList.remove('clicked');
        }, 300);
    });
    
    // Initial check in case page is refreshed while scrolled down
    if (window.scrollY > scrollThreshold) {
        backToTopBtn.classList.add('visible');
    }
    
    // Add a helper class to the button when user reaches footer
    window.addEventListener('scroll', function() {
        const footer = document.querySelector('footer');
        if (!footer) return;
        
        const footerPosition = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (footerPosition < windowHeight) {
            backToTopBtn.classList.add('above-footer');
        } else {
            backToTopBtn.classList.remove('above-footer');
        }
    });
}); 