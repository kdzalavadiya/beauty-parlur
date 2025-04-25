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
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) {
            console.warn('Contact form not found');
            return;
        }
        
        // Enhanced form validation
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous validation messages
            clearFormErrors(contactForm);
            
            // Validate each field
            let isValid = validateForm(contactForm);
            
            if (!isValid) {
                // Focus the first invalid field
                const firstInvalidField = contactForm.querySelector('.error');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Get form data and format it
            const formData = new FormData(contactForm);
            const formEntries = {};
            const formattedDate = new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'full',
                timeStyle: 'long'
            });

            // Format data for WhatsApp
            let whatsappMessage = `🌟 *New Bridal Inquiry*\n\n`;
            whatsappMessage += `📅 *Date:* ${formattedDate}\n\n`;
            whatsappMessage += `👤 *Name:* ${formData.get('name')}\n`;
            whatsappMessage += `📧 *Email:* ${formData.get('email')}\n`;
            whatsappMessage += `💫 *Service:* ${formData.get('service')}\n\n`;
            whatsappMessage += `💭 *Message:*\n${formData.get('message')}\n\n`;
            whatsappMessage += `📱 *Sent via Website Contact Form*`;

            // WhatsApp business number
            const whatsappNumber = '919925381942';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Format field labels for better readability
            const fieldLabels = {
                'name': 'Full Name',
                'email': 'Email Address',
                'service': 'Service Interest',
                'message': 'Message'
            };
            
            for (let [key, value] of formData.entries()) {
                formEntries[key] = value.trim();
            }
            
            // Prepare WhatsApp message with better formatting
            let message = `🌟 *New Bridal Inquiry*\n`;
            message += `📅 *Submitted On:* ${formattedDate}\n\n`;
            
            for (let [key, value] of formData.entries()) {
                const label = fieldLabels[key] || key;
                message += `*${label}:*\n${value}\n\n`;
            }
            
            // Add footer
            message += `\n📍 *Submitted via Website Contact Form*`;
            
            // Create CSV-formatted data for Excel
            const csvData = [
                formattedDate,
                ...Object.values(formEntries)
            ].join(',');

            // Reset form and button
            contactForm.reset();
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            // Show success message
            showFormSuccess('Message sent!', 'Redirecting to WhatsApp...');

            // Redirect to WhatsApp after a short delay
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 1000);
        });
        
        // Add live validation feedback
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Validate on blur (when user leaves the field)
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Validate on input (as user types) if field has an error
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
        const bookingForm = document.getElementById('booking-form');
        const openBookingBtn = document.querySelector('a[href="#booking"]');
        
        if (!bookingForm) {
            console.warn('Booking form not found');
            return;
        }
        
        // Smooth scroll to booking section when book now button is clicked
        if (openBookingBtn) {
            openBookingBtn.addEventListener('click', function(e) {
                const bookingSection = document.getElementById('booking');
                if (bookingSection) {
                    e.preventDefault();
                    bookingSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Focus the first input field after scrolling
                    setTimeout(() => {
                        const firstInput = bookingForm.querySelector('input, select, textarea');
                        if (firstInput) {
                            firstInput.focus();
                        }
                    }, 800);
                }
            });
        }
        
        // Submit booking form
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous validation messages
            clearFormErrors(bookingForm);
            
            // Validate each field
            let isValid = validateForm(bookingForm);
            
            if (!isValid) {
                // Focus the first invalid field
                const firstInvalidField = bookingForm.querySelector('.error');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
                return;
            }
            
            // Show loading state
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Reset form
                bookingForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Show success message
                showFormSuccess('Booking Request Sent!', 'We\'ll get back to you within 24 hours to confirm your appointment.');
            }, 1500);
        });
        
        // Add live validation feedback
        const inputs = bookingForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Validate on blur (when user leaves the field)
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Validate on input (as user types) if field has an error
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
     * Validate all fields in a form
     * @param {HTMLFormElement} form - The form to validate
     * @returns {boolean} - True if form is valid, false otherwise
     */
    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Skip hidden or disabled fields
            if (input.type === 'hidden' || input.disabled) {
                return;
            }
            
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    /**
     * Validate a single field
     * @param {HTMLElement} field - The field to validate
     * @returns {boolean} - True if field is valid, false otherwise
     */
    function validateField(field) {
        // Skip hidden or disabled fields
        if (field.type === 'hidden' || field.disabled) {
            return true;
        }
        
        // Get field type and value
        const fieldType = field.type;
        const fieldValue = field.value.trim();
        const fieldName = field.name;
        const isRequired = field.hasAttribute('required');
        
        // Skip validation if field is not required and is empty
        if (!isRequired && fieldValue === '') {
            removeError(field);
            return true;
        }
        
        // Check if empty but required
        if (isRequired && fieldValue === '') {
            setError(field, 'This field is required');
            return false;
        }
        
        // Validate name field (minimum 3 characters, letters and spaces only)
        if (fieldName === 'name' && fieldValue.length > 0) {
            const nameRegex = /^[A-Za-z\s]{3,}$/;
            if (!nameRegex.test(fieldValue)) {
                setError(field, 'Please enter a valid name (minimum 3 letters)');
                return false;
            }
        }

        // Validate email field
        if (fieldName === 'email' && fieldValue.length > 0) {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(fieldValue)) {
                setError(field, 'Please enter a valid email address');
                return false;
            }
        }

        // Validate phone field (Indian phone number format)
        if (fieldName === 'phone' && fieldValue.length > 0) {
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(fieldValue)) {
                setError(field, 'Please enter a valid 10-digit mobile number');
                return false;
            }
        }

        // Validate message field (minimum 10 characters)
        if (fieldName === 'message' && fieldValue.length > 0) {
            if (fieldValue.length < 10) {
                setError(field, 'Message must be at least 10 characters long');
                return false;
            }
        }
        
        // Validate based on field type
        switch (fieldType) {
            case 'email':
                // Simple email validation regex
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(fieldValue)) {
                    setError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'tel':
                // Phone validation (at least 10 digits)
                const phoneRegex = /^[\d\+\-\(\) ]{10,}$/;
                if (!phoneRegex.test(fieldValue)) {
                    setError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
                
            case 'date':
                // Check if date is in past
                if (field.hasAttribute('min')) {
                    const minDate = new Date(field.getAttribute('min'));
                    const selectedDate = new Date(fieldValue);
                    
                    if (selectedDate < minDate) {
                        setError(field, 'Please select a future date');
                        return false;
                    }
                }
                break;
                
            case 'select-one':
                // Check if a valid option is selected
                if (field.selectedIndex === 0 && isRequired) {
                    setError(field, 'Please select an option');
                    return false;
                }
                break;
                
            case 'textarea':
                // Check minimum length
                if (fieldValue.length < 10 && isRequired) {
                    setError(field, 'Please enter at least 10 characters');
                    return false;
                }
                break;
        }
        
        // If we reach here, field is valid
        removeError(field);
        return true;
    }
    
    /**
     * Set error state and message for a field
     * @param {HTMLElement} field - The field with error
     * @param {string} message - Error message to display
     */
    function setError(field, message) {
        // Remove any existing error
        removeError(field);
        
        // Add error class to field
        field.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerText = message;
        
        // Add error message after the field
        field.parentNode.appendChild(errorElement);
        
        // Add aria-invalid attribute for accessibility
        field.setAttribute('aria-invalid', 'true');
        
        // Set aria-describedby to error message
        const errorId = `error-${field.name || field.id}`;
        errorElement.id = errorId;
        field.setAttribute('aria-describedby', errorId);
    }
    
    /**
     * Remove error state and message from a field
     * @param {HTMLElement} field - The field to remove error from
     */
    function removeError(field) {
        // Remove error class
        field.classList.remove('error');
        
        // Remove error message if exists
        const parent = field.parentNode;
        const errorElement = parent.querySelector('.error-message');
        if (errorElement) {
            parent.removeChild(errorElement);
        }
        
        // Remove aria attributes
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    }
    
    /**
     * Clear all error messages from a form
     * @param {HTMLFormElement} form - The form to clear errors from
     */
    function clearFormErrors(form) {
        // Remove all error messages
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(message => {
            message.parentNode.removeChild(message);
        });
        
        // Remove error class from all fields
        const errorFields = form.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
        });
    }
    
    /**
     * Show success message for form submission
     * @param {string} title - Success message title
     * @param {string} message - Success message text
     */
    function showFormSuccess(title, message) {
        const successAlert = document.createElement('div');
        successAlert.className = 'form-success-alert';
        successAlert.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h4>${title}</h4>
            <p>${message}</p>
            <div class="success-actions">
                <button class="copy-data-btn" onclick="copyFormData()">
                    <i class="fas fa-copy"></i> Copy for Excel
                </button>
            </div>
        `;
        
        document.body.appendChild(successAlert);
        
        // Store form data in localStorage for copying
        if (window.formDataForExcel) {
            localStorage.setItem('lastFormData', window.formDataForExcel);
        }
        
        // Remove the alert after 8 seconds
        setTimeout(() => {
            successAlert.remove();
            localStorage.removeItem('lastFormData');
        }, 8000);
    }

    function copyFormData() {
        const data = localStorage.getItem('lastFormData');
        if (data) {
            navigator.clipboard.writeText(data).then(() => {
                alert('Data copied! You can now paste it into Excel.');
            }).catch(err => {
                console.error('Failed to copy:', err);
                alert('Failed to copy data. Please try again.');
            });
        }
    }
})();