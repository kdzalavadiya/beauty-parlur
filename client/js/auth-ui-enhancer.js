/**
 * Auth UI Enhancer - Additional features for improved authentication UI
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth UI Enhancer: Initializing...');
    
    try {
        // Setup default credentials UI handlers
        setupCredentialsToggle();
        setupAutoFill();
        setupPasswordVisibilityToggles();
        setupPasswordStrengthMeter();
        
        // Fix any known issues with the DOM
        fixDomIssues();
        
        // Validate the integration with auth.js
        validateAuthIntegration();
        
        // Fix login button event handlers
        fixLoginButtonHandlers();
        
        // Apply last-resort fixes after a short delay
        setTimeout(applyLastResortFixes, 500);
        
        console.log('Auth UI Enhancer: Initialization complete');
    } catch (error) {
        console.error('Auth UI Enhancer: Initialization failed', error);
    }
});

/**
 * Set up toggle functionality for the default credentials info box
 */
function setupCredentialsToggle() {
    // Set initial closed state for all info boxes
    document.querySelectorAll('.default-credentials-info').forEach(infoBox => {
        const content = infoBox.querySelector('.info-content');
        const toggleIcon = infoBox.querySelector('.toggle-info i');
        if (content && toggleIcon) {
            content.style.maxHeight = null;
            toggleIcon.className = 'fas fa-chevron-down';
        }
    });

    document.querySelectorAll('.toggle-info, .info-header').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Don't toggle if clicking on the auto-fill button
            if (e.target.closest('.auto-fill-btn')) return;
            
            // Find the info content section
            const infoBox = toggle.closest('.default-credentials-info');
            if (!infoBox) return;
            
            const infoContent = infoBox.querySelector('.info-content');
            const toggleIcon = infoBox.querySelector('.toggle-info i');
            if (!infoContent || !toggleIcon) return;
            
            // Toggle the content visibility
            if (infoContent.style.maxHeight) {
                infoContent.style.maxHeight = null;
                toggleIcon.className = 'fas fa-chevron-down';
                toggle.setAttribute('aria-expanded', 'false');
            } else {
                infoContent.style.maxHeight = infoContent.scrollHeight + 'px';
                toggleIcon.className = 'fas fa-chevron-up';
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/**
 * Set up auto-fill functionality for demo credentials
 */
function setupAutoFill() {
    document.querySelectorAll('.auto-fill-btn').forEach(button => {
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
            
            // Fill the fields if they exist and trigger events for better UI feedback
            if (emailField) {
                emailField.value = email;
                emailField.focus();
                emailField.dispatchEvent(new Event('input', { bubbles: true }));
                emailField.classList.add('filled');
            }
            
            if (passwordField) {
                passwordField.value = password;
                passwordField.dispatchEvent(new Event('input', { bubbles: true }));
                passwordField.classList.add('filled');
            }
            
            // Set remember me checkbox
            const rememberMe = form.querySelector('input[type="checkbox"][id*="remember"]');
            if (rememberMe) {
                rememberMe.checked = true;
                rememberMe.dispatchEvent(new Event('change', { bubbles: true }));
            }
            
            // Show feedback message
            showFeedback(form, 'Credentials filled! Click "Log In" to continue.', 'success');
        });
    });
}

/**
 * Set up password visibility toggle buttons
 */
function setupPasswordVisibilityToggles() {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordField = this.closest('.password-input-container').querySelector('input');
            const icon = this.querySelector('i');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.className = 'fas fa-eye-slash';
                toggle.setAttribute('aria-label', 'Hide password');
                
                // Auto-hide after 5 seconds for security
                setTimeout(() => {
                    if (passwordField.type === 'text') {
                        passwordField.type = 'password';
                        icon.className = 'fas fa-eye';
                        toggle.setAttribute('aria-label', 'Show password');
                    }
                }, 5000);
            } else {
                passwordField.type = 'password';
                icon.className = 'fas fa-eye';
                toggle.setAttribute('aria-label', 'Show password');
            }
        });
    });
}

/**
 * Set up password strength meter functionality
 */
function setupPasswordStrengthMeter() {
    const passwordInput = document.getElementById('register-password');
    if (!passwordInput) return;
    
    // Initialize empty state
    updatePasswordStrengthUI('', 0);
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        updatePasswordStrengthUI(password, strength);
    });
}

/**
 * Check password strength and return a score from 0-4
 * @param {string} password - The password to check
 * @returns {number} - Strength score (0: very weak, 4: very strong)
 */
function checkPasswordStrength(password) {
    if (!password) return 0;
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    // Normalize score to 0-4 range
    return Math.min(4, Math.floor(score / 2));
}

/**
 * Update password strength UI based on password and strength score
 * @param {string} password - The password
 * @param {number} strength - The strength score (0-4)
 */
function updatePasswordStrengthUI(password, strength) {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text span');
    if (!strengthBar || !strengthText) return;
    
    // Update requirements list
    updatePasswordRequirements(password);
    
    // Update strength bar
    let color, width, text;
    
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
}

/**
 * Update password requirements list based on password
 * @param {string} password - The password to check against requirements
 */
function updatePasswordRequirements(password) {
    // Check each requirement
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    // Update each requirement indicator
    updateRequirement('length', hasLength);
    updateRequirement('uppercase', hasUppercase);
    updateRequirement('lowercase', hasLowercase);
    updateRequirement('number', hasNumber);
    updateRequirement('special', hasSpecial);
}

/**
 * Update a single password requirement indicator
 * @param {string} requirement - The requirement identifier
 * @param {boolean} isMet - Whether the requirement is met
 */
function updateRequirement(requirement, isMet) {
    const reqItem = document.querySelector(`[data-requirement="${requirement}"]`);
    if (!reqItem) return;
    
    const icon = reqItem.querySelector('i');
    if (!icon) return;
    
    if (isMet) {
        reqItem.classList.add('met');
        icon.className = 'fas fa-check-circle';
    } else {
        reqItem.classList.remove('met');
        icon.className = 'fas fa-circle';
    }
}

/**
 * Show feedback message in a form
 * @param {Element} form - The form element to show feedback in
 * @param {string} message - The message to display
 * @param {string} type - The message type (success, error, info)
 */
function showFeedback(form, message, type = 'info') {
    const feedbackEl = form.querySelector('.form-feedback');
    if (!feedbackEl) return;
    
    feedbackEl.textContent = message;
    feedbackEl.className = `form-feedback ${type}`;
    
    // Make sure it's visible
    feedbackEl.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        feedbackEl.textContent = '';
        feedbackEl.className = 'form-feedback';
    }, 5000);
}

/**
 * Fix any known issues with the DOM structure
 */
function fixDomIssues() {
    console.log('Auth UI Enhancer: Fixing DOM issues...');
    
    // Make sure all form-feedback elements exist
    document.querySelectorAll('form').forEach(form => {
        if (!form.querySelector('.form-feedback')) {
            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'form-feedback';
            
            // Insert after form groups, before submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                form.insertBefore(feedbackDiv, submitBtn);
                console.log('Auth UI Enhancer: Added missing form-feedback element to form');
            }
        }
    });
    
    // Make sure all info-content elements have proper height when expanded
    document.querySelectorAll('.info-header[aria-expanded="true"]').forEach(header => {
        const infoBox = header.closest('.default-credentials-info');
        if (!infoBox) return;
        
        const infoContent = infoBox.querySelector('.info-content');
        if (!infoContent) return;
        
        if (!infoContent.style.maxHeight) {
            infoContent.style.maxHeight = infoContent.scrollHeight + 'px';
            console.log('Auth UI Enhancer: Fixed expanded info-content height');
        }
    });
}

/**
 * Validate the integration with auth.js
 */
function validateAuthIntegration() {
    console.log('Auth UI Enhancer: Validating auth.js integration...');
    
    // Check if main login form event listener is working
    const mainLoginForm = document.getElementById('main-login-form');
    const loginForm = document.getElementById('login-form');
    
    if (mainLoginForm && !mainLoginForm._hasAuthListener) {
        console.warn('Auth UI Enhancer: Main login form missing event listener, adding backup');
        
        mainLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            
            // Check hardcoded credentials
            validateLogin(email, password, this);
        });
        
        mainLoginForm._hasAuthListener = true;
    }
    
    if (loginForm && !loginForm._hasAuthListener) {
        console.warn('Auth UI Enhancer: Login form missing event listener, adding backup');
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            
            // Check hardcoded credentials
            validateLogin(email, password, this);
        });
        
        loginForm._hasAuthListener = true;
    }
}

/**
 * Validate login with hardcoded credentials
 * @param {string} email - The email to validate
 * @param {string} password - The password to validate
 * @param {Element} form - The form element
 */
function validateLogin(email, password, form) {
    console.log('Auth UI Enhancer: Validating login credentials...', email, password);
    
    // Check for admin credentials
    if (email === 'admin@gmail.com' && password === 'admin123') {
        showFeedback(form, 'Admin login successful! Redirecting...', 'success');
        
        // Save admin session
        saveUserSession(email, 'admin');
        
        // Set remember me if checkbox is checked
        const rememberMe = form.querySelector('input[type="checkbox"][id*="remember"]');
        if (rememberMe && rememberMe.checked) {
            localStorage.setItem('rememberedEmail', email);
        }
        
        console.log('Auth UI Enhancer: Admin login successful, redirecting...');
        
        // Use both setTimeout and direct redirection to ensure it works
        try {
            setTimeout(() => {
                console.log('Auth UI Enhancer: Redirecting to admin dashboard...');
                window.location.href = 'admin-dashboard.html';
            }, 1000);
            
            // Also attempt immediate redirection
            setTimeout(() => {
                if (window.location.href.indexOf('admin-dashboard.html') === -1) {
                    console.log('Auth UI Enhancer: Immediate admin redirect');
                    window.location.replace('admin-dashboard.html');
                }
            }, 100);
        } catch (e) {
            console.error('Auth UI Enhancer: Redirection error', e);
            // Direct fallback
            window.location = 'admin-dashboard.html';
        }
        return true;
    }
    
    // Check for test user credentials
    if (email === 'test@gmail.com' && password === 'test123') {
        showFeedback(form, 'Test user login successful! Redirecting...', 'success');
        
        // Save test user session as regular user
        saveUserSession(email, 'user');
        
        // Set remember me if checkbox is checked
        const rememberMe = form.querySelector('input[type="checkbox"][id*="remember"]');
        if (rememberMe && rememberMe.checked) {
            localStorage.setItem('rememberedEmail', email);
        }
        
        console.log('Auth UI Enhancer: Test user login successful, redirecting...');
        
        // Use both setTimeout and direct redirection to ensure it works
        try {
            setTimeout(() => {
                console.log('Auth UI Enhancer: Redirecting to user dashboard...');
                window.location.href = 'user-dashboard.html';
            }, 1000);
            
            // Also attempt immediate redirection
            setTimeout(() => {
                if (window.location.href.indexOf('user-dashboard.html') === -1) {
                    console.log('Auth UI Enhancer: Immediate user redirect');
                    window.location.replace('user-dashboard.html');
                }
            }, 100);
        } catch (e) {
            console.error('Auth UI Enhancer: Redirection error', e);
            // Direct fallback
            window.location = 'user-dashboard.html';
        }
        return true;
    }
    
    // Check for user credentials
    if (email === 'user@gmail.com' && password === 'user123') {
        showFeedback(form, 'Login successful! Redirecting...', 'success');
        
        // Save user session
        saveUserSession(email, 'user');
        
        // Set remember me if checkbox is checked
        const rememberMe = form.querySelector('input[type="checkbox"][id*="remember"]');
        if (rememberMe && rememberMe.checked) {
            localStorage.setItem('rememberedEmail', email);
        }
        
        console.log('Auth UI Enhancer: User login successful, redirecting...');
        
        // Use both setTimeout and direct redirection to ensure it works
        try {
            setTimeout(() => {
                console.log('Auth UI Enhancer: Redirecting to user dashboard...');
                window.location.href = 'user-dashboard.html';
            }, 1000);
            
            // Also attempt immediate redirection
            setTimeout(() => {
                if (window.location.href.indexOf('user-dashboard.html') === -1) {
                    console.log('Auth UI Enhancer: Immediate user redirect');
                    window.location.replace('user-dashboard.html');
                }
            }, 100);
        } catch (e) {
            console.error('Auth UI Enhancer: Redirection error', e);
            // Direct fallback
            window.location = 'user-dashboard.html';
        }
        return true;
    }
    
    // No match found
    showFeedback(form, 'Invalid email or password. Try using the demo credentials.', 'error');
    return false;
}

/**
 * Save user session data to localStorage
 * @param {string} email - User email
 * @param {string} role - User role (admin or user)
 */
function saveUserSession(email, role) {
    console.log(`Auth UI Enhancer: Saving ${role} session data`);
    
    // Create user object
    const user = {
        id: `${role}-hardcoded`,
        name: role === 'admin' ? 'Admin User' : 'Demo User',
        email: email,
        role: role,
        lastLogin: new Date().toISOString()
    };
    
    // Generate token with expiration
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 24); // 24 hour expiration
    const authToken = {
        token: `${role}-demo-token-${Date.now()}`,
        provider: 'email',
        userId: user.id,
        exp: expiration.getTime(),
        iat: Date.now()
    };
    
    // Save to localStorage
    try {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', JSON.stringify(authToken));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('lastLogin', user.lastLogin);
        localStorage.setItem('userRole', role);
        
        console.log('Auth UI Enhancer: Session data saved successfully');
        return true;
    } catch (error) {
        console.error('Auth UI Enhancer: Failed to save session data', error);
        return false;
    }
}

/**
 * Fix login button event handlers to ensure they properly show the login section
 */
function fixLoginButtonHandlers() {
    console.log('Auth UI Enhancer: Setting up login button handlers');
    
    // Much more comprehensive list of potential button selectors
    const selectors = [
        '.auth-btn.open-login', 
        '.login-btn', 
        '.btn-login', 
        'button[class*="login"]',
        'a[class*="login"]',
        '.nav-actions .auth-btn',
        '.sidebar-auth .auth-btn',
        '.logged-out-only .auth-btn'
    ];
    
    // Custom text content matching
    document.querySelectorAll('button, a').forEach(el => {
        const text = el.textContent.trim().toLowerCase();
        if (text.includes('login') || 
            text.includes('log in') || 
            text.includes('sign in') || 
            text.includes('signin')) {
            setupLoginHandler(el);
        }
    });
    
    // Try standard selectors
    selectors.forEach(selector => {
        try {
            document.querySelectorAll(selector).forEach(button => {
                setupLoginHandler(button);
            });
        } catch (e) {
            console.warn(`Auth UI Enhancer: Invalid selector "${selector}"`, e);
        }
    });
    
    // Direct DOM inspection as last resort
    console.log('Auth UI Enhancer: Performing direct DOM inspection for login buttons');
    
    // Check navigation links
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const loginElements = Array.from(navLinks.querySelectorAll('*')).filter(el => 
            el.textContent.trim().toLowerCase().includes('login') || 
            el.textContent.trim().toLowerCase().includes('log in')
        );
        
        loginElements.forEach(el => setupLoginHandler(el));
    }
    
    // Check sidebar 
    const sidebar = document.querySelector('.mobile-sidebar');
    if (sidebar) {
        const sidebarAuth = sidebar.querySelector('.sidebar-auth');
        if (sidebarAuth) {
            const sidebarButtons = sidebarAuth.querySelectorAll('a, button');
            sidebarButtons.forEach(btn => setupLoginHandler(btn));
        }
    }
    
    // Look for specific buttons by analyzing HTML structure
    document.querySelectorAll('.nav-actions button, .nav-actions .auth-btn').forEach(btn => {
        setupLoginHandler(btn);
    });
    
    // Debug output
    const allButtons = document.querySelectorAll('button, a');
    const loginRelatedButtons = Array.from(allButtons).filter(btn => 
        btn.textContent.toLowerCase().includes('login') || 
        btn.textContent.toLowerCase().includes('log in') ||
        (btn.className && btn.className.includes('login')) ||
        (btn.className && btn.className.includes('auth'))
    );
    
    console.log(`Auth UI Enhancer: Found ${loginRelatedButtons.length} potential login buttons out of ${allButtons.length} total`);
    
    // Direct fix for specific known button if present
    const specificLoginButton = document.querySelector('button.auth-btn.open-login');
    if (specificLoginButton) {
        console.log('Auth UI Enhancer: Found specific login button, attaching handler');
        setupLoginHandler(specificLoginButton);
    }
}

/**
 * Set up a login button handler
 * @param {Element} button - The button element
 */
function setupLoginHandler(button) {
    if (button._hasLoginHandler) return;
    
    // Remove existing event listeners by cloning and replacing
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    newButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Auth UI Enhancer: Login button clicked', this);
        
        // Try showing login modal first
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            console.log('Auth UI Enhancer: Showing login modal');
            showModal(loginModal);
            return;
        }
        
        // If no modal, try showing login section
        const loginSection = document.querySelector('.login-section');
        if (loginSection) {
            console.log('Auth UI Enhancer: Showing login section');
            loginSection.style.display = 'block';
            
            // Scroll to login section
            loginSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error('Auth UI Enhancer: No login section or modal found');
            alert('Login functionality is not available. Please try again later.');
        }
    });
    
    newButton._hasLoginHandler = true;
    console.log('Auth UI Enhancer: Added handler to login button', newButton);
}

/**
 * Show a modal by adding active class
 * @param {Element} modal - The modal element to show
 */
function showModal(modal) {
    // Close any open modals first
    document.querySelectorAll('.auth-modal.active').forEach(openModal => {
        openModal.classList.remove('active');
    });
    
    // Show the target modal
    modal.classList.add('active');
    
    // Add event listeners to close buttons inside this modal
    modal.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

/**
 * Fix login buttons
 * Make this more robust by handling all possible forms and submission methods
 */
function fixAllLoginForms() {
    console.log('Auth UI Enhancer: Fixing all login forms');
    
    // Find all potential login forms
    const loginForms = document.querySelectorAll('form');
    
    loginForms.forEach(form => {
        // Skip if already handled
        if (form._hasGlobalFormHandler) return;
        
        // Check if it has email and password fields - likely a login form
        const hasEmail = form.querySelector('input[type="email"]') || 
                         form.querySelector('input[name="email"]') || 
                         form.querySelector('input[id*="email"]');
                         
        const hasPassword = form.querySelector('input[type="password"]') || 
                           form.querySelector('input[name="password"]') || 
                           form.querySelector('input[id*="password"]');
        
        if (hasEmail && hasPassword) {
            console.log('Auth UI Enhancer: Adding global handler to login form', form);
            
            // Add our own submit handler that will be comprehensive
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Auth UI Enhancer: Login form submitted');
                
                const emailInput = this.querySelector('input[type="email"]') || 
                                  this.querySelector('input[name="email"]') || 
                                  this.querySelector('input[id*="email"]');
                
                const passwordInput = this.querySelector('input[type="password"]') || 
                                     this.querySelector('input[name="password"]') || 
                                     this.querySelector('input[id*="password"]');
                
                if (emailInput && passwordInput) {
                    // Directly attempt validation
                    validateLogin(emailInput.value, passwordInput.value, this);
                } else {
                    console.error('Auth UI Enhancer: Could not find email or password inputs');
                }
            });
            
            // Also handle the submit button directly in case form submission is blocked
            const submitBtn = form.querySelector('button[type="submit"]') || 
                             form.querySelector('input[type="submit"]') ||
                             form.querySelector('button.login-submit-btn') ||
                             form.querySelector('button:last-child');
                             
            if (submitBtn && !submitBtn._hasDirectHandler) {
                submitBtn.addEventListener('click', function(e) {
                    // Don't prevent default here - let both this and normal form submission try
                    console.log('Auth UI Enhancer: Submit button clicked directly');
                    
                    const form = this.closest('form');
                    if (!form) return;
                    
                    const emailInput = form.querySelector('input[type="email"]') || 
                                      form.querySelector('input[name="email"]') || 
                                      form.querySelector('input[id*="email"]');
                    
                    const passwordInput = form.querySelector('input[type="password"]') || 
                                         form.querySelector('input[name="password"]') || 
                                         form.querySelector('input[id*="password"]');
                    
                    if (emailInput && passwordInput) {
                        validateLogin(emailInput.value, passwordInput.value, form);
                    } else {
                        console.error('Auth UI Enhancer: Could not find email or password inputs');
                    }
                });
                submitBtn._hasDirectHandler = true;
            }
            
            form._hasGlobalFormHandler = true;
        }
    });
}

/**
 * Apply last-resort fixes for persistent issues
 */
function applyLastResortFixes() {
    console.log('Auth UI Enhancer: Applying last-resort fixes');
    
    // Fix all login forms first - this is high priority
    fixAllLoginForms();
    
    // Add global click handler for login/signup text
    document.addEventListener('click', function(e) {
        // Check if the clicked element or its parent contains login-related text
        let target = e.target;
        let maxDepth = 3;
        let depth = 0;
        
        while (target && depth < maxDepth) {
            // Check text content
            if (target.textContent) {
                const text = target.textContent.trim().toLowerCase();
                if (
                    text === 'login' || 
                    text === 'log in' || 
                    text === 'sign in' || 
                    text === 'login/signup' ||
                    text === 'log in / sign up' ||
                    text === 'signup' ||
                    text === 'sign up' ||
                    text === 'register'
                ) {
                    console.log('Auth UI Enhancer: Login/Signup text clicked', target);
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (text === 'signup' || text === 'sign up' || text === 'register') {
                        showSignupInterface();
                    } else {
                        showLoginInterface();
                    }
                    return;
                }
            }
            
            // Check class names
            if (target.className && typeof target.className === 'string') {
                if (
                    target.className.includes('login') || 
                    target.className.includes('auth') ||
                    target.className.includes('sign-in') ||
                    target.className.includes('signup') ||
                    target.className.includes('register')
                ) {
                    console.log('Auth UI Enhancer: Element with login/signup class clicked', target);
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (target.className.includes('signup') || target.className.includes('register')) {
                        showSignupInterface();
                    } else {
                        showLoginInterface();
                    }
                    return;
                }
            }

            // Check for close buttons
            if ((target.id && target.id.includes('close')) || 
                (target.className && typeof target.className === 'string' && target.className.includes('close')) ||
                (target.getAttribute('aria-label') && target.getAttribute('aria-label').toLowerCase().includes('close'))) {
                
                console.log('Auth UI Enhancer: Close button clicked', target);
                e.preventDefault();
                e.stopPropagation();
                
                // Find the closest modal or container
                const modalContainer = target.closest('.auth-modal') || 
                                       target.closest('#emergency-login-form') || 
                                       target.closest('.login-section');
                
                if (modalContainer) {
                    if (modalContainer.classList.contains('active')) {
                        modalContainer.classList.remove('active');
                    }
                    modalContainer.style.display = 'none';
                    
                    // Remove body class if it exists
                    document.body.classList.remove('show-login');
                    document.body.classList.remove('show-signup');
                }
                return;
            }
            
            target = target.parentElement;
            depth++;
        }
    });
    
    // Add keyboard shortcut (Alt+L) to show login
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'l') {
            console.log('Auth UI Enhancer: Login keyboard shortcut detected');
            e.preventDefault();
            showLoginInterface();
        }
    });
    
    // Create a floating login button if no other login buttons are found
    const loginButtons = document.querySelectorAll('.auth-btn, .login-btn, button.open-login');
    if (loginButtons.length === 0) {
        console.log('Auth UI Enhancer: No login buttons found, creating floating button');
        
        const floatingBtn = document.createElement('button');
        floatingBtn.className = 'floating-login-btn';
        floatingBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        floatingBtn.style.position = 'fixed';
        floatingBtn.style.bottom = '20px';
        floatingBtn.style.right = '20px';
        floatingBtn.style.zIndex = '9999';
        floatingBtn.style.padding = '10px 15px';
        floatingBtn.style.backgroundColor = '#f178b6';
        floatingBtn.style.color = 'white';
        floatingBtn.style.border = 'none';
        floatingBtn.style.borderRadius = '5px';
        floatingBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        floatingBtn.style.cursor = 'pointer';
        
        floatingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginInterface();
        });
        
        document.body.appendChild(floatingBtn);
    }

    // Fix all existing close buttons
    document.querySelectorAll('.close, .close-modal, .close-btn, [data-dismiss="modal"], .modal-close').forEach(closeBtn => {
        if (!closeBtn._hasCloseHandler) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Find the closest modal or container
                const modalContainer = this.closest('.auth-modal') || 
                                      this.closest('#emergency-login-form') ||
                                      this.closest('.login-section') ||
                                      this.closest('.modal');
                
                if (modalContainer) {
                    console.log('Auth UI Enhancer: Closing modal container', modalContainer);
                    if (modalContainer.classList.contains('active')) {
                        modalContainer.classList.remove('active');
                    }
                    modalContainer.style.display = 'none';
                    
                    // Remove body classes
                    document.body.classList.remove('show-login');
                    document.body.classList.remove('show-signup');
                }
            });
            closeBtn._hasCloseHandler = true;
        }
    });

    // Additional fix for all submit buttons
    document.querySelectorAll('button[type="submit"], input[type="submit"]').forEach(btn => {
        if (!btn._hasGlobalSubmitHandler) {
            btn.addEventListener('click', function(e) {
                const form = this.closest('form');
                if (!form) return;
                
                // Check if this button is in a login/auth form
                const formHasAuthFields = form.querySelector('input[type="password"]') &&
                                         (form.querySelector('input[type="email"]') || 
                                          form.querySelector('input[name="email"]') ||
                                          form.querySelector('input[id*="email"]'));
                                          
                if (formHasAuthFields) {
                    console.log('Auth UI Enhancer: Auth form submit clicked', this);
                    // Let the form submission continue, but also try our handler
                    const emailInput = form.querySelector('input[type="email"]') || 
                                      form.querySelector('input[name="email"]') || 
                                      form.querySelector('input[id*="email"]');
                    
                    const passwordInput = form.querySelector('input[type="password"]') || 
                                         form.querySelector('input[name="password"]') || 
                                         form.querySelector('input[id*="password"]');
                    
                    if (emailInput && passwordInput) {
                        // Let form submission continue but also validate directly
                        setTimeout(() => {
                            validateLogin(emailInput.value, passwordInput.value, form);
                        }, 10);
                    }
                }
            });
            btn._hasGlobalSubmitHandler = true;
        }
    });
}

/**
 * Show login interface (modal or section)
 */
function showLoginInterface() {
    // Try showing login modal first
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        console.log('Auth UI Enhancer: Showing login modal');
        
        // First hide any signup modals
        document.querySelectorAll('.auth-modal.active, #emergency-login-form, .signup-section.active').forEach(modal => {
            modal.classList.remove('active');
            modal.style.display = 'none';
        });
        
        // Then show login modal
        loginModal.classList.add('active');
        loginModal.style.display = 'block';
        return;
    }
    
    // If no modal, try showing login section
    const loginSection = document.querySelector('.login-section');
    if (loginSection) {
        console.log('Auth UI Enhancer: Showing login section');
        
        // Hide any other active sections
        document.querySelectorAll('.signup-section.active, .auth-modal.active, #emergency-login-form').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        
        loginSection.style.display = 'block';
        loginSection.classList.add('active');
        
        // Add class to body
        document.body.classList.remove('show-signup');
        document.body.classList.add('show-login');
        
        // Scroll to login section
        loginSection.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    // If no login section or modal exists, create a simple login form
    console.log('Auth UI Enhancer: No login interface found, creating one');
    createEmergencyLoginForm();
}

/**
 * Show signup interface (modal or section)
 */
function showSignupInterface() {
    // Try showing signup modal first
    const signupModal = document.getElementById('signup-modal') || document.getElementById('register-modal');
    if (signupModal) {
        console.log('Auth UI Enhancer: Showing signup modal');
        
        // First hide any login modals
        document.querySelectorAll('.auth-modal.active, #emergency-login-form, .login-section.active').forEach(modal => {
            modal.classList.remove('active');
            modal.style.display = 'none';
        });
        
        // Then show signup modal
        signupModal.classList.add('active');
        signupModal.style.display = 'block';
        return;
    }
    
    // If no modal, try showing signup section
    const signupSection = document.querySelector('.signup-section') || document.querySelector('.register-section');
    if (signupSection) {
        console.log('Auth UI Enhancer: Showing signup section');
        
        // Hide any login sections
        document.querySelectorAll('.login-section.active, .auth-modal.active, #emergency-login-form').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        
        signupSection.style.display = 'block';
        signupSection.classList.add('active');
        
        // Add class to body
        document.body.classList.remove('show-login');
        document.body.classList.add('show-signup');
        
        // Scroll to signup section
        signupSection.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    // If no signup interface exists, show a message in the login form or alert
    const emergencyForm = document.getElementById('emergency-login-form');
    if (emergencyForm && emergencyForm.style.display === 'block') {
        // Add a message to the emergency form
        const feedback = document.getElementById('emergency-feedback');
        if (feedback) {
            feedback.textContent = 'Sign up is not available in demo mode. Please use the demo credentials to log in.';
            feedback.style.color = '#e67e22';
        }
    } else {
        // Show login interface with a message about signup
        showLoginInterface();
        setTimeout(() => {
            const feedbacks = document.querySelectorAll('.form-feedback, #emergency-feedback');
            if (feedbacks.length > 0) {
                feedbacks[0].textContent = 'Sign up is not available in demo mode. Please use the demo credentials to log in.';
                feedbacks[0].style.color = '#e67e22';
            } else {
                alert('Sign up is not available in demo mode. Please use the demo credentials to log in.');
            }
        }, 500);
    }
}

/**
 * Create an emergency login form when no other login interface is found
 */
function createEmergencyLoginForm() {
    // Check if emergency form already exists
    if (document.getElementById('emergency-login-form')) {
        document.getElementById('emergency-login-form').style.display = 'block';
        return;
    }
    
    // Create form container
    const formContainer = document.createElement('div');
    formContainer.id = 'emergency-login-form';
    formContainer.style.position = 'fixed';
    formContainer.style.top = '0';
    formContainer.style.left = '0';
    formContainer.style.width = '100%';
    formContainer.style.height = '100%';
    formContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
    formContainer.style.zIndex = '10000';
    formContainer.style.display = 'flex';
    formContainer.style.justifyContent = 'center';
    formContainer.style.alignItems = 'center';
    
    // Create form
    formContainer.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; width: 90%; max-width: 400px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #333;">Login</h2>
                <button id="close-emergency-form" style="background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
            </div>
            
            <div style="margin-bottom: 15px; padding: 10px; background: #fff5f8; border: 1px solid #f178b6; border-radius: 5px;">
                <p style="margin: 0 0 10px 0;"><strong>Demo Credentials:</strong></p>
                <div style="margin-bottom: 8px;">
                    <div><strong>Admin:</strong> admin@gmail.com / admin123</div>
                    <button class="emergency-autofill" data-email="admin@gmail.com" data-password="admin123" 
                            style="background: #f178b6; color: white; border: none; border-radius: 3px; padding: 3px 8px; margin-top: 5px; cursor: pointer;">
                        Auto-fill
                    </button>
                </div>
                <div style="margin-bottom: 8px;">
                    <div><strong>Test User:</strong> test@gmail.com / test123</div>
                    <button class="emergency-autofill" data-email="test@gmail.com" data-password="test123" 
                            style="background: #f178b6; color: white; border: none; border-radius: 3px; padding: 3px 8px; margin-top: 5px; cursor: pointer;">
                        Auto-fill
                    </button>
                </div>
                <div>
                    <div><strong>User:</strong> user@gmail.com / user123</div>
                    <button class="emergency-autofill" data-email="user@gmail.com" data-password="user123"
                            style="background: #f178b6; color: white; border: none; border-radius: 3px; padding: 3px 8px; margin-top: 5px; cursor: pointer;">
                        Auto-fill
                    </button>
                </div>
            </div>
            
            <form id="emergency-form">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Email</label>
                    <input type="email" id="emergency-email" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Password</label>
                    <input type="password" id="emergency-password" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" id="emergency-remember" style="margin-right: 8px;">
                        Remember me
                    </label>
                </div>
                
                <div id="emergency-feedback" style="margin-bottom: 15px; min-height: 20px;"></div>
                
                <button type="submit" style="width: 100%; padding: 10px; background: #f178b6; color: white; border: none; border-radius: 4px; cursor: pointer;">Log In</button>
                
                <div style="margin-top: 15px; text-align: center;">
                    <a href="#" class="signup-link" style="color: #f178b6; text-decoration: none;">Don't have an account? Sign up</a>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(formContainer);
    
    // Set up close button
    document.getElementById('close-emergency-form').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        formContainer.style.display = 'none';
    });
    
    // Set up auto-fill buttons
    document.querySelectorAll('.emergency-autofill').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.getAttribute('data-email');
            const password = this.getAttribute('data-password');
            
            document.getElementById('emergency-email').value = email;
            document.getElementById('emergency-password').value = password;
        });
    });
    
    // Set up signup link
    formContainer.querySelector('.signup-link').addEventListener('click', function(e) {
        e.preventDefault();
        formContainer.style.display = 'none';
        showSignupInterface();
    });
    
    // Set up form submission
    document.getElementById('emergency-form').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Auth UI Enhancer: Emergency form submitted');
        
        const email = document.getElementById('emergency-email').value;
        const password = document.getElementById('emergency-password').value;
        const remember = document.getElementById('emergency-remember').checked;
        const feedback = document.getElementById('emergency-feedback');
        
        // Validate login - check admin credentials
        if (email === 'admin@gmail.com' && password === 'admin123') {
            feedback.textContent = 'Admin login successful! Redirecting...';
            feedback.style.color = '#2ecc71';
            
            saveUserSession(email, 'admin');
            if (remember) {
                localStorage.setItem('rememberedEmail', email);
            }
            
            console.log('Auth UI Enhancer: Emergency admin login successful, redirecting...');
            
            try {
                // Multiple methods to ensure redirection works
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1000);
                
                // Also try immediate redirection with replace
                setTimeout(() => {
                    if (window.location.href.indexOf('admin-dashboard.html') === -1) {
                        window.location.replace('admin-dashboard.html');
                    }
                }, 100);
                
                // Direct navigation as fallback
                const adminLink = document.createElement('a');
                adminLink.href = 'admin-dashboard.html';
                adminLink.style.display = 'none';
                document.body.appendChild(adminLink);
                setTimeout(() => adminLink.click(), 500);
            } catch (e) {
                console.error('Auth UI Enhancer: Redirection error', e);
                // Last resort
                window.location = 'admin-dashboard.html';
            }
            return;
        }
        
        // Validate login - check test user credentials
        if (email === 'test@gmail.com' && password === 'test123') {
            feedback.textContent = 'Test user login successful! Redirecting...';
            feedback.style.color = '#2ecc71';
            
            saveUserSession(email, 'user');
            if (remember) {
                localStorage.setItem('rememberedEmail', email);
            }
            
            console.log('Auth UI Enhancer: Emergency test user login successful, redirecting...');
            
            try {
                // Multiple methods to ensure redirection works
                setTimeout(() => {
                    window.location.href = 'user-dashboard.html';
                }, 1000);
                
                // Also try immediate redirection with replace
                setTimeout(() => {
                    if (window.location.href.indexOf('user-dashboard.html') === -1) {
                        window.location.replace('user-dashboard.html');
                    }
                }, 100);
                
                // Direct navigation as fallback
                const userLink = document.createElement('a');
                userLink.href = 'user-dashboard.html';
                userLink.style.display = 'none';
                document.body.appendChild(userLink);
                setTimeout(() => userLink.click(), 500);
            } catch (e) {
                console.error('Auth UI Enhancer: Redirection error', e);
                // Last resort
                window.location = 'user-dashboard.html';
            }
            return;
        }
        
        // Validate login - check user credentials
        if (email === 'user@gmail.com' && password === 'user123') {
            feedback.textContent = 'Login successful! Redirecting...';
            feedback.style.color = '#2ecc71';
            
            saveUserSession(email, 'user');
            if (remember) {
                localStorage.setItem('rememberedEmail', email);
            }
            
            console.log('Auth UI Enhancer: Emergency user login successful, redirecting...');
            
            try {
                // Multiple methods to ensure redirection works
                setTimeout(() => {
                    window.location.href = 'user-dashboard.html';
                }, 1000);
                
                // Also try immediate redirection with replace
                setTimeout(() => {
                    if (window.location.href.indexOf('user-dashboard.html') === -1) {
                        window.location.replace('user-dashboard.html');
                    }
                }, 100);
                
                // Direct navigation as fallback
                const userLink = document.createElement('a');
                userLink.href = 'user-dashboard.html';
                userLink.style.display = 'none';
                document.body.appendChild(userLink);
                setTimeout(() => userLink.click(), 500);
            } catch (e) {
                console.error('Auth UI Enhancer: Redirection error', e);
                // Last resort
                window.location = 'user-dashboard.html';
            }
            return;
        }
        
        // Invalid credentials
        feedback.textContent = 'Invalid email or password. Try using the demo credentials.';
        feedback.style.color = '#e74c3c';
    });
    
    // Also add a direct click handler to the submit button as extra backup
    const submitButton = document.querySelector('#emergency-form button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            const email = document.getElementById('emergency-email').value;
            const password = document.getElementById('emergency-password').value;
            
            // No need to prevent default, just add extra validation
            if (email === 'admin@gmail.com' && password === 'admin123') {
                console.log('Auth UI Enhancer: Direct admin login, redirecting...');
                saveUserSession(email, 'admin');
                window.location.href = 'admin-dashboard.html';
            } else if (email === 'test@gmail.com' && password === 'test123') {
                console.log('Auth UI Enhancer: Direct test user login, redirecting...');
                saveUserSession(email, 'user');
                window.location.href = 'user-dashboard.html';
            } else if (email === 'user@gmail.com' && password === 'user123') {
                console.log('Auth UI Enhancer: Direct user login, redirecting...');
                saveUserSession(email, 'user');
                window.location.href = 'user-dashboard.html';
            }
        });
    }
} 