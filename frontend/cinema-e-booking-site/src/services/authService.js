/**
 * Authentication service for managing user authentication state.
 * JWT tokens are now stored in HTTP-only cookies, so we only manage user data in localStorage.
 */

const USER_KEY = 'user_data';

class AuthService {
  /**
   * Store user data in localStorage (token is in HTTP-only cookie).
   */
  setAuth(userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }

  /**
   * Get the stored user data.
   */
  getUser() {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Check if user is authenticated by verifying with backend.
   * This is async because we need to check the cookie on the server.
   */
  async isAuthenticated() {
    try {
      const response = await fetch('http://localhost:8080/auth/me', {
        method: 'GET',
        credentials: 'include', // Include cookies
      });
      return response.ok;
    } catch (error) {
      return false;
    }
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
   * Also calls backend to clear the cookie.
   */
  async clearAuth() {
    // Call backend logout endpoint to clear cookie
    try {
      console.log('[authService] Calling logout endpoint...');
      const response = await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies
      });
      console.log('[authService] Logout response status:', response.status);
      if (!response.ok) {
        console.error('[authService] Logout failed:', response.status, response.statusText);
      } else {
        console.log('[authService] Logout successful');
      }
    } catch (error) {
      console.error('[authService] Error during logout:', error);
    }
    
    // Clear local storage
    console.log('[authService] Clearing localStorage...');
    localStorage.removeItem(USER_KEY);
    // Also clear old auth data if it exists
    localStorage.removeItem('cinemaAuth');
    localStorage.removeItem('cinemaUser');
    localStorage.removeItem('isAdmin');
    console.log('[authService] Logout complete');
  }
}

const authService = new AuthService();

export default authService;
