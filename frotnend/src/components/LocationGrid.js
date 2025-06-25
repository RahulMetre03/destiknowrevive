// components/LocationGrid.js
import React from 'react';
import LocationCard from './LocationCard';
// import './LocationGrid.css';

const LocationGrid = ({ locations, onLocationClick, loading, error , category }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading locations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }


  return (
    <div className="location-grid">
      {locations.map((location) => (
        <LocationCard
        category = {category}
          key={location.placeId}
          location={location}
          onClick={onLocationClick}
        />
      ))}
    </div>
  );
};

export default LocationGrid;