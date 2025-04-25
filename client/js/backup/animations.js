/**
 * Animations for Real Bridal Studio
 * Optimized for performance with reduced properties and improved transitions
 */

(function() {
    // Initialize when document is fully loaded
    window.addEventListener('load', function() {
        // Initialize animations only if required libraries are loaded
        if (typeof AOS !== 'undefined') {
            initAOS();
        }
        
        // Initialize other animations
        initDynamicBubbleBackground();
        initBubbleAnimation();
        initScrollAnimations();
        initFloatingElements();
        initBackToTopAnimation();
        
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            initGSAPAnimations();
        }
    });
    
    /**
     * AOS Animations with Reduced Properties
     */
    function initAOS() {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            delay: 100,
            easing: 'ease-in-out',
            disable: 'mobile',  // Disable on mobile for performance
            throttleDelay: 99   // Throttle for performance
        });
    }
    
    /**
     * Dynamic Bubble Background Animation
     * Creates an interactive bubble effect with mouse tracking
     */
    function initDynamicBubbleBackground() {
        const bubbleContainer = document.querySelector('.bubble-background');
        if (!bubbleContainer) return;
        
        // Clear existing bubbles
        bubbleContainer.innerHTML = '';
        
        // Create canvas element for bubbles
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '0';
        bubbleContainer.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Set up bubble properties
        const bubbles = [];
        const maxBubbles = window.innerWidth < 768 ? 50 : 80;
        const colors = [
            'rgba(241, 120, 182, 0.15)',
            'rgba(241, 120, 182, 0.2)',
            'rgba(241, 120, 182, 0.25)',
            'rgba(247, 167, 207, 0.15)',
            'rgba(247, 167, 207, 0.2)',
            'rgba(247, 167, 207, 0.25)',
            'rgba(255, 212, 229, 0.15)',
            'rgba(255, 212, 229, 0.2)'
        ];
        
        let mouseX = 0;
        let mouseY = 0;
        let mouseRadius = 100;
        
        // Track mouse position
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Bubble class
        class Bubble {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.size = Math.random() * 10 + 3;
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + this.size;
                this.speed = Math.random() * 0.8 + 0.2;
                this.velocityX = Math.random() * 2 - 1;
                this.velocityY = -(Math.random() * 0.8 + 1.5);
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.4 + 0.3;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = (Math.random() * 2 - 1) * 0.1;
                this.shadowBlur = Math.random() * 5;
            }
            
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = this.shadowBlur;
                ctx.fillStyle = this.color;
                
                // Create bubble
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Add highlight
                ctx.beginPath();
                ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fill();
                
                ctx.restore();
            }
            
            update() {
                // Mouse interaction - gentle flow away from mouse
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouseRadius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouseRadius - distance) / mouseRadius;
                    
                    this.velocityX += Math.cos(angle) * force * 0.05;
                    this.velocityY += Math.sin(angle) * force * 0.05;
                }
                
                // Apply velocity with damping
                this.velocityX *= 0.98;
                this.velocityY *= 0.98;
                
                // Add slight randomness to movement
                this.velocityX += (Math.random() - 0.5) * 0.02;
                this.velocityY += (Math.random() - 0.5) * 0.02;
                
                // Update position
                this.x += this.velocityX;
                this.y += this.velocityY;
                
                // Rotation
                this.rotation += this.rotationSpeed;
                
                // Check if bubble is out of bounds
                if (this.y < -this.size * 2 || this.x < -this.size * 2 || this.x > canvas.width + this.size * 2) {
                    this.reset();
                }
                
                // Random opacity fluctuation
                this.opacity += (Math.random() - 0.5) * 0.01;
                this.opacity = Math.max(0.2, Math.min(0.7, this.opacity));
            }
        }
        
        // Initialize bubbles
        for (let i = 0; i < maxBubbles; i++) {
            const bubble = new Bubble();
            // Set initial positions throughout the canvas
            bubble.y = Math.random() * canvas.height;
            bubbles.push(bubble);
        }
        
        // Animation loop
        function animate() {
            // Clear canvas with very subtle gradient
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw bubbles
            bubbles.forEach(bubble => {
                bubble.update();
                bubble.draw();
            });
            
            // Request next frame
            requestAnimationFrame(animate);
        }
        
        // Handle window resize
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            mouseRadius = Math.min(canvas.width, canvas.height) * 0.1;
        });
        
        // Start animation
        animate();
    }

    /**
     * Original Bubble Animation (as fallback)
     */
    function initBubbleAnimation() {
        const bubbleContainer = document.querySelector('.bubble-background');
        if (!bubbleContainer || bubbleContainer.querySelector('canvas')) return;
        
        // Skip if canvas has been added by dynamic bubble background
        if (bubbleContainer.querySelector('canvas')) return;
        
        // Create random bubbles dynamically (simpler version as fallback)
        const bubbleCount = 40;
        
        // Clear existing bubbles
        bubbleContainer.innerHTML = '';
        
        // Create new bubbles
        for (let i = 0; i < bubbleCount; i++) {
            createBubble(bubbleContainer);
        }
        
        // Create bubble with random properties
        function createBubble(container) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            
            // Random size between 10px and 60px
            const size = Math.floor(Math.random() * 50) + 10;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            
            // Random horizontal position
            bubble.style.left = `${Math.random() * 100}%`;
            
            // Random delay
            bubble.style.animationDelay = `${Math.random() * 10}s`;
            
            // Random duration between 10s and 20s
            bubble.style.animationDuration = `${Math.random() * 10 + 10}s`;
            
            // Random opacity
            bubble.style.opacity = (Math.random() * 0.6 + 0.2).toFixed(2);
            
            // Random background color
            const colors = [
                'rgba(241, 120, 182, 0.2)',
                'rgba(241, 120, 182, 0.25)',
                'rgba(241, 120, 182, 0.3)',
                'rgba(247, 167, 207, 0.2)',
                'rgba(247, 167, 207, 0.25)',
                'rgba(247, 167, 207, 0.3)'
            ];
            bubble.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            // Add to container
            container.appendChild(bubble);
            
            // Remove and recreate bubble after animation ends
            bubble.addEventListener('animationend', function() {
                this.remove();
                createBubble(container);
            });
        }
    }

    /**
     * Scroll Animations
     */
    function initScrollAnimations() {
        // Add animation classes on scroll
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            
            // Fade in elements as they enter viewport
            document.querySelectorAll('.fade-in-element').forEach(element => {
                const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                const windowHeight = window.innerHeight;
                
                if (scrollPosition > elementPosition - windowHeight + 100) {
                    element.classList.add('visible');
                }
            });
        });
    }

    /**
     * Floating Elements Animation
     */
    function initFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach(element => {
            // Random initial position
            const randomX = Math.random() * 20 - 10; // -10px to 10px
            const randomY = Math.random() * 20 - 10; // -10px to 10px
            
            // Random animation duration
            const randomDuration = Math.random() * 2 + 3; // 3-5s
            
            // Apply styles
            element.style.transform = `translate(${randomX}px, ${randomY}px)`;
            element.style.animation = `float ${randomDuration}s ease-in-out infinite alternate`;
        });
    }

    /**
     * Back to Top Button Animation
     */
    function initBackToTopAnimation() {
        const backToTopButton = document.querySelector('.back-to-top');
        if (!backToTopButton) return;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * GSAP Animations - Optimized
     */
    function initGSAPAnimations() {
        try {
            // Hero title reveal animation
            gsap.from(".hero-title", {
                duration: 1,
                opacity: 0,
                y: 30,
                ease: "power3.out",
                delay: 0.2
            });
            
            // Hero text reveal animation
            gsap.from(".hero-text", {
                duration: 1,
                opacity: 0,
                y: 20,
                ease: "power3.out",
                delay: 0.4
            });
            
            // Hero CTA buttons animation
            gsap.from(".hero-cta .btn", {
                duration: 0.8,
                opacity: 0,
                y: 15,
                stagger: 0.15,
                ease: "power2.out",
                delay: 0.6
            });
            
            // Section titles animation with ScrollTrigger
            gsap.utils.toArray('.section-title').forEach((title) => {
                gsap.from(title, {
                    scrollTrigger: {
                        trigger: title,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    },
                    opacity: 0,
                    y: 20,
                    duration: 0.7,
                    ease: "power2.out"
                });
            });
            
            // Testimonials animation
            gsap.from(".testimonial", {
                scrollTrigger: {
                    trigger: ".testimonials-slider",
                    start: "top 80%"
                },
                opacity: 0,
                x: 30,
                duration: 0.7,
                stagger: 0.2,
                ease: "power2.out"
            });
        } catch (error) {
            console.error('GSAP animation error:', error);
        }
    }
    
    /**
     * Track scroll position for animation optimization
     */
    function initScrollTracking() {
        // Add scroll tracking for performance optimization
        const scrollElements = document.querySelectorAll('.scroll-track');
        
        if (!scrollElements.length) return;
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            });
            
            scrollElements.forEach(element => {
                observer.observe(element);
            });
        } else {
            // Fallback for browsers without Intersection Observer
            scrollElements.forEach(element => {
                element.classList.add('in-view');
            });
        }
    }

    /**
     * Animation and effects for cards and sections
     */
    function initFadeAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right, .zoom-in');
        
        if (animatedElements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Initialize card hover effects
    function initCardEffects() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            // Parallax effect on hover
            card.addEventListener('mousemove', (e) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;
                
                // Calculate how far the mouse is from the center of the card
                const deltaX = e.clientX - cardCenterX;
                const deltaY = e.clientY - cardCenterY;
                
                // Normalize by dividing by the dimensions of the card
                const tiltX = deltaY / (cardRect.height / 2);
                const tiltY = -deltaX / (cardRect.width / 2);
                
                // Apply transform with subtle tilt
                card.style.transform = `perspective(1000px) rotateX(${tiltX * 2}deg) rotateY(${tiltY * 2}deg) translateZ(10px)`;
            });
            
            // Reset on mouse leave
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
                card.style.transition = 'transform 0.5s ease';
            });
            
            // Remove transition on mouse enter to make tilt responsive
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.1s ease';
            });
        });
    }
    
    // Add shine effect to hover-shine elements
    function initShineEffect() {
        const shineElements = document.querySelectorAll('.hover-shine');
        
        shineElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const elementRect = element.getBoundingClientRect();
                const x = e.clientX - elementRect.left;
                
                // Calculate percentage position
                const xPercent = Math.round(x / elementRect.width * 100);
                
                // Apply gradient position based on mouse position
                element.style.setProperty('--x-position', xPercent + '%');
            });
        });
    }
    
    // Initialize parallax backgrounds
    function initParallaxBackgrounds() {
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-speed') || 0.5;
                element.style.transform = `translateY(${scrollTop * speed}px)`;
            });
        });
    }
    
    // Apply animations to footer icons
    function initFooterAnimations() {
        const socialLinks = document.querySelectorAll('.social-link');
        
        socialLinks.forEach((link, index) => {
            link.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    // Initialize animations when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Delay to ensure elements are painted
        setTimeout(() => {
            initFadeAnimations();
            initCardEffects();
            initShineEffect();
            initParallaxBackgrounds();
            initFooterAnimations();
        }, 100);
    });
    
    // Re-initialize on window resize (with debounce)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initCardEffects();
        }, 250);
    });
})(); 