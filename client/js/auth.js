// Authentication JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Find and attach event to the main Register Now link
    setTimeout(() => {
        // Direct event listener for the main register link by ID
        const mainRegisterLinkById = document.getElementById('main-register-link');
        if (mainRegisterLinkById) {
            mainRegisterLinkById.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Hide login section
                const loginSection = document.querySelector('.login-section');
                if (loginSection) {
                    loginSection.style.display = 'none';
                }
                
                // Open register modal
                const registerModal = document.getElementById('register-modal');
                if (registerModal) {
                    openModal(registerModal);
                } else {
                    console.error('Register modal not found!');
                }
            });
        } else {
            console.warn('Main register link not found by ID, trying class selectors');
            
            // Fallback to class selectors
            const registerLinks = document.querySelectorAll('.main-open-register, .auth-link.main-open-register, a[href="#"][class*="register"]');
            console.log(`Found ${registerLinks.length} registration links to handle`);
            
            registerLinks.forEach((link, index) => {
                console.log(`Setting up register link ${index + 1}:`, link);
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Hide login section
                    const loginSection = document.querySelector('.login-section');
                    if (loginSection) {
                        loginSection.style.display = 'none';
                    }
                    
                    // Open register modal
                    const registerModal = document.getElementById('register-modal');
                    if (registerModal) {
                        console.log('Opening register modal');
                        openModal(registerModal);
                    } else {
                        console.error('Register modal not found!');
                    }
                });
            });
        }
    }, 300);
    
    // Login/Register Modal Functionality
    setupAuthModals();
    
    // Setup Form Event Listeners
    setupAuthForms();

    // Check if user is logged in
    checkAuthStatus();

    // User menu toggle
    setupUserMenu();

    // Check for remembered login
    checkRememberedLogin();
    
    // Check if we're on admin dashboard and verify admin access
    if (window.location.pathname.includes('admin-dashboard')) {
        verifyAdminAccess();
    }
    
    // Setup main page login form
    setupMainPageLogin();

    // Setup credential autofill buttons
    setupCredentialAutoFill();

    // Setup UI enhancements
    setupPasswordVisibility();
    setupPasswordStrengthIndicator();
    setupFormValidation();
    setupInfoToggle();

    // Initialize session management
    sessionManager.init();

    // Initialize when DOM is ready
    console.log('Initializing authentication system...');
    
    // Listen for auth events
    window.addEventListener('auth:login', (e) => {
        const user = e.detail;
        console.log('User logged in:', user);
        
        // Redirect to dashboard or update UI
        if (window.location.pathname === '/' || 
            window.location.pathname.includes('index.html')) {
            window.location.href = '/user-dashboard.html';
    } else {
            updateUserUI(user);
        }
    });
    
    // Add real-time validation to password inputs
    document.querySelectorAll('input[type="password"]').forEach(input => {
        if (input.id === 'register-password') {
            input.addEventListener('input', () => {
                const strength = checkPasswordStrength(input.value);
                updatePasswordStrengthIndicator(input, strength);
            });
        }
    });
    
    console.log('Auth system initialized');
});

// Setup info toggle for default credentials box
function setupInfoToggle() {
    document.querySelectorAll('.toggle-info').forEach(button => {
        button.addEventListener('click', function() {
            const infoBox = this.closest('.default-credentials-info');
            const content = infoBox.querySelector('.info-content');
            const icon = this.querySelector('i');
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    });
}

// Setup auto-fill functionality for credentials
function setupCredentialAutoFill() {
    const autoFillButtons = document.querySelectorAll('.auto-fill-btn');
    if (autoFillButtons.length === 0) return;
    
    autoFillButtons.forEach(button => {
        button.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            const password = this.getAttribute('data-password');
            
            // Find the closest form
            const form = this.closest('.auth-modal-content')?.querySelector('form') || 
                          this.closest('.login-content')?.querySelector('form');
            
            if (!form) return;
            
            // Find email and password fields in the form
            const emailField = form.querySelector('input[type="email"]');
            const passwordField = form.querySelector('input[type="password"]');
            
            // Fill the fields if they exist
            if (emailField) emailField.value = email;
            if (passwordField) passwordField.value = password;
            
            // Optional: Show a success message
            const formFeedback = form.querySelector('.form-feedback');
            if (formFeedback) {
                formFeedback.textContent = 'Credentials filled automatically. Click "Log In" to continue.';
                formFeedback.style.color = '#2ecc71';
            setTimeout(() => {
                    formFeedback.textContent = '';
                }, 3000);
            }
        });
    });
}

// Show form messages
function showFormMessage(container, message, type = 'info') {
    // Create message element if it doesn't exist
    let messageEl = container.querySelector('.credentials-message');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.className = 'credentials-message';
        container.appendChild(messageEl);
    }
    
    // Set message content and type
    messageEl.textContent = message;
    messageEl.className = `credentials-message ${type}`;
    
    // Show message
    messageEl.style.opacity = '1';
    
    // Hide after 3 seconds
                setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => {
            messageEl.remove();
        }, 300);
    }, 3000);
}

// Setup enhanced password strength indicator
function setupPasswordStrengthIndicator() {
    const passwordInput = document.getElementById('register-password');
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        
        // Update strength bar
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text span');
        
        if (strengthBar && strengthText) {
            // Update bar width and color
            let color = '';
            let width = '';
            let text = '';
            
            switch (strength) {
                case 0:
                    color = '#e74c3c';
                    width = '20%';
                    text = 'Very weak';
                    break;
                case 1:
                    color = '#e67e22';
                    width = '40%';
                    text = 'Weak';
                    break;
                case 2:
                    color = '#f1c40f';
                    width = '60%';
                    text = 'Medium';
                    break;
                case 3:
                    color = '#2ecc71';
                    width = '80%';
                    text = 'Strong';
                    break;
                case 4:
                    color = '#27ae60';
                    width = '100%';
                    text = 'Very strong';
                    break;
                default:
                    color = '#ccc';
                    width = '0';
                    text = 'Not set';
            }
            
            strengthBar.style.width = width;
            strengthBar.style.backgroundColor = color;
            strengthText.textContent = text;
            
            // Update requirements list
            updatePasswordRequirements(password);
        }
    });
    
    function updatePasswordRequirements(password) {
        // Check each requirement
        const hasLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);
        
        // Update requirement indicators
        updateRequirement('length', hasLength);
        updateRequirement('uppercase', hasUpperCase);
        updateRequirement('lowercase', hasLowerCase);
        updateRequirement('number', hasNumber);
        updateRequirement('special', hasSpecial);
    }
    
    function updateRequirement(requirement, isMet) {
        const reqElement = document.querySelector(`[data-requirement="${requirement}"]`);
        if (!reqElement) return;
        
        const icon = reqElement.querySelector('i');
        if (!icon) return;
        
        if (isMet) {
            reqElement.classList.add('met');
            icon.className = 'fas fa-check-circle';
        } else {
            reqElement.classList.remove('met');
            icon.className = 'fas fa-circle';
        }
    }
}

// Setup form validation with visual indicators
function setupFormValidation() {
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });
        
        input.addEventListener('blur', function() {
            validateInput(this, true);
        });
    });
    
    function validateInput(input, showError = false) {
        const indicator = input.parentElement.querySelector('.field-validity-indicator');
        if (!indicator) return;
        
        if (input.checkValidity()) {
            indicator.innerHTML = '<i class="fas fa-check"></i>';
            indicator.className = 'field-validity-indicator valid';
            input.parentElement.classList.remove('error');
                } else {
            if (showError && input.value) {
                indicator.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
                indicator.className = 'field-validity-indicator invalid';
                input.parentElement.classList.add('error');
        } else {
                indicator.innerHTML = '';
                indicator.className = 'field-validity-indicator';
                input.parentElement.classList.remove('error');
            }
        }
    }
}

// --- START: Hardcoded User Check ---
function handleUserLogin(email, password, rememberMe) {
    const hardcodedUserEmail = "user@gmail.com";
    const hardcodedUserPassword = "user123";
    
    if (email === hardcodedUserEmail && password === hardcodedUserPassword) {
        console.log('Hardcoded user login successful');
        
        // Create user object
        const userData = {
            id: 'user-hardcoded',
            name: 'Demo User',
            email: hardcodedUserEmail,
            role: 'user',
            lastLogin: new Date().toISOString()
        };
            
        // Generate JWT-like token with expiration
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 24); // 24 hour expiration
        const authToken = {
            token: 'user-demo-token-' + Date.now(),
            provider: 'email',
            userId: userData.id,
            exp: expiration.getTime(),
            iat: Date.now()
        };
            
        // Save session
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('authToken', JSON.stringify(authToken));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('lastLogin', userData.lastLogin);
        localStorage.setItem('userRole', 'user');
        
        // Handle remember me option
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
            } else {
            localStorage.removeItem('rememberedEmail');
        }
        
        return { success: true, userData, authToken };
    }
    
    return { success: false };
}
// --- END: Hardcoded User Check ---

/**
 * Verifies that the current user has admin access
 * Redirects to user dashboard if not an admin
 */
function verifyAdminAccess() {
    // Check if admin redirect is in progress - don't interrupt it
    if (window.adminRedirectInProgress) {
        console.log('Admin redirect already in progress, skipping verification');
        return;
    }
    
    // Check multiple auth indicators to be more robust
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const hasToken = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    if (!isAuthenticated && !hasToken) {
        console.warn('User not authenticated, redirecting to login');
        window.location.replace('index.html');
        return;
    }
    
    // Check if user has admin role - check multiple sources
    try {
        // Try to get user data from multiple possible storage locations
        let currentUser = null;
        let userRole = localStorage.getItem('userRole');
        
        // Try to parse from currentUser
        try {
            currentUser = JSON.parse(localStorage.getItem('currentUser'));
        } catch (e) {
            // Try alternate storage location
            try {
                currentUser = JSON.parse(localStorage.getItem('user'));
            } catch (e2) {
                console.warn('Could not parse user data');
            }
        }
        
        // If we have user data, check role
        if (currentUser && currentUser.role === 'admin') {
            console.log('Admin access verified via currentUser');
            return; // Admin access confirmed
        }
        
        // Check if userRole is admin
        if (userRole === 'admin') {
            console.log('Admin access verified via userRole');
            return; // Admin access confirmed
        }
        
        // If we reach here, user is not an admin
        console.warn('User does not have admin privileges');
        window.location.replace('user-dashboard.html');
    } catch (error) {
        console.error('Error verifying admin access:', error);
        // Don't redirect immediately on error - this could be causing the issue
        // Instead, try to recover by checking if we're in an admin redirect flow
        if (!window.adminRedirectInProgress) {
            window.location.replace('index.html');
        }
    }
}

    // Initialize session management
    sessionManager.init();

    // Initialize when DOM is ready
    console.log('Initializing authentication system...');
    
    // Listen for auth events
    window.addEventListener('auth:login', (e) => {
        const user = e.detail;
        console.log('User logged in:', user);
        
        // Redirect to dashboard or update UI
        if (window.location.pathname === '/' || 
            window.location.pathname.includes('index.html')) {
            window.location.href = '/user-dashboard.html';
        } else {
            updateUserUI(user);
        }
    });
    
    // Add real-time validation to password inputs
    document.querySelectorAll('input[type="password"]').forEach(input => {
        if (input.id === 'register-password') {
            input.addEventListener('input', () => {
                const strength = checkPasswordStrength(input.value);
                updatePasswordStrengthIndicator(input, strength);
            });
        }
    });
    
    console.log('Auth system initialized');
});

// Performance monitoring
const performanceMetrics = {
    startTime: null,
    endTime: null,
    measureLoginTime() {
        this.startTime = performance.now();
    },
    recordLoginTime() {
        this.endTime = performance.now();
        const loginTime = this.endTime - this.startTime;
        console.log(`Login completed in ${loginTime.toFixed(2)}ms`);
        // Store in localStorage for analytics
        localStorage.setItem('lastLoginTime', loginTime);
    }
};

// Enhanced preloading strategy with priority
function preloadDashboards() {
    // Define critical resources with priority
    const criticalResources = [
        { url: 'user-dashboard.html', priority: 'high' },
            }, 300));
        }
    });
    
    // Password confirmation match validation
    const confirmPasswordInputs = document.querySelectorAll('input[name="confirm-password"]');
    confirmPasswordInputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            const passwordInput = input.closest('form').querySelector('input[type="password"]:not([name="confirm-password"])');
            if (passwordInput && input.value !== passwordInput.value) {
                showInputError(input, 'Passwords do not match');
    } else {
                clearInputError(input);
            }
        }, 300));
    });
    
    // Setup remember me functionality
    const rememberMeCheckboxes = document.querySelectorAll('input[type="checkbox"][id*="remember"]');
    rememberMeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (!checkbox.checked) {
                localStorage.removeItem('rememberedUser');
            }
        });
    });
    
    // Setup OAuth buttons and functionality
    if (typeof setupOAuth === 'function') {
        setupOAuth();
    }
    
    console.log('Auth forms and listeners setup complete');
}

// Validate a single input field
function validateSingleInput(input) {
    // Skip validation for non-required fields if empty
    if (!input.hasAttribute('required') && !input.value.trim()) {
        clearInputError(input);
        return true;
    }
    
    // Empty required field
    if (input.hasAttribute('required') && !input.value.trim()) {
        showInputError(input, 'This field is required');
        return false;
    }
    
    // Email validation
    if (input.type === 'email' && !validateEmail(input.value.trim())) {
        showInputError(input, 'Please enter a valid email address');
        return false;
    }
    
    // Password validation
    if (input.type === 'password' && !input.name?.includes('confirm') && !input.id?.includes('confirm')) {
        if (input.value.length < 6) {
            showInputError(input, 'Password must be at least 6 characters');
            return false;
        }
    }
    
    // Password confirmation validation
    if (input.name === 'confirm-password' || input.id?.includes('confirm')) {
        const passwordInput = input.closest('form').querySelector('input[type="password"]:not([name="confirm-password"])');
        if (passwordInput && input.value !== passwordInput.value) {
            showInputError(input, 'Passwords do not match');
            return false;
        }
    }
    
    // All validation passed
    clearInputError(input);
    return true;
}

// Setup user menu toggle and dropdown functionality
function setupUserMenu() {
    const userMenuButtons = document.querySelectorAll('.user-menu-button');
    const userMenuDropdowns = document.querySelectorAll('.user-menu-dropdown');
    
    // Toggle user menu dropdown
    userMenuButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const dropdown = button.nextElementSibling;
            const isOpen = dropdown.classList.contains('active');
            
            // Close all dropdowns first
            userMenuDropdowns.forEach(menu => {
                menu.classList.remove('active');
            });
            
            // Toggle current dropdown
            if (!isOpen) {
                dropdown.classList.add('active');
                // Add aria attributes for accessibility
                button.setAttribute('aria-expanded', 'true');
                dropdown.setAttribute('aria-hidden', 'false');
            } else {
                button.setAttribute('aria-expanded', 'false');
                dropdown.setAttribute('aria-hidden', 'true');
            }
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
            userMenuDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            
            userMenuButtons.forEach(button => {
                button.setAttribute('aria-expanded', 'false');
            });
        }
    });
    
    // Close dropdown when pressing escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            userMenuDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            
            userMenuButtons.forEach(button => {
                button.setAttribute('aria-expanded', 'false');
            });
        }
    });
    
    // Initialize aria attributes
    userMenuButtons.forEach(button => {
        button.setAttribute('aria-haspopup', 'true');
        button.setAttribute('aria-expanded', 'false');
        
        const dropdown = button.nextElementSibling;
        if (dropdown) {
            dropdown.setAttribute('aria-hidden', 'true');
        }
    });
}

window.addEventListener('load', function() {
    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 100);
    }
});