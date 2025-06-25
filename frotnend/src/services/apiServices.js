// services/apiService.js
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  // Generic request handler
  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      return { 
        success: false, 
        error: error.message || 'Network error occurred'
      };
    }
  }

  // User Authentication APIs
  async checkLogin(loginData) {
    return this.makeRequest('/users/checklogin', {
      method: 'POST',
      body: JSON.stringify({
        username: loginData.username,
        password: loginData.password
      }),
    });
  }

  async registerUser(userData) {
    return this.makeRequest('/users/registeruser', {
      method: 'POST',
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        city: userData.city
      }),
    });
  }

  async searchLocations(searchTerm) {
    return this.makeRequest('/locations/search', {
      method: 'POST',
      body: JSON.stringify({ search: searchTerm }),
    });
  }

  // Apply filters to search results
  async applyFilters(category, filters) {
    return this.makeRequest('/locations/filter', {
      method: 'POST',
      body: JSON.stringify({ category, filters }),
    });
  }

  // Get all categories
  async getCategories() {
    return this.makeRequest('/locations/categories');
  }

  // Get location by ID
  async getLocationById(id) {
    return this.makeRequest(`/locations/${id}`);
  } 

}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Named exports for specific methods if needed
export const { 
  checkLogin, 
  registerUser , searchLocations , applyFilters , getCategories ,getLocationById
} = apiService;