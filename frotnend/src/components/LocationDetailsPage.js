import { useState, useEffect } from 'react';
import './LocationDetailsPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import LocationService from '../services/LocationService'; // imported LocationService
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

  // Add state for Reviews
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [avgRating, setAvgRating] = useState(0);

  // Hardcode a userId for demonstration since auth is not defined
  const user_id = localStorage.getItem("_id");

  // Fetch reviews on mount
  useEffect(() => {
    if (location && location._id) { // Wait, location._id or location.id? Let's assume location.id or location._id
      fetchReviews();
    }
  }, [location]);

  const fetchReviews = async () => {
    try {
      const locId = location._id || location.id;
      if (!locId) return;

      const response = await LocationService.getReviews(locId);
      if (response && response.data) {
        setReviews(response.data);
      }

      // Compute average rating manually if API 'getAverageRating' is not in location service,
      // or just calculate from the fetched array.
      if (response && response.data && response.data.length > 0) {
        const sum = response.data.reduce((acc, r) => acc + r.rating, 0);
        setAvgRating(sum / response.data.length);
      } else {
        setAvgRating(0);
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  const submitReview = async () => {
    if (!newReviewText.trim()) return;

    try {
      const locId = location._id || location.id;
      await LocationService.createReview({
        userId: user_id,
        locationId: locId,
        rating: newReviewRating,
        reviewText: newReviewText
      });
      setNewReviewText("");
      setNewReviewRating(5);
      fetchReviews(); // Re-fetch
    } catch (error) {
      console.error('Failed to submit review', error);
      alert('Failed to submit review. Ensure backend is running.');
    }
  };

  const deleteReview = async (id) => {
    try {
      if (window.confirm('Delete this review?')) {
        await LocationService.deleteReview(id);
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete review');
    }
  };

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

      {/* REVIEWS SECTION */}
      <section className="reviews-section">
        <h2 className="section-title">Traveler Reviews {avgRating > 0 && `(Avg: ${avgRating.toFixed(1)}/5)`}</h2>

        <div className="reviews-container">
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to share your experience!</p>
          ) : (
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                    <span className="review-date">{new Date(review.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="review-text">{review.reviewText}</p>

                  {/* Assuming DEMO_USER_ID can delete their own review */}
                  {(review.userId === user_id) && (
                    <button className="delete-review-btn" onClick={() => deleteReview(review._id)}>
                      🗑️ Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {reviews.some(r => r.userId === user_id) ? (
            <div className="add-review-box">
              <h3>You've Already Reviewed This Location</h3>
              <p>Thank you for sharing your experience!</p>
            </div>
          ) : (
            <div className="add-review-box">
              <h3>Write a Review</h3>
              <div className="rating-selector">
                <label>Rating: </label>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                </select>
              </div>

              <textarea
                className="review-input"
                rows="4"
                placeholder="Share details of your experience at this location..."
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
              />
              <button className="submit-review-btn" onClick={submitReview}>
                Post Review
              </button>
            </div>
          )}
        </div>
      </section>

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