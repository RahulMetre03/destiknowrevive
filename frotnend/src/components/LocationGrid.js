// components/LocationGrid.js
import React from 'react';
import LocationCard from './LocationCard';

const LocationGrid = ({ locations, onLocationClick, loading, error, category }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h3 className="text-gradient">Scanning dimensions...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-banner" style={{ gridColumn: '1 / -1' }}>
        <span>Error retrieving coordinates: {error}</span>
      </div>
    );
  }

  if (locations.length === 0) {
    return null;
  }

  return (
    <div className="location-grid">
      {locations.map((location) => (
        <LocationCard
          category={category}
          key={location.locationId}
          location={location}
          onClick={onLocationClick}
        />
      ))}
    </div>
  );
};

export default LocationGrid;