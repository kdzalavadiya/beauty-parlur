/**
 * Form handlers for contact and booking forms
 * With enhanced validation and accessibility
 */

(function() {
    // Initialize forms when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initContactForm();
        initBookingForm();
        initPricingCalculator();
    });

    /**
     * Initialize Contact Form
     */
    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;
        
        // Enhanced form validation
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check form validity
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }
            
            // Get form data
            const formData = new FormData(contactForm);
            const formEntries = {};
            
            for (let [key, value] of formData.entries()) {
                formEntries[key] = value;
            }
            
            // Normally would send to server here
            // For demo, we'll show success message
            showFormSuccess('Thank you for your message!', 'We will get back to you shortly.');
            
            // Reset form
            contactForm.reset();
        });
        
        // Add live validation feedback
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }

    /**
     * Initialize Booking Form with enhanced features
     */
    function initBookingForm() {
        const bookingFormContainer = document.getElementById('booking-form-container');
        const bookingForm = document.getElementById('booking-form');
        const openBookingBtn = document.getElementById('open-booking-form');
        const closeBookingBtn = document.getElementById('close-booking-form');
        const cancelBookingBtn = document.getElementById('cancel-booking-form');
        
        if (!bookingForm || !bookingFormContainer) return;
        
        // Open booking form
        if (openBookingBtn) {
            openBookingBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openBookingForm();
            });
        }
        
        // Close booking form
        function closeBookingFormFunc() {
            bookingFormContainer.classList.remove('active');
            
            setTimeout(() => {
                bookingFormContainer.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
        
        if (closeBookingBtn) {
            closeBookingBtn.addEventListener('click', closeBookingFormFunc);
        }
        
        if (cancelBookingBtn) {
            cancelBookingBtn.addEventListener('click', closeBookingFormFunc);
        }
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && bookingFormContainer.style.display === 'flex') {
                closeBookingFormFunc();
            }
        });
        
        // Close on click outside
        bookingFormContainer.addEventListener('click', function(e) {
            if (e.target === bookingFormContainer) {
                closeBookingFormFunc();
            }
        });
        
        // Prevent form close when clicking inside the form
        bookingFormContainer.querySelector('.form-success-content').addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Submit booking form
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Reset form
                bookingForm.reset();
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success-message';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <h4>Booking Request Sent!</h4>
                    <p>We'll get back to you within 24 hours to confirm your appointment.</p>
                `;
                
                const formContent = bookingForm.parentElement;
                formContent.innerHTML = '';
                formContent.appendChild(successMessage);

                // Close form after 3 seconds
                setTimeout(closeBookingFormFunc, 3000);
            }, 1500);
        });
        
        // Add live validation feedback
        const inputs = bookingForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
        
        // Add min date to date input
        const dateInput = document.getElementById('b-date');
        if (dateInput) {
            const today = new Date();
            const yyyy = today.getFullYear();
            let mm = today.getMonth() + 1;
            let dd = today.getDate();
            
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
            
            const formattedToday = yyyy + '-' + mm + '-' + dd;
            dateInput.setAttribute('min', formattedToday);
        }
    }

    /**
     * Initialize Pricing Calculator
     */
    function initPricingCalculator() {
        const calculator = document.getElementById('pricing-calculator');
        if (!calculator) return;
        
        const serviceSelect = document.getElementById('calc-service');
        const eventSelect = document.getElementById('calc-event');
        const addons = document.querySelectorAll('.addon-option input');
        const totalPrice = document.querySelector('.calculator-total-price');
        
        // Base prices
        const basePrices = {
            'Bridal Makeup': 15000,
            'Mehndi Design': 8000,
            'Saree/Lehenga Draping': 5000,
            'Hair Styling': 7000,
            'Jewelry Styling': 3000,
            'Complete Bridal Package': 35000,
            'Family Package': 25000
        };
        
        // Event multipliers
        const eventMultipliers = {
            'Engagement': 0.7,
            'Haldi': 0.6,
            'Mehndi': 0.8,
            'Sangeet': 0.8,
            'Wedding': 1.0,
            'Reception': 0.9,
            'Full Wedding': 1.5
        };
        
        // Addon prices
        const addonPrices = {
            'trial-session': 3000,
            'airbrush-makeup': 2000,
            'extra-person': 5000,
            'touch-up-kit': 1500,
            'photoshoot': 8000
        };
        
        // Calculate price function
        function calculatePrice() {
            const service = serviceSelect.value;
            const event = eventSelect.value;
            
            // Calculate base price
            let price = basePrices[service] * eventMultipliers[event];
            
            // Add addons
            addons.forEach(addon => {
                if (addon.checked) {
                    price += addonPrices[addon.value];
                }
            });
            
            // Update display
            totalPrice.textContent = '₹' + Math.round(price).toLocaleString();
        }
        
        // Add event listeners
        serviceSelect.addEventListener('change', calculatePrice);
        eventSelect.addEventListener('change', calculatePrice);
        
        addons.forEach(addon => {
            addon.addEventListener('change', calculatePrice);
        });
        
        // Calculate initial price
        calculatePrice();
    }

    /**
     * Enhanced Form Validation
     */
    function validateForm(form) {
        const formElements = form.elements;
        let isValid = true;
        let firstError = null;
        
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            
            // Skip buttons and non-required elements
            if (element.type === 'submit' || element.type === 'button' || !element.hasAttribute('required')) {
                continue;
            }
            
            // Validate the field
            const fieldValid = validateField(element);
            
            // Track first error for focus
            if (!fieldValid && !firstError) {
                firstError = element;
            }
            
            isValid = isValid && fieldValid;
        }
        
        // Focus first error
        if (firstError) {
            firstError.focus();
        }
        
        return isValid;
    }

    /**
     * Validate individual field with specific error messages
     */
    function validateField(field) {
        // Remove existing error messages
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        field.classList.remove('error');
        
        let isValid = true;
        let errorMessage = '';
        
        // Skip non-required empty fields
        if (!field.hasAttribute('required') && field.value.trim() === '') {
            return true;
        }
        
        // Validate based on field type
        switch (field.type) {
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (field.value.trim() === '') {
                    isValid = false;
                    errorMessage = 'Email address is required';
                } else if (!emailPattern.test(field.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'tel':
                const phonePattern = /^\+?[0-9\s\-()]{8,20}$/;
                if (field.value.trim() === '') {
                    isValid = false;
                    errorMessage = 'Phone number is required';
                } else if (!phonePattern.test(field.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
                
            case 'date':
                if (field.value === '') {
                    isValid = false;
                    errorMessage = 'Please select a date';
                } else {
                    const selectedDate = new Date(field.value);
                    const currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    
                    if (selectedDate < currentDate) {
                        isValid = false;
                        errorMessage = 'Please select a future date';
                    }
                }
                break;
                
            case 'select-one':
                if (field.value === '') {
                    isValid = false;
                    errorMessage = 'Please select an option';
                }
                break;
                
            default:
                if (field.value.trim() === '') {
                    isValid = false;
                    errorMessage = field.name.charAt(0).toUpperCase() + field.name.slice(1) + ' is required';
                }
        }
        
        // Add error class and message if invalid
        if (!isValid) {
            field.classList.add('error');
            
            // Create error message element
            const errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            errorEl.textContent = errorMessage;
            field.parentNode.appendChild(errorEl);
            
            // Announce error for screen readers
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', field.id + '-error');
            errorEl.id = field.id + '-error';
            errorEl.setAttribute('role', 'alert');
        } else {
            field.setAttribute('aria-invalid', 'false');
            field.removeAttribute('aria-describedby');
        }
        
        return isValid;
    }

    /**
     * Clear all form errors
     */
    function clearFormErrors(form) {
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        const errorFields = form.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
            field.removeAttribute('aria-describedby');
        });
    }

    /**
     * Show success message
     */
    function showFormSuccess(title, message) {
        // Create form success message
        const successContainer = document.createElement('div');
        successContainer.className = 'form-success';
        
        const successContent = document.createElement('div');
        successContent.className = 'form-success-content';
        
        // Add success icon
        const icon = document.createElement('i');
        icon.className = 'fas fa-check-circle';
        
        // Add title and message
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'close-success';
        closeButton.textContent = 'Close';
        
        // Assemble elements
        successContent.appendChild(icon);
        successContent.appendChild(titleElement);
        successContent.appendChild(messageElement);
        successContent.appendChild(closeButton);
        successContainer.appendChild(successContent);
        
        // Add to page
        document.body.appendChild(successContainer);
        
        // Force reflow to enable animation
        successContainer.offsetHeight;
        
        // Animate in
        successContainer.style.opacity = '1';
        
        // Close on button click
        closeButton.addEventListener('click', function() {
            successContainer.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(successContainer);
            }, 300);
        });
        
        // Also close on background click
        successContainer.addEventListener('click', function(e) {
            if (e.target === successContainer) {
                successContainer.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(successContainer);
                }, 300);
            }
        });
    }
})(); 