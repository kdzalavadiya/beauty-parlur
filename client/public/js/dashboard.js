// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initDashboard();
});

function initDashboard() {
    // Load initial data
    loadProfile();
    loadBookings();
    loadPayments();
    loadOfferings();
    loadStats();

    // Setup event listeners
    setupEventListeners();
}

// Helper function to show toast notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-notifications');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 
                     type === 'error' ? 'fas fa-exclamation-circle' : 
                     'fas fa-info-circle';
    
    const text = document.createElement('span');
    text.textContent = message;
    
    toast.appendChild(icon);
    toast.appendChild(text);
    toastContainer.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Load and display user profile
async function loadProfile() {
    const accountInfoDiv = document.getElementById('account-info');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    
    accountInfoDiv.innerHTML = '<div class="loading-indicator"><p>Loading profile details...</p></div>';
    editProfileBtn.style.display = 'none';

    try {
        const response = await fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Failed to load profile');

        const data = await response.json();
        
        if (data.success) {
            const user = data.data;
            document.getElementById('user-name').textContent = user.name;
            
            accountInfoDiv.innerHTML = `
                <div class="profile-info">
                    <p><strong>Name:</strong> <span id="display-name">${user.name}</span></p>
                    <p><strong>Email:</strong> <span id="display-email">${user.email}</span></p>
                    <p><strong>Phone:</strong> <span id="display-phone">${user.phone || 'Not provided'}</span></p>
                    <p><strong>Account Created:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            `;
            editProfileBtn.style.display = 'inline-flex';
        } else {
            throw new Error(data.message || 'Failed to load profile');
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        accountInfoDiv.innerHTML = '<p class="error-message">Could not load profile details.</p>';
        showToast('Failed to load profile details', 'error');
    }
}

// Load and display user bookings
async function loadBookings() {
    const bookingsListDiv = document.getElementById('bookings-list');
    bookingsListDiv.innerHTML = '<div class="loading-indicator"><p>Loading appointments...</p></div>';

    try {
        const response = await fetch('/api/bookings', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Failed to load bookings');

        const data = await response.json();
        
        if (data.success) {
            const bookings = data.data;
            if (bookings.length === 0) {
                bookingsListDiv.innerHTML = '<p class="empty-message">You have no appointments.</p>';
                return;
            }

            // Sort bookings by date
            bookings.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

            // Render bookings table
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Service</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${bookings.map(booking => `
                        <tr>
                            <td>${new Date(booking.appointmentDate).toLocaleString()}</td>
                            <td>${booking.serviceName}</td>
                            <td><span class="status status-${booking.status.toLowerCase()}">${booking.status}</span></td>
                            <td>
                                ${booking.status === 'pending' ? 
                                    `<button class="cancel-appointment-btn" data-booking-id="${booking._id}">
                                        <i class="fas fa-times"></i> Cancel
                                    </button>` : 
                                    ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;

            bookingsListDiv.innerHTML = '';
            bookingsListDiv.appendChild(table);

            // Add event listeners to cancel buttons
            document.querySelectorAll('.cancel-appointment-btn').forEach(button => {
                button.addEventListener('click', handleCancelBooking);
            });
        } else {
            throw new Error(data.message || 'Failed to load bookings');
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        bookingsListDiv.innerHTML = '<p class="error-message">Could not load appointments.</p>';
        showToast('Failed to load appointments', 'error');
    }
}

// Handle booking cancellation
async function handleCancelBooking(event) {
    const bookingId = event.target.closest('button').dataset.bookingId;
    
    if (!confirm('Are you sure you want to cancel this appointment?')) {
        return;
    }

    try {
        const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to cancel booking');

        const data = await response.json();
        
        if (data.success) {
            showToast('Appointment cancelled successfully', 'success');
            loadBookings(); // Refresh the bookings list
        } else {
            throw new Error(data.message || 'Failed to cancel booking');
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        showToast('Failed to cancel appointment', 'error');
    }
}

// Load and display payment history
async function loadPayments() {
    const paymentsListDiv = document.getElementById('payments-list');
    paymentsListDiv.innerHTML = '<div class="loading-indicator"><p>Loading payment history...</p></div>';

    try {
        const response = await fetch('/api/payments/my', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Failed to load payments');

        const data = await response.json();
        
        if (data.success) {
            const payments = data.data;
            if (payments.length === 0) {
                paymentsListDiv.innerHTML = '<p class="empty-message">You have no payment history.</p>';
                return;
            }

            // Create payments table
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Method</th>
                        <th>Booking Ref</th>
                    </tr>
                </thead>
                <tbody>
                    ${payments.map(payment => `
                        <tr>
                            <td>${new Date(payment.paymentDate).toLocaleDateString()}</td>
                            <td>${payment.amount.toFixed(2)} ${payment.currency}</td>
                            <td><span class="status status-${payment.status.toLowerCase()}">${payment.status}</span></td>
                            <td>${payment.paymentMethod}</td>
                            <td>${payment.booking ? payment.booking.substring(0, 8) + '...' : '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;

            paymentsListDiv.innerHTML = '';
            paymentsListDiv.appendChild(table);
        } else {
            throw new Error(data.message || 'Failed to load payments');
        }
    } catch (error) {
        console.error('Error loading payments:', error);
        paymentsListDiv.innerHTML = '<p class="error-message">Could not load payment history.</p>';
        showToast('Failed to load payment history', 'error');
    }
}

// Load and display services, packages, and products
async function loadOfferings() {
    const servicesGrid = document.querySelector('#services-list .offering-grid');
    const packagesGrid = document.querySelector('#packages-list .offering-grid');
    const productsGrid = document.querySelector('#products-list .offering-grid');
    
    [servicesGrid, packagesGrid, productsGrid].forEach(grid => {
        grid.innerHTML = '<div class="loading-indicator"><p>Loading...</p></div>';
    });

    try {
        const [servicesRes, packagesRes, productsRes] = await Promise.all([
            fetch('/api/services'),
            fetch('/api/packages'),
            fetch('/api/products')
        ]);

        const [servicesData, packagesData, productsData] = await Promise.all([
            servicesRes.json(),
            packagesRes.json(),
            productsRes.json()
        ]);

        // Render services
        if (servicesData.success) {
            servicesGrid.innerHTML = servicesData.data.map(service => `
                <div class="service-card">
                    <img src="${service.imageUrl || '/images/default-service.jpg'}" alt="${service.name}">
                    <div class="service-card-content">
                        <h3>${service.name}</h3>
                        <p>${service.description}</p>
                        <div class="price">$${service.price.toFixed(2)}</div>
                        <a href="/book?service=${service._id}" class="book-btn">
                            <i class="fas fa-calendar-plus"></i> Book Now
                        </a>
                    </div>
                </div>
            `).join('');
        }

        // Render packages
        if (packagesData.success) {
            packagesGrid.innerHTML = packagesData.data.map(pkg => `
                <div class="package-card">
                    <img src="${pkg.imageUrl || '/images/default-package.jpg'}" alt="${pkg.name}">
                    <div class="package-card-content">
                        <h3>${pkg.name}</h3>
                        <p>${pkg.description}</p>
                        <div class="price">$${pkg.price.toFixed(2)}</div>
                        <a href="/book?package=${pkg._id}" class="book-btn">
                            <i class="fas fa-calendar-plus"></i> Book Now
                        </a>
                    </div>
                </div>
            `).join('');
        }

        // Render products
        if (productsData.success) {
            productsGrid.innerHTML = productsData.data.map(product => `
                <div class="product-card">
                    <img src="${product.imageUrl || '/images/default-product.jpg'}" alt="${product.name}">
                    <div class="product-card-content">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="price">$${product.price.toFixed(2)}</div>
                        <a href="/shop?product=${product._id}" class="book-btn">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </a>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading offerings:', error);
        showToast('Failed to load offerings', 'error');
    }
}

// Load dashboard statistics
async function loadStats() {
    try {
        const response = await fetch('/api/dashboard/stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Failed to load stats');

        const data = await response.json();
        
        if (data.success) {
            document.getElementById('upcoming-appointments').textContent = data.data.upcomingAppointments;
            document.getElementById('total-bookings').textContent = data.data.totalBookings;
            document.getElementById('loyalty-points').textContent = data.data.loyaltyPoints;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Profile edit form
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profileForm = document.getElementById('profile-edit-form');
    const cancelEditBtn = document.getElementById('cancel-edit-profile-btn');

    editProfileBtn.addEventListener('click', () => {
        profileForm.style.display = 'block';
        editProfileBtn.style.display = 'none';
    });

    cancelEditBtn.addEventListener('click', () => {
        profileForm.style.display = 'none';
        editProfileBtn.style.display = 'inline-flex';
    });

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('profile-name').value,
            email: document.getElementById('profile-email').value,
            phone: document.getElementById('profile-phone').value
        };

        try {
            const response = await fetch('/api/users/me', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to update profile');

            const data = await response.json();
            
            if (data.success) {
                showToast('Profile updated successfully', 'success');
                loadProfile();
                profileForm.style.display = 'none';
                editProfileBtn.style.display = 'inline-flex';
            } else {
                throw new Error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showToast('Failed to update profile', 'error');
        }
    });

    // Password change form
    const passwordForm = document.getElementById('password-change-form');
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            currentPassword: document.getElementById('current-password').value,
            newPassword: document.getElementById('new-password').value
        };

        try {
            const response = await fetch('/api/users/me/password', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to change password');

            const data = await response.json();
            
            if (data.success) {
                showToast('Password changed successfully', 'success');
                passwordForm.reset();
            } else {
                throw new Error(data.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            showToast('Failed to change password', 'error');
        }
    });

    // Booking filters
    document.querySelectorAll('.booking-filters button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.booking-filters button.active').classList.remove('active');
            button.classList.add('active');
            // Implement filtering logic here
        });
    });

    // Logout button
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    });
} 