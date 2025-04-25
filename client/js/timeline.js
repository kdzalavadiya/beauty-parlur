/**
 * Timeline Component - JavaScript functionality
 * For New Real Bridal Studio
 */

document.addEventListener('DOMContentLoaded', () => {
    // Reference to timeline elements
    const timelineSection = document.getElementById('wedding-timeline');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (!timelineSection || timelineItems.length === 0) {
        console.log('Timeline section or items not found');
        return;
    }
    
    // Initialize the timeline
    initializeTimeline();
    
    // Setup intersection observer for animations
    setupTimelineObserver();
    
    // Add interaction handlers for timeline items
    setupTimelineInteractions();
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Setup touch swipe for mobile
    setupMobileSwipe();
    
    /**
     * Initialize timeline by setting initial states
     */
    function initializeTimeline() {
        // Mark the first item as active by default
        timelineItems[0].classList.add('active');
        
        // Add no-js class for browsers without JavaScript
        document.documentElement.classList.remove('no-js');
        
        // Ensure timeline is mobile-friendly from the start
        adjustTimelineForMobile();
    }
    
    /**
     * Setup intersection observer to animate timeline items as they enter viewport
     */
    function setupTimelineObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: [0.15, 0.5, 0.75] // Multiple thresholds for smoother transitions
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animate class for fade-in effect
                    entry.target.classList.add('animate');
                    
                    // When a new item becomes fully visible, update active state
                    if (entry.intersectionRatio > 0.5) {
                        timelineItems.forEach(item => item.classList.remove('active'));
                        entry.target.classList.add('active');
                    }
                    
                    // Stop observing after animation
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        // Observe all timeline items
        timelineItems.forEach((item, index) => {
            // Add delay based on index
            item.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(item);
        });
    }
    
    /**
     * Add interaction handlers to timeline items
     */
    function setupTimelineInteractions() {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        timelineItems.forEach(item => {
            const content = item.querySelector('.timeline-content');
            
            if (!content) return;
            
            // Click/touch handler
            content.addEventListener(isTouchDevice ? 'touchstart' : 'click', function(e) {
                // On touch devices, only prevent default for non-interactive elements
                if (!isTouchDevice || (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON')) {
                    e.preventDefault();
                }
                
                timelineItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Smooth scroll to item center in mobile view
                if (window.innerWidth <= 768) {
                    scrollToItem(item);
                }
            });
            
            // Hover effects for desktop only
            if (!isTouchDevice) {
                content.addEventListener('mouseenter', function() {
                    item.classList.add('hover');
                });
                
                content.addEventListener('mouseleave', function() {
                    item.classList.remove('hover');
                });
            }
        });
    }
    
    /**
     * Setup touch swipe navigation for mobile
     */
    function setupMobileSwipe() {
        if (window.innerWidth > 768) return;
        
        let touchStartY = 0;
        let touchEndY = 0;
        
        timelineSection.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        timelineSection.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeDistance = Math.abs(touchEndY - touchStartY);
            // Only process significant swipes
            if (swipeDistance < 30) return;
            
            // Find current active item
            const activeItem = document.querySelector('.timeline-item.active');
            if (!activeItem) return;
            
            const currentIndex = Array.from(timelineItems).indexOf(activeItem);
            let newIndex;
            
            if (touchEndY < touchStartY) {
                // Swipe up - go to next item
                newIndex = Math.min(currentIndex + 1, timelineItems.length - 1);
            } else {
                // Swipe down - go to previous item
                newIndex = Math.max(currentIndex - 1, 0);
            }
            
            if (newIndex !== currentIndex) {
                timelineItems.forEach(item => item.classList.remove('active'));
                timelineItems[newIndex].classList.add('active');
                scrollToItem(timelineItems[newIndex]);
            }
        }
    }
    
    /**
     * Smooth scroll to a timeline item
     * @param {Element} item - The timeline item to scroll to
     */
    function scrollToItem(item) {
        const rect = item.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Calculate position to scroll to (item top minus some space for navbar)
        const targetY = rect.top + scrollTop - 80;
        
        window.scrollTo({
            top: targetY,
            behavior: 'smooth'
        });
    }
    
    /**
     * Handle window resize events
     */
    function handleResize() {
        // Recalculate positions and sizes if needed
        adjustTimelineForMobile();
        
        // Reset any transform styles that might affect layout
        timelineItems.forEach(item => {
            const content = item.querySelector('.timeline-content');
            if (content) {
                content.style.transform = '';
            }
        });
        
        // Update mobile swipe handler based on screen size
        if (window.innerWidth <= 768) {
            setupMobileSwipe();
        }
    }
    
    /**
     * Adjust timeline for mobile view
     */
    function adjustTimelineForMobile() {
        if (window.innerWidth <= 768) {
            // Add mobile class to timeline section
            timelineSection.classList.add('mobile-view');
            
            // Ensure timeline items have proper mobile spacing
            timelineItems.forEach((item, index) => {
                // Add mobile-specific class
                item.classList.add('mobile-item');
                
                // Ensure proper spacing for each item
                if (index === 0) {
                    item.style.marginTop = '0';
                }
            });
        } else {
            // Remove mobile classes
            timelineSection.classList.remove('mobile-view');
            timelineItems.forEach(item => {
                item.classList.remove('mobile-item');
                item.style.marginTop = '';
            });
        }
    }
}); 