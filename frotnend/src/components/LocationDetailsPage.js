import { useState, useEffect } from 'react';
import './LocationDetailsPage.css';
import { useLocation, useNavigate } from 'react-router-dom';

const LocationDetailsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Use nav state if available, otherwise fall back to sessionStorage
  const getStoredData = () => {
    try {
      const stored = sessionStorage.getItem('detailsPageData');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const { location, details } = state || getStoredData();

  // Persist to sessionStorage whenever we get fresh nav state
  useEffect(() => {
    if (state?.location) {
      sessionStorage.setItem('detailsPageData', JSON.stringify(state));
    }
  }, [state]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const openLightbox = (imgUrl) => {
    setLightboxImage(imgUrl);
    setZoomLevel(1);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setZoomLevel(1);
  };

  const zoomIn = (e) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = (e) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setZoomLevel(prev =>
      e.deltaY < 0
        ? Math.min(prev + 0.15, 3)
        : Math.max(prev - 0.15, 0.5)
    );
  };

  const handleback = () => navigate('/explore');

  const formatKey = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  const excludedKeys = ['_id', '__v', 'locationId', 'createdAt', 'updatedAt'];

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
      <header
        className="details-hero"
        style={{
          backgroundImage: location.images?.[selectedImage]
            ? `url(${location.images[selectedImage]})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >

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

            {/* Location URL */}
            {location.locationUrl && (
              <a
                href={location.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="location-url-link"
              >
                🔗 Visit Location →
              </a>
            )}

            {/* Image Gallery */}
            {location.images && location.images.length > 0 && (
              <div className="image-gallery">
                <h3 className="gallery-title">📸 Gallery</h3>
                <div className="gallery-grid">
                  {location.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`gallery-thumb ${idx === selectedImage ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedImage(idx);
                        openLightbox(img);
                      }}
                    >
                      <img src={img} alt={`${location.placeName} ${idx + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
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

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()} onWheel={handleWheel}>
            <button className="lightbox-close" onClick={closeLightbox}>✕</button>
            <img
              src={lightboxImage}
              alt="Enlarged view"
              className="lightbox-image"
              style={{ transform: `scale(${zoomLevel})` }}
            />
            {/* <div className="lightbox-controls">
              <button className="zoom-btn" onClick={zoomOut}>−</button>
              <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
              <button className="zoom-btn" onClick={zoomIn}>+</button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDetailsPage;