/**
 * Booking form handling and animations
 */
(function() {
    console.log('Booking.js script loaded');
    
    // Check for elements
    const openBookingBtn = document.getElementById('open-booking-form');
    const closeBookingBtn = document.getElementById('close-booking-form');
    const cancelBookingBtn = document.getElementById('cancel-booking-form');
    const bookingFormContainer = document.getElementById('booking-form-container');
    const bookingOverlay = document.getElementById('booking-overlay');
    const bookingForm = document.getElementById('booking-form');
    
    // Log element status for debugging
    console.log('Open button found:', !!openBookingBtn);
    console.log('Close button found:', !!closeBookingBtn);
    console.log('Cancel button found:', !!cancelBookingBtn);
    console.log('Form container found:', !!bookingFormContainer);
    console.log('Form overlay found:', !!bookingOverlay);
    console.log('Booking form found:', !!bookingForm);
    
    if (!openBookingBtn || !bookingFormContainer) {
        console.error('Required booking elements not found');
        return;
    }
    
    // Open booking form
    openBookingBtn.addEventListener('click', function(e) {
        console.log('Book appointment button clicked');
        e.preventDefault();
        
        // ---- Pre-fill form based on URL parameters ----
        const params = new URLSearchParams(window.location.search);
        const selectedType = params.get('type');
        const selectedName = params.get('name');
        // const selectedId = params.get('id'); // ID is available if needed

        if (selectedName && bookingForm) {
            console.log(`Pre-filling form from URL params: ${selectedType} - ${selectedName}`);
            const serviceSelect = bookingForm.querySelector('#b-service');
            if (serviceSelect) {
                let matchFound = false;
                for (let i = 0; i < serviceSelect.options.length; i++) {
                    // Match based on option value or text content (case-insensitive)
                    if (serviceSelect.options[i].value.toLowerCase() === selectedName.toLowerCase() || 
                        serviceSelect.options[i].textContent.toLowerCase() === selectedName.toLowerCase()) {
                        serviceSelect.selectedIndex = i; // Use selectedIndex for reliability
                        matchFound = true;
                        console.log(`Selected matching option: ${serviceSelect.options[i].textContent}`);
                        break;
                    }
                }
                
                // Fallback: Add to message if no match or for extra info
                if (!matchFound) {
                    const messageTextarea = bookingForm.querySelector('#b-message');
                    if (messageTextarea) {
                        const currentMessage = messageTextarea.value;
                        messageTextarea.value = `Interested in: ${selectedType} - ${selectedName}\n\n${currentMessage}`.trim();
                        console.log('No exact match for service select, added info to message.');
                    }
                } else {
                    // Optionally, still add to message even if match found?
                     const messageTextarea = bookingForm.querySelector('#b-message');
                     if (messageTextarea && !messageTextarea.value.includes(selectedName)) {
                         const currentMessage = messageTextarea.value;
                         messageTextarea.value = `Regarding: ${selectedType} - ${selectedName}\n\n${currentMessage}`.trim();
                     }
                }
            } else {
                 console.warn('Service select element #b-service not found in booking form.');
            }
            
            // Clean up URL parameters without reloading the page
            if (window.history.replaceState) {
                const urlWithoutParams = window.location.pathname + window.location.hash; // Keep hash #booking
                window.history.replaceState({ path: urlWithoutParams }, '', urlWithoutParams);
                console.log('URL parameters cleaned.');
            }
        }
        // ----------------------------------------------------
        
        // Position the form in the center of the viewport
        const windowHeight = window.innerHeight;
        const formHeight = Math.min(windowHeight * 0.9, 600); // Max 90% of viewport or 600px
        
        bookingFormContainer.style.top = '5%';
        bookingFormContainer.style.maxHeight = formHeight + 'px';
        bookingFormContainer.style.display = 'block';
        
        // Show overlay
        if (bookingOverlay) {
            bookingOverlay.style.display = 'block';
            setTimeout(() => {
                bookingOverlay.classList.add('active');
            }, 10);
        }
        
        // Delay to allow display to take effect before adding active class
        setTimeout(() => {
            bookingFormContainer.classList.add('active');
            console.log('Booking form opened');
        }, 10);
    });
    
    // Close booking form
    function closeBookingForm() {
        console.log('Closing booking form');
        bookingFormContainer.classList.remove('active');
        
        // Hide overlay
        if (bookingOverlay) {
            bookingOverlay.classList.remove('active');
        }
        
        // Wait for transition to complete before hiding
        setTimeout(() => {
            bookingFormContainer.style.display = 'none';
            if (bookingOverlay) {
                bookingOverlay.style.display = 'none';
            }
            console.log('Booking form closed');
        }, 400); // Match with transition duration
    }
    
    // Ensure scroll is restored - function no longer needed
    function restoreScroll() {
        // No need to restore scroll as we're never blocking it
        console.log('Scroll already enabled');
    }
    
    // Close with close button
    if (closeBookingBtn) {
        closeBookingBtn.addEventListener('click', closeBookingForm);
    }
    
    // Close with cancel button
    if (cancelBookingBtn) {
        cancelBookingBtn.addEventListener('click', closeBookingForm);
    }
    
    // Close when clicking outside the form
    if (bookingOverlay) {
        bookingOverlay.addEventListener('click', closeBookingForm);
    }
    
    // Handle ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && bookingFormContainer.classList.contains('active')) {
            closeBookingForm();
        }
    });
    
    // Animate form elements when form becomes visible
    const formElements = document.querySelectorAll('#booking-form .form-group');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Add staggered animations to form elements
                formElements.forEach((el, index) => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    el.style.transitionDelay = `${0.1 * index}s`;
                    
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, 10);
                });
                
                observer.disconnect();
            }
        });
    }, {
        threshold: 0.5
    });
    
    if (bookingForm) {
        observer.observe(bookingForm);
    }
    
    // Form submission handling
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Booking form submitted');
            
            // Validate form first
            if (!validateBookingForm()) {
                return; // Stop if validation fails
            }
            
            // Show loading state
            const submitBtn = bookingForm.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            // Create form data object
            const formData = {
                name: document.getElementById('b-name').value,
                email: document.getElementById('b-email').value,
                phone: document.getElementById('b-phone').value,
                service: document.getElementById('b-service').value,
                date: document.getElementById('b-date').value,
                time: document.getElementById('b-time').value,
                additionalInfo: document.getElementById('b-message').value
            };
            
            try {
                // Determine if user is logged in
                const isLoggedIn = !!localStorage.getItem('authToken');
                
                // Use different endpoints based on auth status
                const endpoint = isLoggedIn ? '/api/bookings' : '/api/bookings/guest';
                
                // Set headers based on auth status
                const headers = {
                    'Content-Type': 'application/json'
                };
                
                if (isLoggedIn) {
                    const token = JSON.parse(localStorage.getItem('authToken')).token;
                    headers['Authorization'] = `Bearer ${token}`;
                }
                
                // Make API request
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Show success
                    const successMessage = document.createElement('div');
                    successMessage.className = 'booking-success-message';
                    
                    successMessage.innerHTML = `
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3>Booking Confirmed!</h3>
                        <p>Thank you for booking with us. Your appointment for ${formData.service} on ${formatDate(formData.date)} at ${formData.time} has been scheduled.</p>
                        <p class="email-notification">A confirmation email has been sent to ${formData.email}. Please check your inbox (and spam folder) for details.</p>
                        <button class="btn close-success">Close</button>
                    `;
                    
                    // Replace form with success message
                    const formContainer = bookingForm.parentElement;
                    formContainer.replaceChild(successMessage, bookingForm);
                    
                    // Add handler for the close button
                    formContainer.querySelector('.close-success').addEventListener('click', function() {
                        closeBookingForm();
                        
                        // After closing, restore the form for future bookings
                        setTimeout(() => {
                            formContainer.replaceChild(bookingForm, successMessage);
                            
                            // Reset the form
                            bookingForm.reset();
                            
                            // Reset submit button
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                        }, 500);
                    });
                    
                } else {
                    throw new Error(data.message || 'Booking failed');
                }
                
            } catch (error) {
                console.error('Booking error:', error);
                
                // Show error message
                showBookingError('There was a problem submitting your booking. Please try again or contact us directly.');
                
                // Reset submit button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Show booking error
    function showBookingError(message) {
        const errorElement = document.getElementById('booking-error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            // Scroll to error
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Fallback to alert if error element doesn't exist
            alert(message);
        }
    }
    
    // Format date for display
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    // Validate form fields
    function validateBookingForm() {
        // Get all required fields
        const name = document.getElementById('b-name');
        const email = document.getElementById('b-email');
        const phone = document.getElementById('b-phone');
        const service = document.getElementById('b-service');
        const date = document.getElementById('b-date');
        const time = document.getElementById('b-time');
        
        // Clear previous errors
        document.querySelectorAll('.field-error').forEach(el => el.remove());
        
        let isValid = true;
        
        // Validate each field
        if (!name.value.trim()) {
            showFieldError(name, 'Please enter your name');
            isValid = false;
        }
        
        if (!email.value.trim()) {
            showFieldError(email, 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!phone.value.trim()) {
            showFieldError(phone, 'Please enter your phone number');
            isValid = false;
        }
        
        if (service.value === '') {
            showFieldError(service, 'Please select a service');
            isValid = false;
        }
        
        if (!date.value) {
            showFieldError(date, 'Please select a date');
            isValid = false;
        }
        
        if (!time.value) {
            showFieldError(time, 'Please select a time');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Show error for specific field
    function showFieldError(field, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        // Add error after the field
        field.parentNode.appendChild(errorElement);
        
        // Highlight the field
        field.classList.add('error');
        
        // Remove error highlighting when field is edited
        field.addEventListener('input', function() {
            field.classList.remove('error');
            const error = field.parentNode.querySelector('.field-error');
            if (error) {
                error.remove();
            }
        }, { once: true });
    }
    
    // Validate email format
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Add animations to booking features
    const bookingFeatures = document.querySelectorAll('.booking-feature');
    
    bookingFeatures.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateX(-20px)';
        feature.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        feature.style.transitionDelay = `${0.1 * index}s`;
    });
    
    const bookingObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const feature = entry.target;
                setTimeout(() => {
                    feature.style.opacity = '1';
                    feature.style.transform = 'translateX(0)';
                }, 10);
            }
        });
    }, {
        threshold: 0.2
    });
    
    bookingFeatures.forEach(feature => {
        bookingObserver.observe(feature);
    });
    
    // Add a direct click handler for the book now button as well (redundancy)
    document.querySelectorAll('a[href="#booking"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Allow the default scroll behavior to work, but also open the modal
            setTimeout(() => {
                if (openBookingBtn) {
                    console.log('Triggering booking form open from nav link');
                    openBookingBtn.click();
                }
            }, 700); // Give time for scrolling to finish
        });
    });
    
    console.log('Booking.js initialization complete');
})(); 