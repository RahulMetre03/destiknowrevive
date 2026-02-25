// services/locationService.js
import ApiService from './apiServices.js';
import axios from 'axios';
const BASE_URL = 'https://destiknowrevive.onrender.com/api';

export class LocationService {
  // Search for locations
  static async searchLocations(searchTerm,city) {
    try {
      const res = await axios.post(`${BASE_URL}/locations/search`, { 
        search: searchTerm ,
        city : city
      });
      
      // Log the full response to debug
      console.log('Axios response:', res);
      console.log('Response data:', res.data);
      
      // Return the response data
      return res.data;
    } catch (error) {
      console.error('LocationService.searchLocations error:', error);
      throw new Error(error.response?.data?.message || 'Failed to search locations');
    }
  }

  // Apply filters
  static async applyFilters(category, filters,city) {
  try {
    if (!category) {
      throw new Error('Category is required');
    }

    // Clean filters
    const cleanFilters = Object.keys(filters).reduce((acc, key) => {
      if (filters[key] && filters[key].trim() !== '') {
        acc[key] = filters[key].trim();
      }
      return acc;
    }, {});

    const res = await axios.post(`${BASE_URL}/locations/filter`, {
      category,
      filters: cleanFilters,
       city : city
    });

    // Debug logs
    console.log('Axios response (applyFilters):', res);
    console.log('Response data (applyFilters):', res.data);

    return res.data;
  } catch (error) {
    console.error('LocationService.applyFilters error:', error);
    throw new Error(error.response?.data?.message || 'Failed to apply filters');
  }
}

  // Get all categories
  static async getCategories() {
    try {
      return await ApiService.getCategories();
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }

  // Get location details
  static async getLocationDetails(id) {
    try {
      if (!id) {
        throw new Error('Location ID is required');
      }
      
      return await ApiService.getLocationById(id);
    } catch (error) {
      console.error('Get location details error:', error);
      throw error;
    }
  }

  // Validate filter input based on type
  static validateFilterInput(filterName, value) {
    const numericFilters = ['budget', 'price', 'numberallowed', 'people'];
    
    if (numericFilters.includes(filterName.toLowerCase())) {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) {
        return false;
      }
    }
    
    return value && value.trim().length > 0;
  }

  // Format filter display name
  static formatFilterName(filterName) {
    return filterName
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  static LocationService = {
  getDetails: async ({ tablename, placeId }) => {
    console.log('Calling getDetails with:', { tablename, placeId });

    try {
      const response = await axios.post('/api/get-details', {
        tablename,
        placeId,
      });

      console.log('getDetails response:', response.data);
      return response.data; // ✅ return only the data
    } catch (error) {
      console.error('Error in LocationService.getDetails:', error);
      throw error;
    }
  }
};
}

export default LocationService;
