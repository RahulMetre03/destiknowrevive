
import './LocationDetailsPage.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const LocationDetailsPage = () => {

    const navigate = useNavigate();

    const { state } = useLocation();
  const { location, details } = state || {};


  const handleback =()=>{
    navigate('/explore');
  }

  return (
    
    <div className="details-container">
      <button onClick={handleback}>Go back</button>
      <div className="card">
        <h2>{location.placeName}</h2>
        <p className="description">{location.description}</p>

        <div className="info-grid">
          <div><strong>Category:</strong> {location.categoryName}</div>
          <div><strong>City:</strong> {location.city}</div>
          <div><strong>State:</strong> {location.state}</div>
          <div><strong>Country:</strong> {location.country}</div>
        </div>
      </div>

      <div className="card">
        <h3>Place Details</h3>
        <div className="info-grid">
          <div><strong>Area:</strong> {details.area}</div>
          <div><strong>Cuisine:</strong> {details.cuisine}</div>
          <div><strong>Ambience:</strong> {details.ambience}</div>
          <div><strong>Budget:</strong> ₹{details.budget}</div>
          <div><strong>Max People Allowed:</strong> {details.numberAllowed}</div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetailsPage;