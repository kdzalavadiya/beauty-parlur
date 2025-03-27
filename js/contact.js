/**
 * Contact form handling and validation
 */
(function() {
    // Get contact form element
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Form validation and submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form fields
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        
        // Basic validation
        if (!validateForm(nameInput, emailInput, subjectInput, messageInput)) {
            return false;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission with a delay (replace with actual AJAX call)
        setTimeout(() => {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success-message';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h4>Message Sent Successfully!</h4>
                <p>Thank you for contacting us. We will get back to you soon!</p>
            `;
            
            // Insert success message after the form
            contactForm.parentNode.appendChild(successMessage);
            
            // Reset form
            contactForm.reset();
            
            // Hide form
            contactForm.style.display = 'none';
            
            // Show success message with animation
            setTimeout(() => {
                successMessage.classList.add('show');
            }, 10);
            
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Allow form to be shown again after some time (for demonstration)
            setTimeout(() => {
                successMessage.classList.remove('show');
                
                setTimeout(() => {
                    contactForm.style.display = '';
                    successMessage.remove();
                }, 500);
            }, 5000);
        }, 2000);
    });
    
    // Form validation function
    function validateForm(nameInput, emailInput, subjectInput, messageInput) {
        let isValid = true;
        
        // Clear previous error styling
        const formGroups = contactForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('has-error');
            const errorMsg = group.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        });
        
        // Name validation
        if (!nameInput.value.trim()) {
            displayError(nameInput, 'Please enter your name');
            isValid = false;
        }
        
        // Email validation
        if (!emailInput.value.trim()) {
            displayError(emailInput, 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            displayError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Subject validation
        if (!subjectInput.value.trim()) {
            displayError(subjectInput, 'Please enter a subject');
            isValid = false;
        }
        
        // Message validation
        if (!messageInput.value.trim()) {
            displayError(messageInput, 'Please enter your message');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Email validation regex
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Display error message
    function displayError(inputElement, message) {
        const formGroup = inputElement.closest('.form-group');
        formGroup.classList.add('has-error');
        
        // Create error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        // Add error message after input
        inputElement.parentNode.appendChild(errorMessage);
        
        // Focus on first error
        if (!contactForm.querySelector('.form-group.has-error input:focus')) {
            inputElement.focus();
        }
    }
    
    // Add input event listeners to clear errors on typing
    contactForm.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('input', function() {
            const formGroup = this.closest('.form-group');
            formGroup.classList.remove('has-error');
            
            const errorMsg = formGroup.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        });
    });
})(); 