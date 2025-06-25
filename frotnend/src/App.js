
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LocationDetailsPage from './components/LocationDetailsPage';
import TravelLandingPage from './components/landingPage';
import Explore from './components/explore/Explore';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TravelLandingPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/details" element={<LocationDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
