
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LocationDetailsPage from './components/LocationDetailsPage';
import LandingPage from './components/landingPage';
import Explore from './components/explore/Explore';
import AdminPage from './components/Admin/admin';
import SocialFeed from './components/social/SocialFeed';
import UserProfile from './components/social/UserProfile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/details" element={<LocationDetailsPage />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* Social routes */}
        <Route path="/feed" element={<SocialFeed />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
