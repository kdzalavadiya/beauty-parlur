/**
 * SVG Icons for AI Features
 * This script injects SVG icons directly into the HTML for better performance and styling options
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create SVG sprite at the top of the body
    const svgSprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgSprite.setAttribute('style', 'display: none');
    svgSprite.setAttribute('aria-hidden', 'true');
    svgSprite.id = 'svg-sprite';
    
    // Define SVG icons as symbol elements with unique IDs
    svgSprite.innerHTML = `
        <!-- AI Assistant Icon -->
        <symbol id="icon-ai-assistant" viewBox="0 0 24 24">
            <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8
            S16.41,20,12,20z"/>
            <path d="M12,6c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6S15.31,6,12,6z M12,16c-2.21,0-4-1.79-4-4s1.79-4,4-4s4,1.79,4,4
            S14.21,16,12,16z"/>
            <circle cx="12" cy="12" r="2"/>
            <path d="M13,3.5v2.05c2.01,0.2,3.84,1.27,5.06,2.84l1.51-1.28C17.73,4.74,15.49,3.7,13,3.5z"/>
            <path d="M3.5,12c0,4.7,3.8,8.5,8.5,8.5c1.78,0,3.43-0.55,4.8-1.48l-1.51-1.28c-0.99,0.68-2.09,1.09-3.29,1.19v2.05
            c-3.58-0.22-6.55-2.62-7.5-5.98h2.01C8.06,17.74,9.89,19,12,19c2.76,0,5-2.24,5-5s-2.24-5-5-5c-2.11,0-3.94,1.26-4.99,3H5
            C5.96,8.62,8.92,6.22,12.5,6V8.05c1.2,0.1,2.31,0.51,3.29,1.19l1.51-1.28C15.93,7.05,14.28,6.5,12.5,6.5C7.8,6.5,4,10.3,4,15"/>
        </symbol>

        <!-- AI Brain Icon -->
        <symbol id="icon-ai-brain" viewBox="0 0 24 24">
            <path d="M12,1C5.9,1,1,5.9,1,12s4.9,11,11,11s11-4.9,11-11S18.1,1,12,1z M12,21c-5,0-9-4-9-9s4-9,9-9s9,4,9,9S17,21,12,21z"/>
            <path d="M17.5,12c0-3.1-2.4-5.5-5.5-5.5S6.5,8.9,6.5,12H9c0-1.7,1.3-3,3-3s3,1.3,3,3h2.5z"/>
            <path d="M9.8,14.5c0.4,0.4,1,0.7,1.7,0.7h1c0.7,0,1.3-0.3,1.7-0.7l1.8,1.8c-0.9,0.9-2.2,1.5-3.5,1.5h-1c-1.4,0-2.6-0.6-3.5-1.5
            L9.8,14.5z"/>
            <path d="M9,12c0-1.7,1.3-3,3-3v2.5c-0.3,0-0.5,0.2-0.5,0.5H9z"/>
            <path d="M15,12c0,0.3-0.2,0.5-0.5,0.5H12V9C13.7,9,15,10.3,15,12z"/>
            <path d="M12,12.5h2.5c0,0.7-0.6,1.3-1.3,1.3h-1c-0.7,0-1.3-0.6-1.3-1.3H12z"/>
        </symbol>

        <!-- AI Analysis Icon -->
        <symbol id="icon-ai-analyze" viewBox="0 0 24 24">
            <path d="M10,2C4.48,2,0,6.48,0,12s4.48,10,10,10c1.85,0,3.6-0.5,5.1-1.38l-1.46-1.46C12.66,19.68,11.35,20,10,20
            c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8c0,0.35-0.03,0.69-0.08,1.03l1.66,1.66C19.85,13.19,20,12.11,20,11
            C20,5.48,15.52,1,10,1z"/>
            <path d="M10,6c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6S13.31,6,10,6z M10,16c-2.21,0-4-1.79-4-4s1.79-4,4-4s4,1.79,4,4
            S12.21,16,10,16z"/>
            <circle cx="10" cy="12" r="2"/>
            <path d="M19,14.87l-3.59-3.59c-0.39-0.39-1.02-0.39-1.41,0l-0.37,0.37l5,5l0.37-0.37C19.39,15.89,19.39,15.26,19,14.87z"/>
            <path d="M17.5,19h-2c-0.28,0-0.5-0.22-0.5-0.5v-2c0-0.28,0.22-0.5,0.5-0.5h2c0.28,0,0.5,0.22,0.5,0.5v2
            C18,18.78,17.78,19,17.5,19z"/>
        </symbol>

        <!-- Upload Icon -->
        <symbol id="icon-upload" viewBox="0 0 24 24">
            <path d="M19.35,10.04C18.67,6.59,15.64,4,12,4C9.11,4,6.6,5.64,5.35,8.04C2.34,8.36,0,10.91,0,14c0,3.31,2.69,6,6,6h13
            c2.76,0,5-2.24,5-5C24,12.36,21.95,10.22,19.35,10.04z M19,18H6c-2.21,0-4-1.79-4-4c0-2.05,1.53-3.76,3.56-3.97l1.07-0.11
            l0.5-0.95C8.08,7.14,9.94,6,12,6c2.62,0,4.88,1.86,5.39,4.43l0.3,1.5l1.53,0.11c1.56,0.1,2.78,1.41,2.78,2.96
            C22,16.21,20.21,18,19,18z"/>
            <polygon points="8,13 10.55,13 12,11.5 13.45,13 16,13 12,9 "/>
            <rect x="11" y="13" width="2" height="5"/>
        </symbol>

        <!-- Processing Icon -->
        <symbol id="icon-processing" viewBox="0 0 24 24">
            <path d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M12,20c-4.42,0-8-3.58-8-8
            s3.58-8,8-8s8,3.58,8,8S16.42,20,12,20z"/>
            <path d="M12,6v6l4,2" style="stroke-width:2; stroke: currentColor; fill: none;"/>
        </symbol>

        <!-- Results Icon -->
        <symbol id="icon-results" viewBox="0 0 24 24">
            <path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M5,19V5h14v14H5z"/>
            <rect x="7" y="12" width="2" height="5"/>
            <rect x="11" y="7" width="2" height="10"/>
            <rect x="15" y="9" width="2" height="8"/>
            <path d="M7,7h2v3H7V7z M11,7h2" style="fill:none;stroke:currentColor;stroke-width:2"/>
        </symbol>

        <!-- Microphone Icon -->
        <symbol id="icon-microphone" viewBox="0 0 24 24">
            <path d="M12,14c1.66,0,3-1.34,3-3V5c0-1.66-1.34-3-3-3S9,3.34,9,5v6C9,12.66,10.34,14,12,14z"/>
            <path d="M17,11c0,2.76-2.24,5-5,5s-5-2.24-5-5H5c0,3.53,2.61,6.43,6,6.92V21h2v-3.08c3.39-0.49,6-3.39,6-6.92H17z"/>
        </symbol>

        <!-- Send Message Icon -->
        <symbol id="icon-send" viewBox="0 0 24 24">
            <path d="M2.01,21L23,12L2.01,3L2,10l15,2l-15,2L2.01,21z"/>
        </symbol>

        <!-- Close Icon -->
        <symbol id="icon-close" viewBox="0 0 24 24">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41z"/>
        </symbol>

        <!-- Product Recommendation Icon -->
        <symbol id="icon-product" viewBox="0 0 24 24">
            <path d="M19,4h-4.18C14.4,2.84,13.3,2,12,2S9.6,2.84,9.18,4H5C3.9,4,3,4.9,3,6v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6
            C21,4.9,20.1,4,19,4z M12,4c0.55,0,1,0.45,1,1s-0.45,1-1,1s-1-0.45-1-1S11.45,4,12,4z M19,20H5V6h2v3h10V6h2V20z"/>
            <rect x="7" y="12" width="10" height="2"/>
            <rect x="7" y="16" width="6" height="2"/>
        </symbol>

        <!-- Magic Wand Icon -->
        <symbol id="icon-magic" viewBox="0 0 24 24">
            <path d="M7.5,5.6L5,7l1.4-2.5L5,2L7.5,3.4L10,2L8.6,4.5L10,7L7.5,5.6z"/>
            <path d="M14,2l1.4,2.5L18,3l-1.4,2.5L18,8l-2.5-1.4L13,8l1.4-2.5L13,3L14,2z"/>
            <path d="M20,11l-1.4,2.5L20,16l-2.5-1.4L15,16l1.4-2.5L15,11l2.5,1.4L20,11z"/>
            <path d="M11,9l-9,9l3,3l9-9L11,9z M3.5,19.5l-1-1L9,12l1,1L3.5,19.5z"/>
        </symbol>

        <!-- Theme Icon -->
        <symbol id="icon-theme" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm3-4c.83 0 1.5-.67 1.5-1.5S10.83 4 10 4s-1.5.67-1.5 1.5S9.17 7 10 7zm5 0c.83 0 1.5-.67 1.5-1.5S15.83 4 15 4s-1.5.67-1.5 1.5S14.17 7 15 7zm3 4c.83 0 1.5-.67 1.5-1.5S18.83 8 18 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5z"/>
        </symbol>

        <!-- Contrast Icon -->
        <symbol id="icon-contrast" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18V4c4.41 0 8 3.59 8 8s-3.59 8-8 8z"/>
        </symbol>

        <!-- Motion Icon -->
        <symbol id="icon-motion" viewBox="0 0 24 24">
            <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>
        </symbol>

        <!-- Accessibility Icon -->
        <symbol id="icon-accessibility" viewBox="0 0 24 24">
            <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
        </symbol>
    `;

    // Add sprite to document
    document.body.prepend(svgSprite);

    // Function to replace icons
    function replaceIcons() {
        // Replace AI Consultant section icons
        replaceIconsInSection('.ai-consultant-section');
        
        // Replace Style Analyzer section icons
        replaceIconsInSection('.style-analyzer');
        
        // Replace Product Recommender section icons
        replaceIconsInSection('.product-recommender');
    }

    // Replace icons in a specific section
    function replaceIconsInSection(sectionSelector) {
        const section = document.querySelector(sectionSelector);
        if (!section) return;

        // Map of Font Awesome classes to SVG icon IDs
        const iconMap = {
            'fa-robot': 'icon-ai-assistant',
            'fa-brain': 'icon-ai-brain',
            'fa-magic': 'icon-magic',
            'fa-upload': 'icon-upload',
            'fa-cogs': 'icon-processing',
            'fa-sparkles': 'icon-results',
            'fa-microphone': 'icon-microphone',
            'fa-paper-plane': 'icon-send',
            'fa-times': 'icon-close',
            'fa-cloud-upload-alt': 'icon-upload',
            'fa-download': 'icon-download',
            'fa-redo': 'icon-redo',
            'fa-box': 'icon-product',
            'fa-adjust': 'icon-contrast',
            'fa-sun': 'icon-theme',
            'fa-moon': 'icon-theme',
            'fa-running': 'icon-motion',
            'fa-universal-access': 'icon-accessibility'
        };

        // Find all Font Awesome icons in the section
        const faIcons = section.querySelectorAll('.fas, .far, .fab');
        
        faIcons.forEach(icon => {
            // Get the Font Awesome class that determines the icon
            const faClass = Array.from(icon.classList).find(cls => cls.startsWith('fa-'));
            if (!faClass || !iconMap[faClass]) return;

            // Create SVG element
            const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgEl.classList.add('ai-svg-icon');
            
            // Copy classes from the original icon
            icon.classList.forEach(cls => {
                if (!cls.startsWith('fa')) {
                    svgEl.classList.add(cls);
                }
            });
            
            // Add accessibility attributes
            if (icon.hasAttribute('aria-hidden')) {
                svgEl.setAttribute('aria-hidden', icon.getAttribute('aria-hidden'));
            }
            
            // Create use element
            const useEl = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${iconMap[faClass]}`);
            svgEl.appendChild(useEl);
            
            // Replace the original icon
            icon.parentNode.replaceChild(svgEl, icon);
        });
    }

    // Add theme controls styling
    if (!document.getElementById('ai-theme-controls-style')) {
        const style = document.createElement('style');
        style.id = 'ai-theme-controls-style';
        style.textContent = `
            .ai-theme-controls {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                gap: 10px;
                z-index: 100;
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(10px);
                padding: 10px;
                border-radius: 50px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            
            .ai-theme-controls button {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: none;
                background: white;
                color: #333;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                transition: all 0.3s ease;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            
            .ai-theme-controls button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            }
            
            .ai-theme-controls button:focus-visible {
                outline: 2px solid #f178b6;
                outline-offset: 2px;
            }
            
            .ai-theme-controls .ai-svg-icon {
                width: 24px;
                height: 24px;
            }
            
            .ai-theme-controls .ai-theme-label,
            .ai-theme-controls .ai-motion-label {
                position: absolute;
                bottom: -25px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 12px;
                white-space: nowrap;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 2px 8px;
                border-radius: 10px;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }
            
            .ai-theme-controls button:hover .ai-theme-label,
            .ai-theme-controls button:hover .ai-motion-label {
                opacity: 1;
            }
            
            /* Dark mode styles */
            .ai-dark-theme .ai-theme-controls {
                background: rgba(40, 40, 40, 0.8);
            }
            
            .ai-dark-theme .ai-theme-controls button {
                background: #444;
                color: #f0f0f0;
            }
            
            /* High contrast mode styles */
            .ai-high-contrast .ai-theme-controls {
                background: black;
                backdrop-filter: none;
            }
            
            .ai-high-contrast .ai-theme-controls button {
                background: black;
                color: white;
                border: 2px solid white;
            }
            
            @media (max-width: 768px) {
                .ai-theme-controls {
                    bottom: 10px;
                    right: 10px;
                    padding: 8px;
                }
                
                .ai-theme-controls button {
                    width: 36px;
                    height: 36px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Run the replacement
    replaceIcons();

    // If dynamic content is loaded later, you can call replaceIcons() again
    document.addEventListener('contentLoaded', replaceIcons);
}); 