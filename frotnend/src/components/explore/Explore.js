// App.js
import React, { useState, useCallback, useEffect } from 'react';
import SearchHeader from '../SearchHeader';
import LocationGrid from '../LocationGrid';
import FilterForm from '../FilterForm.js';
import { LocationService } from '../../services/LocationService.js';
import './Explore.css';

function Explore() {
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentCity, setCurrentCity] = useState('');

  // Initialize currentCity from localStorage on component mount
  useEffect(() => {
    const cityasofnow = localStorage.getItem('city');
    if (cityasofnow) {
      setCurrentCity(cityasofnow);
    }
  }, []);

  // Handle search functionality
  const handleSearch = useCallback(async (searchTerm) => {
    setLoading(true);
    setError('');
    
    try {
      // Add more detailed logging
      console.log('Starting search for:', searchTerm);
      
      const result = await LocationService.searchLocations(searchTerm, currentCity);
      
      // Check if result exists and log it
      if (!result) {
        throw new Error('No data received from API');
      }
      
      console.log('API full result:', result);
      console.log('Result type:', typeof result);
      console.log('Result keys:', Object.keys(result));
      
      // Handle the response data
      const locationsData = result.locations || [];
      const filtersData = result.filters || [];
      const categoryData = result.category || '';
      
      console.log('Parsed locations:', locationsData);
      console.log('Parsed filters:', filtersData);
      console.log('Parsed category:', categoryData);
      
      setLocations(locationsData);
      setFilters(filtersData);
      setCurrentCategory(categoryData);
      setShowFilters(filtersData.length > 0);
      
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search locations');
      setLocations([]);
      setFilters([]);
      setShowFilters(false);
    } finally {
      setLoading(false);
    }
  }, [currentCity]);

  // Handle filter application
  const handleApplyFilters = useCallback(async (filterValues) => {
    if (!currentCategory) {
      setError('No category selected');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('Applying filters:', filterValues, 'for category:', currentCategory);
      
      const result = await LocationService.applyFilters(currentCategory, filterValues, currentCity);
      
      if (!result) {
        throw new Error('No data received from filter API');
      }
      
      console.log('Filter result:', result);
      setLocations(result.locations || []);
      
    } catch (err) {
      console.error('Filter error:', err);
      setError(err.message || 'Failed to apply filters');
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, [currentCategory, currentCity]);

  // Handle location card click
  const handleLocationClick = useCallback(async (location) => {
    try {
      console.log('Getting details for location:', location);
      
      const result = await LocationService.getLocationDetails(location.placeId);
      
      if (!result) {
        throw new Error('No location details received');
      }
      
      console.log('Location details:', result.location);
      
      // For now, just alert with location info
      alert(`Location: ${location.placeName}\nCategory: ${location.categoryName}`);
      
    } catch (err) {
      console.error('Failed to get location details:', err);
      alert('Failed to load location details');
    }
  }, []);

  // Reset search
  const handleReset = useCallback(() => {
    setLocations([]);
    setFilters([]);
    setCurrentCategory('');
    setShowFilters(false);
    setError('');
  }, []);

  return (
    <div className="app">
      <SearchHeader 
      currentCity={currentCity}
      setCurrentCity={setCurrentCity}
        onSearch={handleSearch} 
        loading={loading}
      />
      
      <main className="main-content">
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={handleReset} className="reset-btn">
              Try Again
            </button>
          </div>
        )}

        <div className="content-container">
          <div className="results-section">
            <LocationGrid
              category={currentCategory}
              locations={locations}
              onLocationClick={handleLocationClick}
              loading={loading}
              error={error}
            />
          </div>

          {showFilters && (
            <div className="filters-section">
              <FilterForm
                filters={filters}
                category={currentCategory}
                onApplyFilters={handleApplyFilters}
                loading={loading}
              />
            </div>
          )}
        </div>

        {locations.length === 0 && !loading && !error && (
          <div className="welcome-section">
            <h2>Welcome to Let's Explore</h2>
            <p>Search for restaurants, adventures, scenery, resorts, and more!</p>
            <div className="category-suggestions">
              <h3>Try searching for:</h3>
              <div className="suggestion-buttons">
                {['Restaurant', 'Adventure', 'Scenery', 'Resorts', 'Games'].map(category => (
                  <button
                    key={category}
                    onClick={() => handleSearch(category)}
                    className="suggestion-btn"
                    disabled={loading}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Explore;