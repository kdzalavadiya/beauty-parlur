/**
 * UI Enhancements
 * Advanced UI/UX improvements for New Real Bridal Studio
 */

document.addEventListener('DOMContentLoaded', function() {
    // Detect if touch device
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    
    // Add class to html element for CSS targeting
    if (isTouchDevice) {
        document.documentElement.classList.add('touch-device');
    } else {
        document.documentElement.classList.add('no-touch');
    }
    
    // Initialize all enhancements with appropriate optimizations for device type
    initSmoothScrolling();
    initMicroInteractions();
    
    // Only use hover effects on non-touch devices for better performance
    if (!isTouchDevice) {
        initHoverEffects();
    }
    
    initContentRevealAnimations();
    initStickyHeader();
    initTimelineAnimations();
    initLazyLoading();
    
    // Enable responsive navigation
    initResponsiveNav();

    // Show body after initializing (prevents FOUC)
    document.body.classList.add('loaded');
});

/**
 * Smooth scrolling functionality for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Get header height for offset with a small buffer
                const headerHeight = document.querySelector('header').offsetHeight + 20;
                
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Micro-interactions for buttons and interactive elements
 */
function initMicroInteractions() {
    // Add pulse effect to primary call-to-action buttons
    document.querySelectorAll('.hero-content .btn, .timeline-cta .btn').forEach(btn => {
        btn.classList.add('pulse-effect');
    });
    
    // Add ripple effect to all buttons on click
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            ripple.addEventListener('animationend', function() {
                ripple.remove();
            });
        });
    });
    
    // Add typewriter effect to hero title on first load
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle && !sessionStorage.getItem('titleAnimated')) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.classList.add('typewriter');
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                heroTitle.classList.remove('typewriter');
                sessionStorage.setItem('titleAnimated', 'true');
            }
        }, 50);
    }
}

/**
 * Advanced hover effects for cards and images
 */
function initHoverEffects() {
    // Tilt effect for service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = ((x / rect.width) - 0.5) * 20;
            const yPercent = ((y / rect.height) - 0.5) * 20;
            
            this.style.transform = `perspective(1000px) rotateX(${-yPercent}deg) rotateY(${xPercent}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
    
    // Zoom effect for gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('zoom-effect');
        });
        
        item.addEventListener('mouseleave', function() {
            this.classList.remove('zoom-effect');
        });
    });
}

/**
 * Content reveal animations when scrolling
 */
function initContentRevealAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                // Different animations based on element type
                if (el.classList.contains('service-card')) {
                    el.classList.add('fade-in-up');
                } else if (el.classList.contains('gallery-item')) {
                    el.classList.add('fade-in');
                } else if (el.classList.contains('section-title')) {
                    el.classList.add('fade-in-up');
                } else if (el.classList.contains('testimonial-item')) {
                    el.classList.add('fade-in-right');
                } else {
                    el.classList.add('fade-in');
                }
                
                // Stop observing after animation
                observer.unobserve(el);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    document.querySelectorAll('.service-card, .gallery-item, .section-title, .testimonial-item, .about-content, .contact-form').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Sticky header implementation
 */
function initStickyHeader() {
    const header = document.querySelector('nav');
    const headerHeight = header ? header.offsetHeight : 0;
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        
        // Add sticky class after scrolling past header height
        if (scrollTop > headerHeight) {
            header.classList.add('nav-sticky');
            
            // Hide header when scrolling down, show when scrolling up
            if (scrollTop > lastScrollTop) {
                header.classList.add('nav-hidden');
            } else {
                header.classList.remove('nav-hidden');
                header.classList.add('nav-visible');
            }
        } else {
            header.classList.remove('nav-sticky');
            header.classList.remove('nav-hidden');
            header.classList.remove('nav-visible');
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Timeline animations and functionality
 */
function initTimelineAnimations() {
    const timelineSection = document.getElementById('wedding-timeline');
    
    if (!timelineSection) {
        console.log('Timeline section not found');
        return;
    }
    
    console.log('Timeline section found, initializing animations');
    
    const timelineItems = timelineSection.querySelectorAll('.timeline-item');
    console.log('Found timeline items:', timelineItems.length);
    
    // Set initial state - only first item active
    if (timelineItems.length > 0) {
        timelineItems[0].classList.add('active');
        console.log('Set first timeline item as active');
    }
    
    // Create observer for timeline items
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add active class to highlight current item
                const currentIndex = Array.from(timelineItems).indexOf(entry.target);
                
                // When a new item becomes fully visible, update active state
                if (entry.intersectionRatio > 0.75) {
                    timelineItems.forEach(item => item.classList.remove('active'));
                    entry.target.classList.add('active');
                }
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: [0.2, 0.75]
    });
    
    // Observe all timeline items
    timelineItems.forEach((item, index) => {
        // Add delay based on index
        item.style.animationDelay = `${index * 0.2}s`;
        observer.observe(item);
    });
    
    // Add click interaction to timeline items
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            timelineItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Lazy loading implementation for images
 */
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                    }
                    lazyImage.classList.remove('lazy');
                    observer.unobserve(lazyImage);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(lazyImage => {
            lazyImageObserver.observe(lazyImage);
        });
    }
    
    // Enable CSS for non-JS users
    document.querySelectorAll('link[rel="stylesheet"][media="print"]').forEach(link => {
        link.media = 'all';
    });
}

/**
 * Responsive navigation implementation
 */
function initResponsiveNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.mobile-sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const sidebarClose = document.querySelector('.sidebar-close');
    const navLinks = document.querySelectorAll('.mobile-sidebar a');

    if (!menuToggle || !sidebar) return;
    
    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
        sidebar.classList.add('active');
        document.body.classList.add('no-scroll');
        if (sidebarOverlay) {
            sidebarOverlay.classList.add('active');
        }
        
        // Set expanded state for accessibility
        this.setAttribute('aria-expanded', 'true');
        sidebar.setAttribute('aria-hidden', 'false');
    });
    
    // Close mobile menu functions
    function closeMobileMenu() {
        sidebar.classList.remove('active');
        document.body.classList.remove('no-scroll');
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
        }
        
        // Reset accessibility attributes
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
        }
        sidebar.setAttribute('aria-hidden', 'true');
    }
    
    // Close button event
    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeMobileMenu);
    }
    
    // Close on overlay click
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Close on nav link click for mobile
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Handle resize - close mobile menu if viewport changes to desktop
    let windowWidth = window.innerWidth;
    window.addEventListener('resize', function() {
        if (window.innerWidth !== windowWidth) {
            windowWidth = window.innerWidth;
            
            if (windowWidth > 768 && sidebar.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });
} 