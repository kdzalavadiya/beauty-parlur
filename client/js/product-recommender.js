/**
 * Smart Product Recommender
 * JavaScript functionality for the product recommender section
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const recommenderForm = document.querySelector('.recommender-form');
    const skinTypeSelect = document.getElementById('skin-tone');
    const makeupPreferenceSelect = document.getElementById('hidden-makeup-preference');
    const toneSwatches = document.querySelectorAll('.tone-swatch');
    const preferenceCards = document.querySelectorAll('.preference-card');
    const concernTags = document.querySelectorAll('.concern-tag');
    const submitButton = document.querySelector('.recommender-button');
    const resultsSection = document.querySelector('.recommender-results');
    const resetButton = document.querySelector('.action-reset');
    const srAnnouncer = document.getElementById('sr-announcements');
    
    // Helper function to announce screen reader messages
    function announceMessage(message) {
        if (srAnnouncer) {
            srAnnouncer.textContent = message;
        }
    }

    // Form validation
    function validateForm() {
        const skinType = document.getElementById('skin-type').value;
        const skinTone = skinTypeSelect.value;
        const makeupPreference = makeupPreferenceSelect.value;
        
        if (skinType && skinTone && makeupPreference) {
            submitButton.removeAttribute('disabled');
            return true;
        } else {
            submitButton.setAttribute('disabled', 'disabled');
            return false;
        }
    }
    
    // Initialize the form
    function initForm() {
        // Set up skin tone swatches
        toneSwatches.forEach(swatch => {
            swatch.addEventListener('click', function() {
                const tone = this.getAttribute('data-tone');
                skinTypeSelect.value = tone;
                
                // Update UI
                toneSwatches.forEach(s => {
                    s.setAttribute('aria-checked', 'false');
                });
                this.setAttribute('aria-checked', 'true');
                
                announceMessage(`${tone} skin tone selected`);
                validateForm();
            });
            
            // Keyboard accessibility
            swatch.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        
        // Set up preference cards
        preferenceCards.forEach(card => {
            card.addEventListener('click', function() {
                const preference = this.getAttribute('data-preference');
                makeupPreferenceSelect.value = preference;
                
                // Update UI
                preferenceCards.forEach(c => {
                    c.setAttribute('aria-checked', 'false');
                });
                this.setAttribute('aria-checked', 'true');
                
                announceMessage(`${preference} makeup preference selected`);
                validateForm();
            });
            
            // Keyboard accessibility
            card.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        
        // Set up concern tags
        concernTags.forEach(tag => {
            tag.addEventListener('click', function() {
                const isPressed = this.getAttribute('aria-pressed') === 'true';
                const concern = this.getAttribute('data-concern');
                const textarea = document.getElementById('skin-concerns');
                
                this.setAttribute('aria-pressed', !isPressed);
                
                // Update textarea
                if (!isPressed) {
                    if (textarea.value) {
                        textarea.value += ', ' + concern;
                    } else {
                        textarea.value = concern;
                    }
                    announceMessage(`${concern} added to concerns`);
                } else {
                    // Remove the concern from textarea
                    let concerns = textarea.value.split(', ');
                    concerns = concerns.filter(c => c !== concern);
                    textarea.value = concerns.join(', ');
                    announceMessage(`${concern} removed from concerns`);
                }
            });
            
            // Keyboard accessibility
            tag.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        
        // Form submission
        recommenderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Display loading state
            submitButton.setAttribute('disabled', 'disabled');
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            
            // Simulate API call (remove in production and replace with actual API call)
            setTimeout(function() {
                // Show results
                resultsSection.style.display = 'block';
                
                // Scroll to results
                resultsSection.scrollIntoView({ behavior: 'smooth' });
                
                // Reset button state
                submitButton.innerHTML = '<i class="fas fa-magic"></i> Generate Recommendations';
                
                announceMessage('Product recommendations have been generated');
            }, 1500);
        });
        
        // Reset functionality
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                // Hide results
                resultsSection.style.display = 'none';
                
                // Reset form
                recommenderForm.reset();
                
                // Reset UI state
                toneSwatches.forEach(s => s.setAttribute('aria-checked', 'false'));
                preferenceCards.forEach(c => c.setAttribute('aria-checked', 'false'));
                concernTags.forEach(t => t.setAttribute('aria-pressed', 'false'));
                
                // Disable submit button
                submitButton.setAttribute('disabled', 'disabled');
                
                // Scroll back to form
                document.getElementById('product-recommender').scrollIntoView({ behavior: 'smooth' });
                
                announceMessage('Form has been reset');
            });
        }
        
        // Dropdowns validation
        document.getElementById('skin-type').addEventListener('change', validateForm);
        skinTypeSelect.addEventListener('change', function() {
            // Update the tone swatches UI when dropdown changes
            const selectedTone = this.value;
            if (selectedTone) {
                toneSwatches.forEach(swatch => {
                    if (swatch.getAttribute('data-tone') === selectedTone) {
                        swatch.setAttribute('aria-checked', 'true');
                    } else {
                        swatch.setAttribute('aria-checked', 'false');
                    }
                });
            }
            validateForm();
        });
        
        // Initial validation
        validateForm();
    }
    
    // Initialize when DOM is ready
    initForm();
    
    // Email recommendation functionality
    const emailButton = document.querySelector('.action-email');
    if (emailButton) {
        emailButton.addEventListener('click', function() {
            // Get form data
            const skinType = document.getElementById('skin-type').value;
            const skinTone = skinTypeSelect.value;
            
            // Open email client with pre-filled info
            const subject = 'My Product Recommendations from New Real Bridal';
            const body = `Here are my personalized product recommendations based on:\n\n- Skin Type: ${skinType}\n- Skin Tone: ${skinTone}`;
            
            window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }
    
    // Save recommendations functionality (just a placeholder)
    const saveButton = document.querySelector('.action-save');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            alert('Recommendations saved to your account!');
        });
    }
}); 