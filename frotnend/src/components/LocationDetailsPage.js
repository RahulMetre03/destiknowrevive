import './LocationDetailsPage.css';
import { useLocation, useNavigate } from 'react-router-dom';

const LocationDetailsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { location, details } = state || {};

  const handleback = () => navigate('/explore');

  const formatKey = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  const excludedKeys = ['_id', '__v', 'placeId', 'createdAt', 'updatedAt'];

  if (!location) {
    return (
      <div className="empty-portal">
        <div>
          <h2 className="portal-msg">Awaiting Coordinates...</h2>
          <button onClick={handleback} className="btn-primary">Return to Explorer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="details-page">
      {/* Immersive Hero Header */}
      <header className="details-hero">
        <div className="hero-glass-overlay"></div>
        <button onClick={handleback} className="back-btn">
          ← Back to Map
        </button>
        <div className="details-category-badge">{location.categoryName}</div>
        <h1 className="details-title">{location.placeName}</h1>
      </header>

      {/* Split-pane Content Container */}
      <div className="details-container">

        {/* Left Column: Narrative/Core Location Info */}
        <main className="details-main">
          <section className="overview-card">
            <h2 className="section-title">Overview</h2>

            {location.description ? (
              <p className="description-text">{location.description}</p>
            ) : (
              <p className="description-text" style={{ fontStyle: 'italic', opacity: 0.6 }}>
                No detailed description available for this coordinate yet.
              </p>
            )}

            <div className="location-tags">
              {location.city && (
                <div className="loc-tag">
                  <i>📍</i> {location.city}
                </div>
              )}
              {location.state && (
                <div className="loc-tag">
                  <i>🗺️</i> {location.state}
                </div>
              )}
              {location.country && (
                <div className="loc-tag">
                  <i>🌍</i> {location.country}
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Right Column: Telemetry/Specific Details */}
        <aside className="details-sidebar">
          {details ? (
            <section className="data-card">
              <h2 className="section-title">Telemetry Data</h2>
              <div className="telemetry-grid">
                {Object.entries(details)
                  .filter(([key]) => !excludedKeys.includes(key))
                  .map(([key, value]) => {
                    const isMonetary = typeof value === 'number' && ['budget', 'price'].includes(key.toLowerCase());
                    const displayValue = isMonetary ? `₹${value.toLocaleString()}` : String(value);

                    return (
                      <div className="telemetry-item" key={key}>
                        <span className="tel-label">{formatKey(key)}</span>
                        <span className={`tel-value ${isMonetary ? 'highlight' : ''}`}>
                          {displayValue}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </section>
          ) : (
            <section className="data-card" style={{ opacity: 0.5 }}>
              <h2 className="section-title">Telemetry Data</h2>
              <p>Scanning sectors... No deep telemetry available for this node.</p>
            </section>
          )}
        </aside>

      </div>
    </div>
  );
};

export default LocationDetailsPage;