import React, { useState } from 'react';
import Capture from './Capture.png';

const SearchHeader = ({ currentCity, setCurrentCity, onSearch, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const username = localStorage.getItem('username');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  console.log("github testing final");
  console.log("GITHUB TEST");

  return (
    <div className="header">
      <a href="/" className="logo">
        <img src={Capture} alt="DESTIKNOW Logo" />
      </a>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Where are you? (City)"
          value={currentCity}
          onChange={(e) => setCurrentCity(e.target.value)}
          autoComplete="address-level2"
          className="city-input"
          disabled={loading}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for restaurants, games, resorts..."
          autoComplete="off"
          className="search-input"
          disabled={loading}
        />
        <button
          type="submit"
          className="search-btn"
          disabled={loading || !searchTerm.trim() || !currentCity.trim()}
        >
          {loading ? 'Searching...' : 'Explore Now'}
        </button>
      </form>

      <div className="greeting">
        User <strong>{username || 'Guest'}</strong>
      </div>
    </div>
  );
};

export default SearchHeader;