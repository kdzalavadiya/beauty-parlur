/**
 * Optimized Particles.js Configuration
 * Reduced particle count and simplified animation for better performance
 */
document.addEventListener('DOMContentLoaded', function() {
    if (window.particlesJS) {
        try {
            particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 30, // Reduced from 80
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#f178b6"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        }
                    },
                    "opacity": {
                        "value": 0.3,
                        "random": false,
                        "anim": {
                            "enable": false
                        }
                    },
                    "size": {
                        "value": 3,
                        "random": true,
                        "anim": {
                            "enable": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#f178b6",
                        "opacity": 0.2,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 1, // Reduced from 3
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": false // Disabled for better performance
                        },
                        "onclick": {
                            "enable": false // Disabled for better performance
                        },
                        "resize": true
                    }
                },
                "retina_detect": false // Disabled for better performance
            });
        } catch (e) {
            console.warn('Error initializing particles.js:', e);
        }
    }
}); 