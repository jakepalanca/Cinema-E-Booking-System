/**
 * Authentication service for managing JWT tokens and user authentication state.
 */

const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_data';

class AuthService {
  /**
   * Store JWT token and user data in localStorage.
   */
  setAuth(token, userData) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }

  /**
   * Get the stored JWT token.
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Get the stored user data.
   */
  getUser() {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Check if user is authenticated.
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Check if user is admin.
   */
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }

  /**
   * Check if user is customer.
   */
  isCustomer() {
    const user = this.getUser();
    return user && user.role === 'customer';
  }

  /**
   * Clear authentication data (logout).
   */
  clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Also clear old auth data if it exists
    localStorage.removeItem('cinemaAuth');
    localStorage.removeItem('cinemaUser');
  }

  /**
   * Get authorization header for API requests.
   */
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export default new AuthService();

