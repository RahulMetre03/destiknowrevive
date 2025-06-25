// components/LocationCard.js
import React, { useState } from 'react';
import './locationcard.css';
import LocationDetailsPage from './LocationDetailsPage';
import { useNavigate } from 'react-router-dom';

const LocationCard = ({ location, category }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchDetails = async () => {
    if (!location?.placeId || !category) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Calling API for:', location.placeName);

      const response = await fetch('https://destiknowrevive.onrender.com/api/locations/get-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tablename: category,
          placeId: location.placeId,
        }),
      });

      const data = await response.json();
      console.log('API response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch details');
      }

      setDetails(data);
      setShowDetails(true);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDetails = () => {
    if (!details) {
      // If no details loaded, fetch them
      fetchDetails();
    } else if (showDetails) {
      // If details are showing, hide them
      setShowDetails(false);
    } else {
      // If details are loaded but hidden, show them
      setShowDetails(true);
    }
  };

  const navigate = useNavigate();

  const goToDetails = (loc) => {
    navigate('/details', {
      state: {
        location: loc,
        details: details
      }
    });
  };

  const handleClearDetails = () => {
    setDetails(null);
    setShowDetails(false);
    setError(null);
  };

  const getButtonText = () => {
    if (loading) return 'Loading...';
    if (!details) return 'Read More';
    return showDetails ? 'Hide Details' : 'Show Details';
  };

  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1') // add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // capitalize first letter
  };

  return (
    <div className="card">
      <div className="card-content">
        <h3 className="card-title">{location.placeName}</h3>
        <p className="card-category">{location.categoryName}</p>
        
        {/* Button Container */}
        <div className="button-container">
          {/* Toggle Details Button */}
          <button onClick={handleToggleDetails} disabled={loading}>
            {getButtonText()}
          </button>

          {/* Go to Details Page Button - only show when details are loaded */}
          {details && showDetails && (
            <button onClick={() => goToDetails(location)}>
              Go to Details Page
            </button>
          )}

          {/* Clear Button - only show when details are loaded */}
          {details && (
            <button 
              className="clear-btn" 
              onClick={handleClearDetails}
              title="Clear details"
            >
              ✕
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-section">
            <p className="error-text">Error: {error}</p>
          </div>
        )}

        {/* Details Display */}
        <div className={`card-details-container ${details && showDetails ? 'expanded' : ''}`}>
          {details && showDetails && (
            <div className="card-details">
              {Object.entries(details).map(([key, value]) => {
                if (key === '_id' || key === 'placeId') return null; // Skip these keys

                return (
                  <p key={key}>
                    <strong>{formatKey(key)}:</strong> {String(value)}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
