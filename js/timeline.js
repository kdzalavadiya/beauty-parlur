/**
 * Timeline Component - JavaScript functionality
 * For New Real Bridal Studio
 */

document.addEventListener('DOMContentLoaded', () => {
    // Reference to timeline elements
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Initialize the timeline
    initializeTimeline();
    
    // Setup intersection observer for animations
    setupTimelineObserver();
    
    // Add click handlers for timeline items
    setupTimelineInteractions();
    
    /**
     * Initialize timeline by setting initial states
     */
    function initializeTimeline() {
        // Mark the first item as active by default
        if (timelineItems.length > 0) {
            timelineItems[0].classList.add('active');
        }
    }
    
    /**
     * Setup intersection observer to animate timeline items as they enter viewport
     */
    function setupTimelineObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.25
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('timeline-item-visible');
                    // Progressively animate items when they become visible
                    const delay = 200; // milliseconds
                    const childElements = entry.target.querySelectorAll('.timeline-date, .timeline-content, .timeline-dot');
                    
                    childElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('animate-in');
                        }, delay * index);
                    });
                    
                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        // Observe all timeline items
        timelineItems.forEach(item => {
            observer.observe(item);
        });
    }
    
    /**
     * Add interaction handlers to timeline items
     */
    function setupTimelineInteractions() {
        timelineItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all items
                timelineItems.forEach(i => i.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Scroll item into center view if not already visible
                const rect = this.getBoundingClientRect();
                const isInView = (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
                
                if (!isInView) {
                    this.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            });
            
            // Add hover effect for timeline content
            const content = item.querySelector('.timeline-content');
            if (content) {
                content.addEventListener('mouseenter', function() {
                    item.classList.add('hover');
                });
                
                content.addEventListener('mouseleave', function() {
                    item.classList.remove('hover');
                });
            }
        });
    }
}); 