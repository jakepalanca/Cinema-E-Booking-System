import authService from './authService';

const API_BASE_URL = 'http://localhost:8080';

/**
 * API utility for making authenticated requests.
 * JWT tokens are now in HTTP-only cookies, so they're sent automatically.
 */
class ApiService {
  /**
   * Make an authenticated API request.
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
      credentials: 'include', // Include cookies in request
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401) {
        await authService.clearAuth();
        // Redirect to login if not already there
        if (window.location.pathname !== '/login' && window.location.pathname !== '/admin-login') {
          window.location.href = '/login';
        }
        throw new Error('Unauthorized - please login again');
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * GET request.
   */
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  /**
   * POST request.
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request.
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request.
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new ApiService();

