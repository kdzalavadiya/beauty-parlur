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
    const bookingForm = document.getElementById('booking-form');
    
    // Log element status for debugging
    console.log('Open button found:', !!openBookingBtn);
    console.log('Close button found:', !!closeBookingBtn);
    console.log('Cancel button found:', !!cancelBookingBtn);
    console.log('Form container found:', !!bookingFormContainer);
    console.log('Booking form found:', !!bookingForm);
    
    if (!openBookingBtn || !bookingFormContainer) {
        console.error('Required booking elements not found');
        return;
    }
    
    // Open booking form
    openBookingBtn.addEventListener('click', function(e) {
        console.log('Book appointment button clicked');
        e.preventDefault();
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        bookingFormContainer.style.display = 'flex';
        
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
        
        // Wait for transition to complete before hiding
        setTimeout(() => {
            bookingFormContainer.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
            console.log('Booking form closed');
        }, 400); // Match with transition duration
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
    bookingFormContainer.addEventListener('click', function(e) {
        if (e.target === bookingFormContainer) {
            closeBookingForm();
        }
    });
    
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
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Booking form submitted');
            
            // Show loading state
            const submitBtn = bookingForm.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual AJAX call)
            setTimeout(() => {
                // Show success message
                bookingFormContainer.innerHTML = `
                    <div class="form-success-content">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3>Booking Successful!</h3>
                        <p>Thank you for your booking request. We will contact you shortly to confirm your appointment.</p>
                        <button type="button" class="btn" id="success-close-btn">Close</button>
                    </div>
                `;
                
                // Add animation
                const successContent = bookingFormContainer.querySelector('.form-success-content');
                successContent.style.opacity = '0';
                successContent.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    successContent.style.opacity = '1';
                    successContent.style.transform = 'translateY(0)';
                    successContent.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                }, 10);
                
                // Close button for success message
                const successCloseBtn = document.getElementById('success-close-btn');
                if (successCloseBtn) {
                    successCloseBtn.addEventListener('click', closeBookingForm);
                }
            }, 2000);
        });
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