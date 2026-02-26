import React, { useState } from 'react';
import SearchHeader from '../SearchHeader';
import FilterForm from '../FilterForm';
import LocationGrid from '../LocationGrid';
import { LocationService } from '../../services/LocationService';
import './Explore.css';

const Explore = () => {
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentCity, setCurrentCity] = useState(
    localStorage.getItem('city') || ''
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (category) => {
    if (!category.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await LocationService.searchLocations(category, currentCity);
      setLocations(data.locations || []);
      setFilters(data.filters || []);
      setCurrentCategory(data.category || category);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async (filterValues) => {
    setLoading(true);
    setError(null);
    try {
      const locationIds = locations.map(loc => loc.locationId);
      const data = await LocationService.applyFilters(
        filterValues,
        currentCategory,
        locationIds,
        currentCity
      );

      setLocations(data.locations || []);
    } catch (err) {
      setError('Failed to apply filters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Restaurant', emoji: '🍽️', desc: 'Fine dining & street food' },
    { name: 'Adventure', emoji: '🏔️', desc: 'Thrills & extreme sports' },
    { name: 'Scenery', emoji: '🌅', desc: 'Breathtaking viewpoints' },
    { name: 'Resorts', emoji: '🏖️', desc: 'Luxury stays & chill' },
    { name: 'Games', emoji: '🎮', desc: 'Arcades & activity centers' }
  ];

  return (
    <div className="app">
      <SearchHeader
        currentCity={currentCity}
        setCurrentCity={(city) => {
          setCurrentCity(city);
          localStorage.setItem('city', city);
        }}
        onSearch={handleSearch}
        loading={loading}
      />

      <main className="main-content">
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="reset-btn">Dismiss</button>
          </div>
        )}

        {/* Dynamic content rendering based on search state */}
        <div className="content-container" style={{ display: locations.length === 0 ? 'block' : 'grid' }}>

          {/* Welcome Dashboard when empty */}
          {locations.length === 0 && !loading && !error && (
            <div className="welcome-section">
              <h2>Select your vibe.</h2>
              <p>Discover hand-picked spots for dining, adventures, relaxing, and more.</p>

              <div className="category-suggestions">
                <h3>Popular Categories</h3>
                <div className="suggestion-buttons">
                  {categories.map((cat, index) => (
                    <button
                      key={cat.name}
                      onClick={() => handleSearch(cat.name)}
                      className={`suggestion-btn stagger-${index + 1}`}
                      disabled={loading}
                    >
                      <span className="emoji">{cat.emoji}</span>
                      <span className="label">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Render Filters & Grid when locations exist */}
          {locations.length > 0 && (
            <>
              <aside className="filters-section glass-panel">
                <FilterForm
                  filters={filters}
                  category={currentCategory}
                  onApplyFilters={handleApplyFilters}
                  loading={loading}
                />
              </aside>

              <section className="results-section">
                <div className="results-header">
                  <div className="results-count">
                    <strong>{locations.length}</strong>
                    {locations.length === 1 ? 'place' : 'places'} found
                    {currentCategory && <span className="text-gradient"> in {currentCategory}</span>}
                  </div>
                </div>

                <LocationGrid
                  locations={locations}
                  category={currentCategory}
                  loading={loading}
                  error={error}
                />
              </section>
            </>
          )}

          {/* Full page loader */}
          {loading && locations.length === 0 && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <h3 className="text-gradient">Scanning dimensions...</h3>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Explore;