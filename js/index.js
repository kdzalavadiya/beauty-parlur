/**
 * Browser-only functionality for New Real Bridal Studio website
 * This script handles initialization of features when running directly in browser
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded in browser mode');
    
    // Remove loading screen after 1 second
    setTimeout(function() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 300);
        }
    }, 1000);

    // Initialize any components that might need server interaction
    initFormHandlers();
    
    // Initialize product recommender immediately to prevent visibility issues
    initProductRecommender();
    
    // Hide AI dashboard
    const dashboard = document.getElementById('ai-dashboard');
    if (dashboard) {
        dashboard.classList.add('hidden');
        dashboard.style.display = 'none';
        dashboard.style.visibility = 'hidden';
    }
});

/**
 * Initialize form handlers with browser-only functionality
 */
function initFormHandlers() {
    // Override form submissions to show success messages instead of submitting to server
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted in browser mode - no server required');
            
            // Show success message
            const successEl = document.createElement('div');
            successEl.className = 'form-success';
            successEl.innerHTML = `
                <div class="form-success-content">
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank you!</h3>
                    <p>Your submission has been received. In a real environment, this would be sent to our server.</p>
                    <button class="btn btn-primary close-success">Close</button>
                </div>
            `;
            
            document.body.appendChild(successEl);
            
            // Add close button functionality
            const closeBtn = successEl.querySelector('.close-success');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    successEl.remove();
                });
            }
            
            // Reset form
            form.reset();
        });
    });
}

/**
 * Initialize the product recommender component
 * This ensures it works correctly when loaded directly in browser mode
 */
function initProductRecommender() {
    // Ensure the recommender card is visible
    const recommenderCard = document.querySelector('.recommender-card');
    if (recommenderCard) {
        recommenderCard.classList.add('ai-fade-in');
    }

    // Initialize skin type select changes
    const skinTypeSelect = document.getElementById('skin-type');
    if (skinTypeSelect) {
        skinTypeSelect.addEventListener('change', function() {
            updateRecommenderState();
        });
    }

    // Initialize skin tone select and swatches
    const skinToneSelect = document.getElementById('skin-tone');
    const toneSwatches = document.querySelectorAll('.tone-swatch');
    
    if (skinToneSelect) {
        skinToneSelect.addEventListener('change', function() {
            updateRecommenderState();
            
            // Update swatch selection
            const selectedTone = this.value;
            toneSwatches.forEach(swatch => {
                swatch.classList.remove('selected');
                if (swatch.dataset.tone === selectedTone) {
                    swatch.classList.add('selected');
                    swatch.setAttribute('aria-checked', 'true');
                } else {
                    swatch.setAttribute('aria-checked', 'false');
                }
            });
        });
    }
    
    // Add click handlers to tone swatches
    toneSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            const tone = this.dataset.tone;
            if (skinToneSelect) {
                skinToneSelect.value = tone;
                
                // Trigger change event
                const event = new Event('change');
                skinToneSelect.dispatchEvent(event);
            }
        });
    });

    // Initialize preference cards
    const preferenceCards = document.querySelectorAll('.preference-card');
    const hiddenPreferenceSelect = document.getElementById('hidden-makeup-preference');
    
    preferenceCards.forEach(card => {
        card.addEventListener('click', function() {
            const preference = this.dataset.preference;
            
            // Update all cards
            preferenceCards.forEach(c => {
                c.classList.remove('selected');
                c.setAttribute('aria-checked', 'false');
            });
            
            // Select this card
            this.classList.add('selected');
            this.setAttribute('aria-checked', 'true');
            
            // Update hidden select
            if (hiddenPreferenceSelect) {
                hiddenPreferenceSelect.value = preference;
            }
            
            updateRecommenderState();
        });
    });

    // Initialize concern tags
    const concernTags = document.querySelectorAll('.concern-tag');
    const skinConcerns = document.getElementById('skin-concerns');
    
    concernTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const concern = this.dataset.concern;
            
            // Toggle selection
            this.classList.toggle('selected');
            const isSelected = this.classList.contains('selected');
            this.setAttribute('aria-pressed', isSelected.toString());
            
            // Update textarea
            if (skinConcerns) {
                if (isSelected) {
                    let currentText = skinConcerns.value;
                    if (currentText && !currentText.endsWith(' ')) {
                        currentText += ' ';
                    }
                    
                    if (!currentText.includes(concern)) {
                        skinConcerns.value = currentText + concern + ', ';
                    }
                } else {
                    // Remove from textarea
                    let currentText = skinConcerns.value;
                    skinConcerns.value = currentText.replace(`${concern}, `, '').replace(`${concern},`, '');
                }
            }
        });
    });

    // Handle form submission
    const recommenderForm = document.querySelector('.recommender-form');
    const submitButton = document.querySelector('.recommender-button');
    const resultsContainer = document.querySelector('.recommender-results');
    
    if (recommenderForm) {
        recommenderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (submitButton && !submitButton.disabled) {
                // Show loading state
                submitButton.innerHTML = '<i class="fas fa-spinner"></i> Processing...';
                submitButton.classList.add('loading');
                
                // Simulate processing
                setTimeout(() => {
                    // Show results
                    if (resultsContainer) {
                        resultsContainer.style.display = 'block';
                        
                        // Animate in products
                        const productItems = document.querySelectorAll('.product-item');
                        productItems.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add('ai-fade-in');
                            }, 100 + (index * 100));
                        });
                        
                        // Scroll to results
                        resultsContainer.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                    
                    // Reset button
                    submitButton.innerHTML = '<i class="fas fa-magic"></i> Generate Recommendations';
                    submitButton.classList.remove('loading');
                }, 1500);
            }
        });
    }
    
    // Function to validate and update button state
    function updateRecommenderState() {
        if (!submitButton) return;
        
        const skinTypeValue = skinTypeSelect ? skinTypeSelect.value : '';
        const skinToneValue = skinToneSelect ? skinToneSelect.value : '';
        const hasPreference = document.querySelector('.preference-card.selected') !== null;
        
        // Enable button if required fields are filled
        if (skinTypeValue && skinToneValue && hasPreference) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
        
        // Update step indicators
        const step1 = document.getElementById('step-1');
        const step2 = document.getElementById('step-2');
        
        if (step1) {
            if (skinTypeValue && skinToneValue) {
                step1.classList.add('completed');
                step2.classList.add('active');
            } else {
                step1.classList.remove('completed');
                step2.classList.remove('active');
            }
        }
        
        if (step2) {
            if (hasPreference) {
                step2.classList.add('completed');
            } else {
                step2.classList.remove('completed');
            }
        }
    }
}