/**
 * Floating Booking Widget
 * Shows a quick booking form that appears after scrolling
 */
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const floatingBtn = document.getElementById('floating-booking-btn');
    const floatingForm = document.getElementById('floating-booking-form');
    const closeBtn = document.getElementById('floating-form-close');
    const quickForm = document.getElementById('quick-booking-form');
    
    // Scroll threshold in pixels to show the floating button
    const scrollThreshold = 300;
    
    // Check if elements exist
    if (!floatingBtn || !floatingForm || !closeBtn || !quickForm) {
        return;
    }
    
    // Init date field with minimum date
    const dateInput = document.getElementById('quick-date');
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
    
    // Show floating button when scrolled down
    window.addEventListener('scroll', function() {
        if (window.scrollY > scrollThreshold) {
            floatingBtn.classList.add('active');
        } else {
            floatingBtn.classList.remove('active');
            floatingForm.classList.remove('active');
        }
    });
    
    // Toggle form when button is clicked
    floatingBtn.addEventListener('click', function() {
        floatingForm.classList.add('active');
        floatingBtn.classList.remove('active');
        
        // Focus first field
        const firstInput = quickForm.querySelector('input, select');
        if (firstInput) {
            setTimeout(() => {
                firstInput.focus();
            }, 300);
        }
    });
    
    // Close form when close button is clicked
    closeBtn.addEventListener('click', function() {
        floatingForm.classList.remove('active');
        floatingBtn.classList.add('active');
    });
    
    // Close form when clicking outside
    document.addEventListener('click', function(e) {
        // Check if click is outside the form
        if (floatingForm.classList.contains('active') && 
            !floatingForm.contains(e.target) && 
            e.target !== floatingBtn) {
            floatingForm.classList.remove('active');
            floatingBtn.classList.add('active');
        }
    });
    
    // Handle form submission
    quickForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        const isValid = validateQuickForm();
        
        if (!isValid) {
            return;
        }
        
        // Show loading state
        const submitBtn = quickForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset form
            quickForm.reset();
            
            // Show success message
            floatingForm.classList.remove('active');
            
            // Show success toast
            showSuccessToast('Booking request sent successfully! We\'ll contact you shortly.');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
    
    /**
     * Validate quick booking form
     */
    function validateQuickForm() {
        let isValid = true;
        const fields = quickForm.querySelectorAll('input[required], select[required]');
        
        // Remove all existing errors
        const errorMsgs = quickForm.querySelectorAll('.error-message');
        errorMsgs.forEach(msg => msg.remove());
        
        // Check each required field
        fields.forEach(field => {
            field.classList.remove('error');
            
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // Add error message
                const errorSpan = document.createElement('span');
                errorSpan.className = 'error-message';
                errorSpan.textContent = 'This field is required';
                field.parentNode.appendChild(errorSpan);
            }
            
            // Additional validation for phone
            if (field.id === 'quick-phone' && field.value.trim()) {
                const phoneRegex = /^[\d\+\-\(\) ]{10,}$/;
                if (!phoneRegex.test(field.value.trim())) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Add error message
                    const errorSpan = document.createElement('span');
                    errorSpan.className = 'error-message';
                    errorSpan.textContent = 'Please enter a valid phone number';
                    field.parentNode.appendChild(errorSpan);
                }
            }
        });
        
        return isValid;
    }
    
    /**
     * Show success toast notification
     */
    function showSuccessToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast success-toast';
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="toast-message">${message}</div>
        `;
        
        // Add to body
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Hide toast after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            
            // Remove from DOM after animation
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }
}); 