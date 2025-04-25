/**
 * API Service - Centralized API handling for the application
 * 
 * This service provides consistent API call handling, including:
 * - Authentication token management
 * - Error handling and standardization
 * - Consistent request/response formatting
 * - Automatic token refresh (planned future feature)
 */

class ApiService {
    constructor() {
        this.baseUrl = '/api';
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    /**
     * Get authentication token from localStorage
     * @returns {string|null} The authentication token or null if not found
     */
    getAuthToken() {
        try {
            const authData = localStorage.getItem('authToken');
            if (!authData) return null;
            
            const parsedAuth = JSON.parse(authData);
            return parsedAuth.token;
        } catch (error) {
            console.error('Error retrieving auth token:', error);
            return null;
        }
    }

    /**
     * Check if the token is expired
     * @returns {boolean} True if token is expired or not present
     */
    isTokenExpired() {
        try {
            const authData = localStorage.getItem('authToken');
            if (!authData) return true;
            
            const parsedAuth = JSON.parse(authData);
            const expiryTime = parsedAuth.exp;
            
            return !expiryTime || Date.now() >= expiryTime;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    }

    /**
     * Handle session expiration by clearing storage and redirecting
     */
    handleSessionExpired() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        
        // Show message if showToast function exists
        if (typeof showToast === 'function') {
            showToast('Your session has expired. Please log in again.', 'warning');
        } else if (typeof showMessage === 'function') {
            showMessage('warning', 'Your session has expired. Please log in again.');
        }
        
        // Redirect to login page after delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    /**
     * Make API request with proper error handling and authentication
     * 
     * @param {string} endpoint - API endpoint path (without base URL)
     * @param {Object} options - Request options
     * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE)
     * @param {Object} [options.body] - Request body data
     * @param {Object} [options.headers] - Additional headers
     * @param {boolean} [options.requiresAuth=true] - Whether this request requires authentication
     * @param {boolean} [options.handleErrors=true] - Whether to handle errors automatically
     * @returns {Promise<Object>} Response data or error object
     */
    async request(endpoint, options = {}) {
        const {
            method = 'GET',
            body,
            headers = {},
            requiresAuth = true,
            handleErrors = true
        } = options;

        // Build URL (ensure endpoint starts with /)
        const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
        
        // Prepare headers
        const requestHeaders = { ...this.defaultHeaders, ...headers };
        
        // Add authentication if required
        if (requiresAuth) {
            // Check if token is expired
            if (this.isTokenExpired()) {
                this.handleSessionExpired();
                return { success: false, message: 'Session expired' };
            }
            
            const token = this.getAuthToken();
            if (token) {
                requestHeaders['Authorization'] = `Bearer ${token}`;
            }
        }
        
        // Prepare request options
        const requestOptions = {
            method,
            headers: requestHeaders
        };
        
        // Add body for non-GET requests
        if (method !== 'GET' && body) {
            requestOptions.body = JSON.stringify(body);
        }
        
        try {
            const response = await fetch(url, requestOptions);
            
            // Handle 401 Unauthorized (expired token)
            if (response.status === 401 && requiresAuth) {
                this.handleSessionExpired();
                return { success: false, message: 'Session expired' };
            }
            
            // Parse response based on content type
            let data;
            const contentType = response.headers.get('Content-Type') || '';
            
            if (contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }
            
            // Return standardized response
            const result = {
                success: response.ok,
                status: response.status,
                statusText: response.statusText,
                data: response.ok ? data : null,
                error: response.ok ? null : data
            };
            
            // Handle errors if requested
            if (!response.ok && handleErrors) {
                const errorMessage = typeof data === 'object' && data.message 
                    ? data.message 
                    : `Request failed with status ${response.status}`;
                
                // Display error message if appropriate functions exist
                if (typeof showToast === 'function') {
                    showToast(errorMessage, 'error');
                } else if (typeof showMessage === 'function') {
                    showMessage('danger', errorMessage);
                }
                
                console.error('API Error:', errorMessage, data);
            }
            
            return result;
        } catch (error) {
            console.error('Request failed:', error);
            
            // Handle network errors
            if (handleErrors) {
                const errorMessage = 'Network error. Please check your connection and try again.';
                
                if (typeof showToast === 'function') {
                    showToast(errorMessage, 'error');
                } else if (typeof showMessage === 'function') {
                    showMessage('danger', errorMessage);
                }
            }
            
            return {
                success: false,
                status: 0,
                statusText: 'Network Error',
                data: null,
                error: { message: error.message }
            };
        }
    }

    // Convenience methods for different HTTP verbs
    
    /**
     * Make a GET request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} Response data
     */
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }
    
    /**
     * Make a POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body data
     * @param {Object} options - Request options
     * @returns {Promise<Object>} Response data
     */
    async post(endpoint, data, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body: data });
    }
    
    /**
     * Make a PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body data
     * @param {Object} options - Request options
     * @returns {Promise<Object>} Response data
     */
    async put(endpoint, data, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body: data });
    }
    
    /**
     * Make a DELETE request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} Response data
     */
    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
    
    // Authentication endpoints
    
    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {boolean} remember - Remember user
     * @returns {Promise<Object>} Login result
     */
    async login(email, password, remember = false) {
        return this.post('/auth/login', { email, password, remember }, { requiresAuth: false });
    }
    
    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Registration result
     */
    async register(userData) {
        return this.post('/auth/register', userData, { requiresAuth: false });
    }
    
    /**
     * Log out current user
     * @returns {Promise<Object>} Logout result
     */
    async logout() {
        // Server-side logout
        const result = await this.post('/auth/logout', {});
        
        // Always clear client-side auth data regardless of server response
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        
        return result;
    }
    
    // Booking endpoints
    
    /**
     * Create a guest booking (no authentication required)
     * @param {Object} bookingData - Booking data
     * @returns {Promise<Object>} Booking result
     */
    async createGuestBooking(bookingData) {
        return this.post('/bookings/guest', bookingData, { requiresAuth: false });
    }
    
    /**
     * Get all bookings (for admin)
     * @returns {Promise<Object>} Bookings data
     */
    async getBookings() {
        return this.get('/bookings');
    }
    
    /**
     * Get user's bookings
     * @returns {Promise<Object>} User's bookings data
     */
    async getUserBookings() {
        return this.get('/bookings/user');
    }
}

// Create and export instance
const apiService = new ApiService();

// Make available globally
window.apiService = apiService;

// Export for module support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = apiService;
} 