// User Dashboard JavaScript - Enhanced Version

/**
 * User Dashboard Initialization
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('User Dashboard: Initializing...');
    
    // Show loading state
    showGlobalLoadingState(true, 'Loading dashboard...');
    
    try {
        // Initialize all dashboard components
        initSidebar();
        initUserInfo();
        initDashboardStats();
        initBookingsList();
        initPaymentsList();
        initProfileSection();
        initServicesSection();
        setupEventListeners();
        initAccessibilityFeatures();
        initUserPreferences();
        
        // Show initial section
        showActiveSection();
        
        console.log('User Dashboard: Initialization complete');
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showGlobalError('There was a problem loading the dashboard. Please refresh the page.');
    } finally {
        // Hide loading state
        showGlobalLoadingState(false);
    }
});

/**
 * Global loading state
 * @param {boolean} isLoading - Whether to show or hide loading state
 * @param {string} message - Message to display
 */
function showGlobalLoadingState(isLoading, message = 'Loading...') {
    const existingLoader = document.getElementById('global-loader');
    
    if (isLoading) {
        if (existingLoader) return;
        
        const loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.className = 'global-loading';
        loader.innerHTML = `
            <div class="loading-spinner"></div>
            <p>${message}</p>
        `;
        document.body.appendChild(loader);
        
        // Add class to body to prevent scrolling
        document.body.classList.add('loading');
    } else {
        if (existingLoader) {
            existingLoader.classList.add('fade-out');
            setTimeout(() => {
                if (existingLoader.parentNode) {
                    existingLoader.parentNode.removeChild(existingLoader);
                }
                document.body.classList.remove('loading');
            }, 300);
        }
    }
}

/**
 * Show global error message
 * @param {string} message - Error message
 */
function showGlobalError(message) {
    const main = document.querySelector('.dashboard-main');
    if (!main) return;
    
    const errorBanner = document.createElement('div');
    errorBanner.className = 'error-message global-error';
    errorBanner.innerHTML = `
        <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
        <div>
            <strong>Error</strong>
            <p>${message}</p>
            <button class="retry-btn">Retry</button>
        </div>
        <button class="close-error" aria-label="Dismiss">×</button>
    `;
    
    // Insert at the top of main content
    main.insertBefore(errorBanner, main.firstChild);
    
    // Setup event listeners
    errorBanner.querySelector('.retry-btn').addEventListener('click', function() {
        window.location.reload();
    });
    
    errorBanner.querySelector('.close-error').addEventListener('click', function() {
        errorBanner.remove();
    });
}

/**
 * Initialize sidebar navigation
 */
function initSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Extract the target section from href
            const targetId = this.getAttribute('href').substring(1);
            
            // Activate this link
            document.querySelectorAll('.sidebar-nav li').forEach(item => {
                item.classList.remove('active');
                const link = item.querySelector('a');
                if (link) link.setAttribute('aria-current', 'false');
            });
            this.closest('li').classList.add('active');
            this.setAttribute('aria-current', 'page');
            
            // Show the target section
            showSection(targetId);
            
            // Close mobile sidebar if open
            if (window.innerWidth <= 576) {
                document.querySelector('.dashboard-sidebar').classList.remove('show');
                const mobileToggle = document.querySelector('.mobile-toggle');
                if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
            }
            
            // Update URL hash for direct linking
            window.location.hash = targetId;
        });
    });
    
    // Setup logout button
    document.getElementById('logout-button').addEventListener('click', handleLogout);
    document.querySelectorAll('.logout').forEach(logoutLink => {
        logoutLink.addEventListener('click', handleLogout);
    });
}

/**
 * Handle user logout
 */
function handleLogout(e) {
    e.preventDefault();
    
    console.log('User Dashboard: Logging out...');
    
    // Show confirmation dialog
    if (confirm('Are you sure you want to log out?')) {
        // Show loading state
        showGlobalLoadingState(true, 'Logging out...');
        
        try {
            // Clear session data
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
            localStorage.removeItem('isAuthenticated');
            
            // Clear all user preferences except theme
            const theme = localStorage.getItem('theme');
            Object.keys(localStorage).forEach(key => {
                if (key !== 'theme') {
                    localStorage.removeItem(key);
                }
            });
            if (theme) localStorage.setItem('theme', theme);
            
            // Redirect to home page
            showToast('Logged out successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } catch (error) {
            console.error('Logout error:', error);
            showToast('Error logging out. Please try again.', 'error');
            showGlobalLoadingState(false);
        }
    }
}

/**
 * Initialize user information from local storage
 */
function initUserInfo() {
    const user = getUserFromLocalStorage();
    
    if (user) {
        // Set user name in header
        document.getElementById('user-name').textContent = user.name || 'User';
        
        // Set user initial in avatar
        const initialElements = document.querySelectorAll('.user-initials');
        const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
        initialElements.forEach(el => {
            el.textContent = initial;
        });
        
        // Set user name in dropdown
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(el => {
            el.textContent = user.name || 'User';
        });
        
        // Set page title with user name for better UX
        document.title = `Dashboard - ${user.name || 'User'} - New Real Bridal Studio`;
    } else {
        // If no user data found, redirect to login
        console.warn('User Dashboard: No user data found, redirecting to login');
        showToast('Please log in to access the dashboard', 'warning');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

/**
 * Get user data from local storage
 */
function getUserFromLocalStorage() {
    try {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('User Dashboard: Error parsing user data', error);
        return null;
    }
}

/**
 * Initialize dashboard statistics
 */
function initDashboardStats() {
    // Show loading state
    const statsCards = document.querySelectorAll('.stat-card .stat-value');
    statsCards.forEach(card => {
        card.innerHTML = '<div class="loading-spinner" style="width: 20px; height: 20px;"></div>';
    });
    
    // For demo purposes, we'll use mock data with a delay to simulate API call
    // In a real application, this would come from an API with proper error handling
    setTimeout(() => {
        try {
            document.getElementById('upcoming-appointments').textContent = '2';
            document.getElementById('total-bookings').textContent = '5';
            document.getElementById('loyalty-points').textContent = '120';
            
            // Initialize recent activity
            initRecentActivity();
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
            statsCards.forEach(card => {
                card.innerHTML = '<span class="text-danger">Error loading data</span>';
            });
            showToast('Error loading dashboard statistics', 'error');
        }
    }, 800);
}

/**
 * Initialize accessibility features
 */
function initAccessibilityFeatures() {
    // Add aria-labels to interactive elements that might be missing them
    document.querySelectorAll('button:not([aria-label])').forEach(button => {
        if (!button.textContent.trim() && button.querySelector('i')) {
            const iconClass = button.querySelector('i').className;
            let actionLabel = 'Button';
            
            if (iconClass.includes('eye')) actionLabel = 'View details';
            else if (iconClass.includes('times')) actionLabel = 'Cancel';
            else if (iconClass.includes('edit')) actionLabel = 'Edit';
            else if (iconClass.includes('trash')) actionLabel = 'Delete';
            
            button.setAttribute('aria-label', actionLabel);
        }
    });
    
    // Make tables more accessible
    document.querySelectorAll('table').forEach(table => {
        if (!table.getAttribute('role')) {
            table.setAttribute('role', 'table');
            const caption = table.querySelector('caption');
            if (!caption) {
                const section = table.closest('section');
                if (section) {
                    const sectionHeading = section.querySelector('h2, h3');
                    if (sectionHeading) {
                        const captionText = sectionHeading.textContent;
                        const newCaption = document.createElement('caption');
                        newCaption.className = 'visually-hidden';
                        newCaption.textContent = `Table: ${captionText}`;
                        table.prepend(newCaption);
                    }
                }
            }
        }
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // ESC key closes modals and dropdown menus
        if (e.key === 'Escape') {
            const visibleDropdown = document.querySelector('.user-menu-dropdown.show');
            if (visibleDropdown) {
                visibleDropdown.classList.remove('show');
                return;
            }
            
            const modal = document.querySelector('.modal.show');
            if (modal) {
                const closeBtn = modal.querySelector('.close, .btn-close');
                if (closeBtn) closeBtn.click();
            }
        }
    });
}

/**
 * Initialize user preferences
 */
function initUserPreferences() {
    // Check for saved preferences
    const savedDensity = localStorage.getItem('ui-density') || 'default';
    
    // Apply UI density
    document.body.classList.remove('ui-density-compact', 'ui-density-comfortable');
    if (savedDensity !== 'default') {
        document.body.classList.add(`ui-density-${savedDensity}`);
    }
    
    // Create preferences menu if it doesn't exist
    if (!document.getElementById('user-preferences')) {
        // Add preferences button to user menu
        const userMenu = document.querySelector('.user-menu-dropdown');
        if (userMenu) {
            const prefItem = document.createElement('a');
            prefItem.href = '#';
            prefItem.className = 'user-menu-item';
            prefItem.dataset.action = 'preferences';
            prefItem.setAttribute('role', 'menuitem');
            prefItem.innerHTML = '<i class="fas fa-cog" aria-hidden="true"></i> Preferences';
            
            // Insert before logout
            const logoutItem = userMenu.querySelector('.logout');
            if (logoutItem) {
                userMenu.insertBefore(prefItem, logoutItem);
            } else {
                userMenu.appendChild(prefItem);
            }
            
            // Add event listener
            prefItem.addEventListener('click', showPreferencesPanel);
        }
    }
}

/**
 * Show user preferences panel
 */
function showPreferencesPanel(e) {
    if (e) e.preventDefault();
    
    // Hide user menu
    const userMenu = document.querySelector('.user-menu-dropdown');
    if (userMenu) userMenu.classList.remove('show');
    
    // Check if panel already exists
    const existingPanel = document.getElementById('preferences-panel');
    if (existingPanel) {
        existingPanel.classList.add('show');
        return;
    }
    
    // Create preferences panel
    const panel = document.createElement('div');
    panel.id = 'preferences-panel';
    panel.className = 'preferences-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'preferences-title');
    
    // Get current preferences
    const currentDensity = localStorage.getItem('ui-density') || 'default';
    
    panel.innerHTML = `
        <div class="preferences-header">
            <h3 id="preferences-title">User Preferences</h3>
            <button class="close-preferences" aria-label="Close preferences panel">&times;</button>
        </div>
        <div class="preferences-body">
            <div class="preference-group">
                <h4>UI Density</h4>
                <div class="radio-group">
                    <label>
                        <input type="radio" name="ui-density" value="default" ${currentDensity === 'default' ? 'checked' : ''}>
                        Default
                    </label>
                    <label>
                        <input type="radio" name="ui-density" value="comfortable" ${currentDensity === 'comfortable' ? 'checked' : ''}>
                        Comfortable (more spacing)
                    </label>
                    <label>
                        <input type="radio" name="ui-density" value="compact" ${currentDensity === 'compact' ? 'checked' : ''}>
                        Compact (less spacing)
                    </label>
                </div>
            </div>
            
            <div class="preference-group">
                <h4>Theme</h4>
                <div class="btn-group" role="group" aria-label="Theme selection">
                    <button class="theme-btn ${document.body.classList.contains('dark-mode') ? '' : 'active'}" data-theme="light">
                        <i class="fas fa-sun" aria-hidden="true"></i> Light
                    </button>
                    <button class="theme-btn ${document.body.classList.contains('dark-mode') ? 'active' : ''}" data-theme="dark">
                        <i class="fas fa-moon" aria-hidden="true"></i> Dark
                    </button>
                </div>
            </div>
        </div>
        <div class="preferences-footer">
            <button class="save-preferences">Save Preferences</button>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Setup event listeners
    panel.querySelector('.close-preferences').addEventListener('click', function() {
        panel.classList.remove('show');
    });
    
    panel.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            panel.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    panel.querySelector('.save-preferences').addEventListener('click', function() {
        // Save UI density
        const density = panel.querySelector('input[name="ui-density"]:checked').value;
        localStorage.setItem('ui-density', density);
        
        // Apply UI density
        document.body.classList.remove('ui-density-compact', 'ui-density-comfortable');
        if (density !== 'default') {
            document.body.classList.add(`ui-density-${density}`);
        }
        
        // Save theme
        const activeThemeBtn = panel.querySelector('.theme-btn.active');
        if (activeThemeBtn) {
            const theme = activeThemeBtn.dataset.theme;
            localStorage.setItem('theme', theme);
            
            // Apply theme
            if (theme === 'dark') {
                document.body.classList.add('dark-mode');
                const themeToggle = document.getElementById('theme-toggle');
                if (themeToggle) {
                    themeToggle.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
                    themeToggle.setAttribute('aria-label', 'Switch to light mode');
                }
            } else {
                document.body.classList.remove('dark-mode');
                const themeToggle = document.getElementById('theme-toggle');
                if (themeToggle) {
                    themeToggle.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
                    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
                }
            }
        }
        
        // Close panel
        panel.classList.remove('show');
        
        // Show success message
        showToast('Preferences saved successfully', 'success');
    });
    
    // Show panel with animation
    setTimeout(() => panel.classList.add('show'), 10);
}

/**
 * Initialize recent activity feed
 */
function initRecentActivity() {
    const activityList = document.getElementById('activity-list');
    
    if (!activityList) return;
    
    // Show loading state
    activityList.innerHTML = `
        <div class="loading-indicator">
            <div class="loading-spinner"></div>
            <p>Loading recent activity...</p>
        </div>
    `;
    
    // Mock activity data - in a real app, this would come from an API
    const activities = [
        {
            icon: 'calendar-check',
            content: 'Your bridal consultation has been confirmed',
            time: '2 hours ago'
        },
        {
            icon: 'credit-card',
            content: 'Payment of $250 received for wedding dress deposit',
            time: '2 days ago'
        },
        {
            icon: 'star',
            content: 'You earned 50 loyalty points for your last booking',
            time: '1 week ago'
        }
    ];
    
    // Simulate API delay
    setTimeout(() => {
        try {
            // Clear previous content
            activityList.innerHTML = '';
            
            if (activities.length === 0) {
                activityList.innerHTML = `
                    <div class="empty-message">
                        <i class="fas fa-history" aria-hidden="true"></i>
                        <p>No recent activity found.</p>
                    </div>
                `;
                return;
            }
            
            // Add activity items
            activities.forEach(activity => {
                const item = document.createElement('div');
                item.className = 'activity-item';
                item.innerHTML = `
                    <div class="activity-icon">
                        <i class="fas fa-${activity.icon}" aria-hidden="true"></i>
                    </div>
                    <div class="activity-content">
                        <p>${activity.content}</p>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                `;
                activityList.appendChild(item);
            });
        } catch (error) {
            console.error('Error loading activity feed:', error);
            activityList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
                    <p>Error loading activity feed</p>
                    <button class="retry-btn">Retry</button>
                </div>
            `;
            
            activityList.querySelector('.retry-btn').addEventListener('click', function() {
                initRecentActivity();
            });
        }
    }, 800);
}

/**
 * Initialize the bookings list section with better error handling and loading states
 */
function initBookingsList() {
    const bookingsList = document.getElementById('bookings-list');
    
    if (!bookingsList) return;
    
    // Show loading state
    bookingsList.innerHTML = `
        <div class="loading-indicator">
            <div class="loading-spinner"></div>
            <p>Loading appointments...</p>
        </div>
    `;
    
    // Mock bookings data - in a real app, this would come from an API
    const bookings = [
        {
            id: 'BK001',
            service: 'Bridal Consultation',
            date: '2023-09-15',
            time: '10:00 AM',
            status: 'confirmed'
        },
        {
            id: 'BK002',
            service: 'Wedding Dress Fitting',
            date: '2023-09-25',
            time: '2:30 PM',
            status: 'pending'
        },
        {
            id: 'BK003',
            service: 'Makeup Trial',
            date: '2023-08-10',
            time: '11:00 AM',
            status: 'completed'
        },
        {
            id: 'BK004',
            service: 'Final Dress Fitting',
            date: '2023-07-05',
            time: '3:00 PM',
            status: 'cancelled'
        },
        {
            id: 'BK005',
            service: 'Engagement Photoshoot',
            date: '2023-10-10',
            time: '4:00 PM',
            status: 'confirmed'
        }
    ];
    
    // Setup booking filter buttons
    document.querySelectorAll('.booking-filters button').forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            document.querySelectorAll('.booking-filters button').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Filter bookings
            const filter = this.getAttribute('data-filter');
            displayBookings(bookings, filter);
        });
    });
    
    // Simulate API delay
    setTimeout(() => {
        try {
            // Display all bookings initially
            displayBookings(bookings, 'all');
        } catch (error) {
            console.error('Error loading bookings:', error);
            bookingsList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
                    <p>Error loading appointments</p>
                    <button class="retry-btn">Retry</button>
                </div>
            `;
            
            bookingsList.querySelector('.retry-btn').addEventListener('click', function() {
                initBookingsList();
            });
        }
    }, 800);
}

/**
 * Display bookings based on filter
 */
function displayBookings(bookings, filter) {
    const bookingsList = document.getElementById('bookings-list');
    
    // Filter bookings
    let filteredBookings = bookings;
    if (filter !== 'all') {
        filteredBookings = bookings.filter(booking => booking.status === filter);
    }
    
    // Clear previous content
    bookingsList.innerHTML = '';
    
    // Check if any bookings match the filter
    if (filteredBookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="empty-message">
                <p>No ${filter} appointments found.</p>
            </div>
        `;
        return;
    }
    
    // Create table for bookings
    const table = document.createElement('table');
    table.className = 'table table-hover';
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    
    // Add booking rows
    const tbody = table.querySelector('tbody');
    filteredBookings.forEach(booking => {
        const row = document.createElement('tr');
        
        // Format date
        const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.service}</td>
            <td>${formattedDate}</td>
            <td>${booking.time}</td>
            <td><span class="status status-${booking.status}">${booking.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline view-booking-btn" data-id="${booking.id}">
                    <i class="fas fa-eye"></i>
                </button>
                ${booking.status === 'pending' || booking.status === 'confirmed' ? 
                `<button class="btn btn-sm btn-danger cancel-booking-btn" data-id="${booking.id}">
                    <i class="fas fa-times"></i>
                </button>` : ''}
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    bookingsList.appendChild(table);
    
    // Setup action buttons
    setupBookingActionButtons();
}

/**
 * Setup booking action buttons
 */
function setupBookingActionButtons() {
    // View booking details
    document.querySelectorAll('.view-booking-btn').forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-id');
            showToast(`Viewing booking ${bookingId}`, 'info');
            // In a real app, this would open a modal with booking details
        });
    });
    
    // Cancel booking
    document.querySelectorAll('.cancel-booking-btn').forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-id');
            // In a real app, this would show a confirmation dialog and then call an API
            showToast(`Booking ${bookingId} has been cancelled`, 'success');
            
            // Update the UI
            const row = this.closest('tr');
            row.querySelector('.status').className = 'status status-cancelled';
            row.querySelector('.status').textContent = 'cancelled';
            this.remove(); // Remove the cancel button
        });
    });
}

/**
 * Initialize payments list section
 */
function initPaymentsList() {
    const paymentsList = document.getElementById('payments-list');
    
    if (!paymentsList) return;
    
    // Mock payments data - in a real app, this would come from an API
    const payments = [
        {
            id: 'PAY001',
            date: '2023-08-25',
            amount: 250.00,
            method: 'Credit Card',
            status: 'paid',
            description: 'Wedding Dress Deposit'
        },
        {
            id: 'PAY002',
            date: '2023-07-15',
            amount: 150.00,
            method: 'PayPal',
            status: 'paid',
            description: 'Makeup Trial Session'
        },
        {
            id: 'PAY003',
            date: '2023-06-10',
            amount: 300.00,
            method: 'Bank Transfer',
            status: 'paid',
            description: 'Photography Package Deposit'
        }
    ];
    
    // Clear previous content
    paymentsList.innerHTML = '';
    
    // Check if any payments
    if (payments.length === 0) {
        paymentsList.innerHTML = `
            <div class="empty-message">
                <p>No payment history found.</p>
            </div>
        `;
        return;
    }
    
    // Create table for payments
    const table = document.createElement('table');
    table.className = 'table table-hover';
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    
    // Add payment rows
    const tbody = table.querySelector('tbody');
    payments.forEach(payment => {
        const row = document.createElement('tr');
        
        // Format date
        const formattedDate = new Date(payment.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        row.innerHTML = `
            <td>${payment.id}</td>
            <td>${formattedDate}</td>
            <td>${payment.description}</td>
            <td>$${payment.amount.toFixed(2)}</td>
            <td>${payment.method}</td>
            <td><span class="status status-${payment.status}">${payment.status}</span></td>
        `;
        
        tbody.appendChild(row);
    });
    
    paymentsList.appendChild(table);
}

/**
 * Initialize profile section
 */
function initProfileSection() {
    const accountInfo = document.getElementById('account-info');
    const profileEditForm = document.getElementById('profile-edit-form');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const cancelEditProfileBtn = document.getElementById('cancel-edit-profile-btn');
    
    if (!accountInfo || !profileEditForm) return;
    
    // Get user data
    const user = getUserFromLocalStorage();
    
    if (!user) return;
    
    // Display user info
    accountInfo.innerHTML = `
        <div class="user-details">
            <div class="user-detail">
                <strong>Name:</strong> <span id="display-name">${user.name || 'Not set'}</span>
            </div>
            <div class="user-detail">
                <strong>Email:</strong> <span id="display-email">${user.email || 'Not set'}</span>
            </div>
            <div class="user-detail">
                <strong>Phone:</strong> <span id="display-phone">${user.phone || 'Not set'}</span>
            </div>
            <div class="user-detail">
                <strong>Member Since:</strong> <span>August 2023</span>
            </div>
        </div>
    `;
    
    // Setup edit form
    if (profileEditForm) {
        // Set initial values
        document.getElementById('profile-name').value = user.name || '';
        document.getElementById('profile-email').value = user.email || '';
        document.getElementById('profile-phone').value = user.phone || '';
        
        // Toggle edit mode
        editProfileBtn.addEventListener('click', function() {
            accountInfo.style.display = 'none';
            profileEditForm.style.display = 'block';
        });
        
        // Cancel edit
        cancelEditProfileBtn.addEventListener('click', function() {
            accountInfo.style.display = 'block';
            profileEditForm.style.display = 'none';
        });
        
        // Save changes
        profileEditForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('profile-name').value;
            const email = document.getElementById('profile-email').value;
            const phone = document.getElementById('profile-phone').value;
            
            // Update user data
            user.name = name;
            user.email = email;
            user.phone = phone;
            
            // Save to local storage
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Update display
            document.getElementById('display-name').textContent = name || 'Not set';
            document.getElementById('display-email').textContent = email || 'Not set';
            document.getElementById('display-phone').textContent = phone || 'Not set';
            
            // Update header
            document.getElementById('user-name').textContent = name || 'User';
            
            // Show success message
            showToast('Profile updated successfully!', 'success');
            
            // Hide form
            accountInfo.style.display = 'block';
            profileEditForm.style.display = 'none';
        });
    }
    
    // Setup password change form
    const passwordChangeForm = document.getElementById('password-change-form');
    if (passwordChangeForm) {
        passwordChangeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('confirm-new-password').value;
            
            // Validate passwords
            if (newPassword !== confirmNewPassword) {
                showToast('New passwords do not match!', 'error');
                return;
            }
            
            if (newPassword.length < 8) {
                showToast('Password must be at least 8 characters long!', 'error');
                return;
            }
            
            // In a real app, we would call an API to change the password
            
            // Show success message
            showToast('Password changed successfully!', 'success');
            
            // Reset form
            passwordChangeForm.reset();
        });
    }
}

/**
 * Initialize services section
 */
function initServicesSection() {
    const servicesSection = document.getElementById('services');
    
    if (!servicesSection) return;
    
    // Mock services data - in a real app, this would come from an API
    const services = [
        {
            id: 1,
            name: 'Bridal Consultation',
            description: 'One-on-one consultation with our bridal experts to help you find your perfect dress.',
            price: 50.00,
            duration: '1 hour',
            image: 'images/services/bridal-consultation.jpg'
        },
        {
            id: 2,
            name: 'Wedding Dress Fitting',
            description: 'Professional fitting service to ensure your dress fits perfectly for your special day.',
            price: 75.00,
            duration: '1.5 hours',
            image: 'images/services/dress-fitting.jpg'
        },
        {
            id: 3,
            name: 'Makeup Trial',
            description: 'Trial makeup session to test your wedding day look and make any adjustments.',
            price: 80.00,
            duration: '1 hour',
            image: 'images/services/makeup-trial.jpg'
        },
        {
            id: 4,
            name: 'Engagement Photoshoot',
            description: 'Professional photographer to capture your engagement memories.',
            price: 200.00,
            duration: '2 hours',
            image: 'images/services/engagement-photos.jpg'
        }
    ];
    
    // Create services grid
    const servicesGrid = document.createElement('div');
    servicesGrid.className = 'services-grid';
    
    // Add service cards
    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        
        // Use placeholder image if no image provided
        const imageSrc = service.image || 'https://via.placeholder.com/300x200?text=No+Image';
        
        serviceCard.innerHTML = `
            <div class="service-image">
                <img src="${imageSrc}" alt="${service.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Error'">
            </div>
            <div class="service-content">
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <div class="service-details">
                    <span class="service-price">$${service.price.toFixed(2)}</span>
                    <span class="service-duration"><i class="far fa-clock"></i> ${service.duration}</span>
                </div>
                <button class="book-service-btn" data-id="${service.id}">
                    <i class="fas fa-calendar-plus"></i> Book Now
                </button>
            </div>
        `;
        
        servicesGrid.appendChild(serviceCard);
    });
    
    // Add services grid to section
    servicesSection.appendChild(servicesGrid);
    
    // Setup booking buttons
    document.querySelectorAll('.book-service-btn').forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-id');
            showToast(`Booking service ${serviceId} - functionality coming soon!`, 'info');
        });
    });
}

/**
 * Setup additional event listeners
 */
function setupEventListeners() {
    // User menu toggle
    const userMenuButton = document.querySelector('.user-menu-button');
    const userMenuDropdown = document.querySelector('.user-menu-dropdown');
    
    if (userMenuButton && userMenuDropdown) {
        userMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenuDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            userMenuDropdown.classList.remove('show');
        });
        
        // Prevent click inside dropdown from closing it
        userMenuDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Quick action links
    document.querySelectorAll('.action-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                const targetId = href.substring(1);
                showSection(targetId);
                
                // Activate corresponding sidebar link
                document.querySelectorAll('.sidebar-nav li').forEach(item => {
                    item.classList.remove('active');
                    if (item.querySelector('a').getAttribute('href') === href) {
                        item.classList.add('active');
                    }
                });
            }
        });
    });
}

/**
 * Show a section and hide others
 */
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}

/**
 * Show the active section based on URL hash or default to overview
 */
function showActiveSection() {
    const hash = window.location.hash;
    
    if (hash && hash.length > 1) {
        const sectionId = hash.substring(1);
        showSection(sectionId);
        
        // Activate sidebar link
        document.querySelectorAll('.sidebar-nav li').forEach(item => {
            item.classList.remove('active');
            if (item.querySelector('a').getAttribute('href') === hash) {
                item.classList.add('active');
            }
        });
    } else {
        // Default to overview section
        showSection('overview');
        
        // Activate overview link
        const overviewLink = document.querySelector('.sidebar-nav li a[href="#overview"]');
        if (overviewLink) {
            overviewLink.closest('li').classList.add('active');
        }
    }
}

/**
 * Show a toast notification with improved accessibility
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (info, success, warning, error)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-notifications');
    
    if (!toastContainer) {
        // Create toast container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'toast-notifications';
        container.setAttribute('role', 'alert');
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
        return showToast(message, type, duration); // Try again
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    
    // Add icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    else if (type === 'warning') icon = 'exclamation-triangle';
    else if (type === 'error') icon = 'exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}" aria-hidden="true"></i>
        <span>${message}</span>
        <button aria-label="Dismiss" class="dismiss-toast">&times;</button>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Add dismiss button handler
    toast.querySelector('.dismiss-toast').addEventListener('click', function() {
        toast.classList.add('exiting');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    });
    
    // Show toast (delayed to allow for transition)
    setTimeout(() => {
        toast.classList.add('active');
    }, 10);
    
    // Remove toast after delay
    const timeoutId = setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('exiting');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300); // Match the transition time in CSS
        }
    }, duration);
    
    // Cancel timeout if toast is dismissed manually
    toast.addEventListener('click', function() {
        clearTimeout(timeoutId);
    });
    
    return toast;
} 