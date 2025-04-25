/**
 * Advanced Animations & Effects
 * Performance-optimized animations for New Real Bridal Studio
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if AOS is loaded and initialize it
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
        console.log('AOS initialized');
    }
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Initialize animations based on user preference
    if (!prefersReducedMotion) {
        // Initialize all animation systems with normal settings
        initIntersectionObserver();
        initParallaxEffects();
        // Only use mouse tracking on desktop
        if (window.innerWidth > 768) {
            initMouseTrackingEffects();
        }
        initFeatureSectionAnimations();
        initHeroAnimations();
        initPetalEffects();
        initStickyNavbar();
        initGalleryEffects();
        initFloatingWidgetInteractions();
        initTestimonialCarousel();
    } else {
        // Initialize with minimal animations for users who prefer reduced motion
        initIntersectionObserver(true);
        initHeroAnimations(true);
        initStickyNavbar(true);
    }
    
    // Add global ripple effect for buttons
    document.addEventListener('click', addRippleEffect);
});

/**
 * Initialize Intersection Observer for scroll-based animations
 * This is a more efficient alternative to scroll event listeners
 * @param {boolean} reducedMotion - Whether to use reduced motion animations
 */
function initIntersectionObserver(reducedMotion = false) {
    // Elements that will be animated
    const animatedElements = document.querySelectorAll('.card, .section-title, .gallery-item, .hero-title, .hero-text, .testimonial-card, .contact-form, .contact-info, .cta-section, .booking-form, .booking-features');
    
    // Configuration for Intersection Observer
    const observerOptions = {
        root: null, // Use viewport as root
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Slightly delayed activation
    };
    
    // Create observer instance
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add appropriate animation class based on element type
                const element = entry.target;
                
                if (reducedMotion) {
                    // Simple fade-in for reduced motion preference
                    element.classList.add('animate', 'animate--simple-fade');
                } else {
                    if (element.classList.contains('card')) {
                        element.classList.add('animate', 'animate--fade-in-up');
                    } else if (element.classList.contains('section-title')) {
                        element.classList.add('animate', 'animate--fade-in-down');
                    } else if (element.classList.contains('gallery-item')) {
                        element.classList.add('animate', 'animate--scale-in');
                    } else if (element.classList.contains('hero-title')) {
                        element.classList.add('animate', 'animate--fade-in');
                    } else if (element.classList.contains('hero-text')) {
                        element.classList.add('animate', 'animate--fade-in-up', 'animate--delay-2');
                    } else if (element.classList.contains('testimonial-card')) {
                        element.classList.add('animate', 'animate--scale-in');
                    } else if (element.classList.contains('contact-form')) {
                        element.classList.add('animate', 'animate--fade-in-right');
                    } else if (element.classList.contains('contact-info')) {
                        element.classList.add('animate', 'animate--fade-in-left');
                    } else if (element.classList.contains('cta-section')) {
                        element.classList.add('animate', 'animate--fade-in');
                    } else if (element.classList.contains('booking-form')) {
                        element.classList.add('animate', 'animate--fade-in-right');
                    } else if (element.classList.contains('booking-features')) {
                        element.classList.add('animate', 'animate--fade-in-left');
                    }
                    
                    // Mark as animated for CSS transitions
                    element.classList.add('animated');
                }
                
                // Stop observing after animation has been triggered
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Start observing elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize parallax scrolling effects
 */
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    // Skip if no parallax elements or if user prefers reduced motion
    if (!parallaxElements.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    // Use passive scroll listener for better performance
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        // Use requestAnimationFrame for smoother performance
        requestAnimationFrame(function() {
            parallaxElements.forEach(element => {
                const scrollFactor = element.classList.contains('parallax--slow') ? 0.05 : 
                                   element.classList.contains('parallax--medium') ? 0.1 : 0.15;
                
                // Calculate new position for smooth parallax effect
                const yPos = -(scrollY * scrollFactor);
                element.style.setProperty('--parallax-translate', `${yPos}px`);
            });
        });
    }, { passive: true });
}

/**
 * Track mouse movement for interactive elements
 */
function initMouseTrackingEffects() {
    // Skip on mobile devices to save performance
    if (window.matchMedia('(max-width: 768px)').matches) {
        return;
    }
    
    const heroSection = document.querySelector('.hero');
    const cards = document.querySelectorAll('.card');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Add subtle tilt effects to hero section
    if (heroSection) {
        // Use a throttled version of mousemove for better performance
        let lastExecution = 0;
        const throttleDelay = 30; // milliseconds
        
        heroSection.addEventListener('mousemove', function(e) {
            const now = Date.now();
            if (now - lastExecution < throttleDelay) return;
            lastExecution = now;
            
            const heroRect = this.getBoundingClientRect();
            const mouseX = e.clientX - heroRect.left;
            const mouseY = e.clientY - heroRect.top;
            
            // Calculate movement proportional to mouse position
            const moveX = (mouseX - heroRect.width / 2) / 50;
            const moveY = (mouseY - heroRect.height / 2) / 50;
            
            // Apply subtle transform to create a parallax effect
            const heroContent = this.querySelector('.hero-content');
            if (heroContent) {
                requestAnimationFrame(() => {
                    heroContent.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
                });
            }
        });
        
        // Reset transform when mouse leaves hero section
        heroSection.addEventListener('mouseleave', function() {
            const heroContent = this.querySelector('.hero-content');
            if (heroContent) {
                requestAnimationFrame(() => {
                    heroContent.style.transform = 'translate3d(0, 0, 0)';
                });
            }
        });
    }
    
    // Add subtle hover effect to cards - using event delegation for better performance
    const cardContainer = document.querySelector('.services-section') || document.body;
    
    cardContainer.addEventListener('mousemove', function(e) {
        const card = e.target.closest('.card');
        if (!card) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate tilt angle based on mouse position
        const tiltX = (y / rect.height - 0.5) * 10;
        const tiltY = (x / rect.width - 0.5) * -10;
        
        // Apply 3D transform using requestAnimationFrame
        requestAnimationFrame(() => {
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
    });
    
    // Reset transform when mouse leaves card
    cardContainer.addEventListener('mouseleave', function(e) {
        const card = e.target.closest('.card');
        if (!card) return;
        
        requestAnimationFrame(() => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
    
    // Add similar effect to gallery items
    const galleryContainer = document.querySelector('.gallery-grid') || document.body;
    
    galleryContainer.addEventListener('mousemove', function(e) {
        const galleryItem = e.target.closest('.gallery-item');
        if (!galleryItem) return;
        
        const rect = galleryItem.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // More subtle tilt for gallery items
        const tiltX = (y / rect.height - 0.5) * 5;
        const tiltY = (x / rect.width - 0.5) * -5;
        
        requestAnimationFrame(() => {
            galleryItem.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
        });
    });
    
    galleryContainer.addEventListener('mouseleave', function(e) {
        const galleryItem = e.target.closest('.gallery-item');
        if (!galleryItem) return;
        
        requestAnimationFrame(() => {
            galleryItem.style.transform = '';
        });
    });
}

/**
 * Feature section animation initialization
 */
function initFeatureSectionAnimations() {
    // Add staggered animations to service cards
    const serviceCards = document.querySelectorAll('.card');
    
    serviceCards.forEach((card, index) => {
        // Add delay class based on index
        const delayClass = `animate--delay-${(index % 5) + 1}`;
        card.classList.add(delayClass);
    });
    
    // Floating effect for decorative elements
    const decorElements = document.querySelectorAll('.icon-box, .service-icon, .hero-shape');
    
    decorElements.forEach((element, index) => {
        // Alternate between float directions for more natural motion
        const floatClass = index % 2 === 0 ? 'animate--float' : 'animate--float-alt';
        element.classList.add(floatClass);
    });
    
    // Add pulse animation to call-to-action buttons
    const ctaButtons = document.querySelectorAll('.hero-cta .btn, .contact-form .btn, .booking-cta .btn');
    
    ctaButtons.forEach(button => {
        button.classList.add('pulse-effect');
    });
}

/**
 * Hero section animations
 * @param {boolean} reducedMotion - Whether to use reduced motion animations
 */
function initHeroAnimations(reducedMotion = false) {
    const hero = document.querySelector('.hero');
    
    if (!hero) return;
    
    // Add animated class to hero content elements with delay
    setTimeout(() => {
        const heroTitle = hero.querySelector('.hero-title');
        if (heroTitle) heroTitle.classList.add('animate', 'animate--fade-in');
        
        const heroText = hero.querySelector('.hero-text');
        if (heroText) heroText.classList.add('animate', 'animate--fade-in-up', 'animate--delay-1');
        
        const heroCta = hero.querySelector('.hero-cta');
        if (heroCta) heroCta.classList.add('animate', 'animate--fade-in-up', 'animate--delay-2');
    }, 300);
    
    // Skip particle animations for reduced motion preference
    if (reducedMotion) return;
    
    // Add the floating booking widget animation
    const floatingWidget = document.querySelector('.floating-booking-widget');
    if (floatingWidget) {
        floatingWidget.classList.add('pulse-effect');
    }
}

/**
 * Add ripple effect to clickable elements
 * @param {Event} e - Click event
 */
function addRippleEffect(e) {
    const target = e.target;
    
    // Check if the clicked element is a button or has the ripple class
    if (target.tagName.toLowerCase() === 'button' || 
        target.classList.contains('btn') || 
        target.classList.contains('card-btn') || 
        target.classList.contains('ripple-effect-target')) {
        
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        // Add ripple to the element
        target.appendChild(ripple);
        
        // Position the ripple at click point
        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        
        // Remove ripple after animation completes
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

/**
 * Initialize sticky navbar behavior
 * @param {boolean} reducedMotion - Whether to use reduced motion animations
 */
function initStickyNavbar(reducedMotion = false) {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    const scrollThreshold = 100; // When to start making navbar sticky
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Only apply sticky nav after scrolling down a bit
        if (currentScroll > scrollThreshold) {
            navbar.classList.add('nav-sticky');
            
            // Show/hide navbar based on scroll direction
            if (!reducedMotion) {
                if (currentScroll > lastScrollTop) {
                    // Scrolling down
                    navbar.classList.add('nav-hidden');
                    navbar.classList.remove('nav-visible');
                } else {
                    // Scrolling up
                    navbar.classList.remove('nav-hidden');
                    navbar.classList.add('nav-visible');
                }
            }
        } else {
            // At the top of the page
            navbar.classList.remove('nav-sticky', 'nav-hidden', 'nav-visible');
        }
        
        lastScrollTop = currentScroll;
    }, { passive: true });
}

/**
 * Initialize gallery effects
 */
function initGalleryEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!galleryItems.length) return;
    
    // Apply staggered animations
    galleryItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        
        // Add click handler for lightbox if needed
        item.addEventListener('click', function() {
            // Implementation for gallery lightbox
            const imgSrc = this.querySelector('img').getAttribute('src');
            const caption = this.querySelector('.gallery-caption h4')?.textContent || '';
            
            openLightbox(imgSrc, caption);
        });
    });
}

/**
 * Open a lightbox for gallery images
 * @param {string} imgSrc - Source of the image
 * @param {string} caption - Caption for the image
 */
function openLightbox(imgSrc, caption) {
    // Only create if not already exists
    if (!document.querySelector('.lightbox-overlay')) {
        // Create lightbox elements
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay animate--fade-in';
        
        lightbox.innerHTML = `
            <div class="lightbox-container">
                <img src="${imgSrc}" alt="${caption}" class="lightbox-image animate--scale-in">
                <div class="lightbox-caption">${caption}</div>
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev">&lsaquo;</button>
                <button class="lightbox-next">&rsaquo;</button>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(lightbox);
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        
        // Close lightbox when clicking outside or on close button
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', handleLightboxKeyboard);
    }
}

/**
 * Close the lightbox
 */
function closeLightbox() {
    const lightbox = document.querySelector('.lightbox-overlay');
    if (lightbox) {
        lightbox.classList.add('animate--fade-out');
        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = '';
        }, 300);
        
        // Remove keyboard event listener
        document.removeEventListener('keydown', handleLightboxKeyboard);
    }
}

/**
 * Handle keyboard navigation in lightbox
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleLightboxKeyboard(e) {
    switch (e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowRight':
            navigateLightbox('next');
            break;
        case 'ArrowLeft':
            navigateLightbox('prev');
            break;
    }
}

/**
 * Navigate between gallery images in lightbox
 * @param {string} direction - Navigation direction ('prev' or 'next')
 */
function navigateLightbox(direction) {
    const lightboxImg = document.querySelector('.lightbox-image');
    if (!lightboxImg) return;
    
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item img'));
    const currentSrc = lightboxImg.getAttribute('src');
    const currentIndex = galleryItems.findIndex(img => img.getAttribute('src') === currentSrc);
    
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'next') {
        newIndex = (currentIndex + 1) % galleryItems.length;
    } else {
        newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    }
    
    const newSrc = galleryItems[newIndex].getAttribute('src');
    const newCaption = galleryItems[newIndex].closest('.gallery-item').querySelector('.gallery-caption h4')?.textContent || '';
    
    // Animate image change
    lightboxImg.classList.add('animate--fade-out-quick');
    setTimeout(() => {
        lightboxImg.setAttribute('src', newSrc);
        document.querySelector('.lightbox-caption').textContent = newCaption;
        lightboxImg.classList.remove('animate--fade-out-quick');
        lightboxImg.classList.add('animate--fade-in-quick');
        
        setTimeout(() => {
            lightboxImg.classList.remove('animate--fade-in-quick');
        }, 300);
    }, 200);
}

/**
 * Initialize floating booking widget interactions
 */
function initFloatingWidgetInteractions() {
    const floatingWidget = document.querySelector('.floating-booking-widget');
    const bookingForm = document.querySelector('.floating-booking-form');
    
    if (!floatingWidget || !bookingForm) return;
    
    floatingWidget.addEventListener('click', function() {
        bookingForm.classList.toggle('active');
    });
    
    // Close form when clicking the close button
    const closeBtn = bookingForm.querySelector('.floating-form-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            bookingForm.classList.remove('active');
        });
    }
    
    // Handle form submission
    const form = bookingForm.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success toast notification
            showToast('Booking request submitted successfully!', 'success');
            
            // Hide form
            bookingForm.classList.remove('active');
            
            // Reset form
            form.reset();
        });
    }
}

/**
 * Display toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type ('success', 'error', 'info', 'warning')
 */
function showToast(message, type = 'info') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}-toast`;
    
    // Set icon based on type
    let icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'info') icon = 'ℹ';
    if (type === 'warning') icon = '⚠';
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
    `;
    
    // Add to body
    document.body.appendChild(toast);
    
    // Show with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

/**
 * Initialize testimonial carousel
 */
function initTestimonialCarousel() {
    const testimonialSection = document.querySelector('.testimonials-section');
    if (!testimonialSection) {
        console.warn('Testimonial section not found');
        return;
    }
    
    const testimonials = testimonialSection.querySelectorAll('.testimonial-card');
    if (!testimonials || testimonials.length < 2) {
        console.warn('Not enough testimonial cards found');
        return;
    }
    
    let currentSlide = 0;
    const slideCount = testimonials.length;
    
    // Create carousel controls
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'carousel-controls';
    
    controlsContainer.innerHTML = `
        <button class="carousel-prev" aria-label="Previous testimonial">&lsaquo;</button>
        <div class="carousel-indicators"></div>
        <button class="carousel-next" aria-label="Next testimonial">&rsaquo;</button>
    `;
    
    testimonialSection.appendChild(controlsContainer);
    
    // Create indicators
    const indicatorsContainer = controlsContainer.querySelector('.carousel-indicators');
    if (!indicatorsContainer) {
        console.error('Indicators container not found');
        return;
    }
    
    for (let i = 0; i < slideCount; i++) {
        const indicator = document.createElement('span');
        indicator.className = i === 0 ? 'active' : '';
        indicator.setAttribute('data-index', i);
        indicatorsContainer.appendChild(indicator);
        
        // Add click handler
        indicator.addEventListener('click', function() {
            goToSlide(parseInt(this.getAttribute('data-index')));
        });
    }
    
    // Add event listeners to controls
    const prevButton = controlsContainer.querySelector('.carousel-prev');
    const nextButton = controlsContainer.querySelector('.carousel-next');
    
    prevButton.addEventListener('click', () => {
        goToSlide((currentSlide - 1 + slideCount) % slideCount);
    });
    
    nextButton.addEventListener('click', () => {
        goToSlide((currentSlide + 1) % slideCount);
    });
    
    // Function to change slide
    function goToSlide(index) {
        // Update indicators
        const indicators = indicatorsContainer.querySelectorAll('span');
        indicators.forEach((indicator, i) => {
            indicator.className = i === index ? 'active' : '';
        });
        
        // Update testimonials
        testimonials.forEach((testimonial, i) => {
            if (i === index) {
                testimonial.classList.add('active');
                testimonial.classList.remove('inactive');
            } else {
                testimonial.classList.remove('active');
                testimonial.classList.add('inactive');
            }
        });
        
        currentSlide = index;
    }
    
    // Initialize first slide
    goToSlide(0);
    
    // Auto-advance slides every 5 seconds
    let autoplayInterval = setInterval(() => {
        goToSlide((currentSlide + 1) % slideCount);
    }, 5000);
    
    // Pause auto-advance on hover
    testimonialSection.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    testimonialSection.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(() => {
            goToSlide((currentSlide + 1) % slideCount);
        }, 5000);
    });
    
    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    testimonialSection.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches?.[0]?.screenX || 0;
    }, { passive: true });
    
    testimonialSection.addEventListener('touchend', e => {
        touchEndX = e.changedTouches?.[0]?.screenX || 0;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left
            goToSlide((currentSlide + 1) % slideCount);
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right
            goToSlide((currentSlide - 1 + slideCount) % slideCount);
        }
    }
}

/**
 * Add floating petal/flower effects
 */
function initPetalEffects() {
    const sections = document.querySelectorAll('.hero-section, .cta-section');
    
    sections.forEach(section => {
        // Create petals container if doesn't exist
        let petalsContainer = section.querySelector('.petals-container');
        
        if (!petalsContainer) {
            petalsContainer = document.createElement('div');
            petalsContainer.className = 'petals-container';
            section.appendChild(petalsContainer);
        }
        
        // Create individual petals
        const petalCount = section.classList.contains('hero-section') ? 12 : 8;
        
        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            
            // Randomize petal size, position, and animation
            const size = Math.random() * 20 + 10;
            petal.style.width = `${size}px`;
            petal.style.height = `${size}px`;
            
            petal.style.left = `${Math.random() * 100}%`;
            petal.style.animationDelay = `${Math.random() * 5}s`;
            petal.style.animationDuration = `${Math.random() * 5 + 10}s`;
            
            // Add slight rotation variation
            petal.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            petalsContainer.appendChild(petal);
        }
    });
}

/**
 * Handle image loading optimization
 * This optimizes image loading and provides fallbacks
 */
function optimizeImageLoading() {
    // Check for IntersectionObserver support
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.removeAttribute('data-src');
                        
                        lazyImage.onload = () => {
                            lazyImage.classList.add('loaded');
                        };
                    }
                    imageObserver.unobserve(lazyImage);
                }
            });
        }, {
            rootMargin: '200px 0px',
            threshold: 0.01
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.onload = () => {
                img.classList.add('loaded');
            };
        });
    }
}

/**
 * Handle responsive behaviors
 */
function setupResponsiveBehaviors() {
    // Fix vh units on mobile (addressing iOS Safari issues)
    const setVhProperty = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Set on initial load
    setVhProperty();
    
    // Update on resize and orientation change
    window.addEventListener('resize', setVhProperty);
    window.addEventListener('orientationchange', setVhProperty);
    
    // Fix mobile overflow issues
    const fixMobileOverflow = () => {
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.container, section, div').forEach(el => {
                if (el.offsetWidth > window.innerWidth) {
                    console.log('Fixing overflow element:', el);
                    el.style.width = '100%';
                    el.style.maxWidth = '100%';
                    el.style.overflowX = 'hidden';
                }
            });
        }
    };
    
    // Run overflow check
    setTimeout(fixMobileOverflow, 500);
    window.addEventListener('resize', fixMobileOverflow);
}

/**
 * Refreshes the AOS (Animate On Scroll) animations
 * Call this function after dynamically loading content
 */
function refreshAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
        console.log('AOS refreshed');
    }
}

// Make refreshAOS available globally
window.refreshAOS = refreshAOS;

// Run on DOM load
document.addEventListener('DOMContentLoaded', () => {
    optimizeImageLoading();
    setupResponsiveBehaviors();
}); 