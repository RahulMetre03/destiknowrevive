import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './locationcard.css';

const LocationCard = ({ location, category, index }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Create stagger class based on index (cycles 1-5)
  const staggerClass = `stagger-${(index % 5) + 1}`;

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/locations/get-details', {
        tablename: category,
        locationId: location.locationId
      });
      setDetails(response.data);
      setShowDetails(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDetails = () => {
    if (!showDetails && !details) {
      fetchDetails();
    } else {
      setShowDetails(!showDetails);
    }
  };

  const handleGoToDetails = () => {
    navigate('/details', { state: { location, details } });
  };

  // Format keys dynamically
  const formatKey = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const excludedKeys = ['_id', '__v', 'locationId', 'createdAt', 'updatedAt'];

  return (
    <div className={`card ${showDetails ? 'expanded' : ''} ${staggerClass}`}>
      <div className="card-content">
        <div className="card-badge">{location.categoryName}</div>
        <h3 className="card-title">{location.placeName}</h3>

        <div className="card-actions">
          <button
            className="btn-primary"
            onClick={handleToggleDetails}
            disabled={loading}
          >
            {loading ? 'Decrypting...' : (showDetails ? 'Close Data' : 'Preview')}
          </button>
          <button
            className="btn-secondary"
            onClick={handleGoToDetails}
          >
            Enter Portal →
          </button>
        </div>

        {error && <p className="error-text">System Error: {error}</p>}

        <div className="card-details-wrapper">
          <div className="card-details-content">
            {details && (
              <div className="details-grid">
                {Object.entries(details)
                  .filter(([key]) => !excludedKeys.includes(key))
                  .slice(0, 4) // Only show a quick preview of 4 items
                  .map(([key, value]) => (
                    <div className="detail-item" key={key}>
                      <span className="detail-label">{formatKey(key)}</span>
                      <span className="detail-value">
                        {typeof value === 'number' && ['budget', 'price'].includes(key.toLowerCase())
                          ? `₹${value.toLocaleString()}`
                          : String(value)}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LocationCard;
