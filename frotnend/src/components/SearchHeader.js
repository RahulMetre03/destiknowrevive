import React, { useState } from 'react';
// import './SearchHeader.css';
import Capture from './Capture.png';

const SearchHeader = ({ currentCity, setCurrentCity, onSearch, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setCurrentCity(city);
    // Note: localStorage is not available in Claude artifacts
    // localStorage.setItem('city', city);
  };

  return (
    <div className="header">
      <a href="/" className="logo">
        <img src={Capture} alt="Logo" />
      </a>
      
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Enter city"
          value={currentCity}
          onChange={handleCityChange}
          className="city-input"
          disabled={loading}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter what your mind says"
          className="search-input"
          disabled={loading}
        />
        <button 
          type="submit"
          className="search-btn"
          disabled={loading || !searchTerm.trim()}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchHeader;