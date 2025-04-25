// Booking with authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize booking functionality
    initBookingForm();
});

// Initialize the booking form with authentication checks
function initBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Check if user is logged in
            const token = localStorage.getItem('token');
            
            if (!token) {
                // User is not logged in, show login modal
                showMessage('error', 'Please log in to book an appointment');
                
                // Open login modal after a short delay
                setTimeout(() => {
                    const loginModal = document.getElementById('login-modal');
                    if (loginModal) {
                        loginModal.classList.add('active');
                        document.body.classList.add('modal-open');
                    }
                }, 1000);
                
                return;
            }
            
            // User is logged in, proceed with booking
            try {
                // Get user data from localStorage
                const user = JSON.parse(localStorage.getItem('user'));
                
                // Get form data
                const formData = {
                    name: document.getElementById('booking-name')?.value || user.name,
                    email: document.getElementById('booking-email')?.value || user.email,
                    phone: document.getElementById('booking-phone')?.value || user.phone,
                    service: document.getElementById('booking-service')?.value,
                    date: document.getElementById('booking-date')?.value,
                    time: document.getElementById('booking-time')?.value,
                    additionalInfo: document.getElementById('booking-message')?.value || '',
                    user: user.id // Add user ID from authentication
                };
                
                // Send booking request to API
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Show success message
                    showMessage('success', 'Your booking has been confirmed!');
                    
                    // Reset form
                    bookingForm.reset();
                    
                    // Redirect to confirmation page or show confirmation modal
                    setTimeout(() => {
                        // Optional: redirect to confirmation page
                        // window.location.href = '/booking-confirmation';
                        
                        // Or just scroll to top
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 2000);
                } else {
                    showMessage('error', data.message || 'There was a problem with your booking. Please try again.');
                }
            } catch (error) {
                console.error('Booking error:', error);
                showMessage('error', 'An error occurred during booking. Please try again.');
            }
        });
    }
}

// Function to pre-fill booking form with user data if logged in
function prefillBookingForm() {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    
    if (user) {
        const userData = JSON.parse(user);
        
        // Pre-fill form fields if they exist
        const nameField = document.getElementById('booking-name');
        const emailField = document.getElementById('booking-email');
        const phoneField = document.getElementById('booking-phone');
        
        if (nameField) nameField.value = userData.name || '';
        if (emailField) emailField.value = userData.email || '';
        if (phoneField) phoneField.value = userData.phone || '';
    }
}

// Display messages to the user (re-using function from auth.js)
function showMessage(type, message) {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    // Add to body
    document.body.appendChild(messageEl);
    
    // Show message
    setTimeout(() => {
        messageEl.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => {
            messageEl.remove();
        }, 300);
    }, 3000);
} 