
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LocationDetailsPage from './components/LocationDetailsPage';
import LandingPage from './components/landingPage';
import Explore from './components/explore/Explore';
import AdminPage from './components/Admin/admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/details" element={<LocationDetailsPage />} />
         <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
