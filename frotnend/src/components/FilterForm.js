import React, { useState, useEffect } from 'react';
import { LocationService } from '../services/LocationService.js';
// import './FilterForm.css';

const FilterForm = ({ filters, category, onApplyFilters, loading }) => {
  const [filterValues, setFilterValues] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Reset form when filters change
    setFilterValues({});
    setValidationErrors({});
  }, [filters, category]);

  const handleInputChange = (filterName, value) => {
    setFilterValues(prev => ({
      ...prev,
      [filterName]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[filterName]) {
      setValidationErrors(prev => ({
        ...prev,
        [filterName]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let hasErrors = false;

    Object.keys(filterValues).forEach(filterName => {
      const value = filterValues[filterName];
      if (value && !LocationService.validateFilterInput(filterName, value)) {
        errors[filterName] = 'Invalid input';
        hasErrors = true;
      }
    });

    setValidationErrors(errors);
    return !hasErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onApplyFilters(filterValues);
    }
  };

  const hasFilters = filters && filters.length > 0;
  const hasValues = Object.values(filterValues).some(value => value && value.trim() !== '');

  if (!hasFilters) {
    return null;
  }

  return (
    <div className="filter-form-container">
      <h3>Filter Results</h3>
      <form onSubmit={handleSubmit} className="filter-form">
        <div className="filter-inputs">
          {filters.map((filter) => (
            <div key={filter} className="filter-input-group">
              <input
                type="text"
                value={filterValues[filter] || ''}
                onChange={(e) => handleInputChange(filter, e.target.value)}
                placeholder={LocationService.formatFilterName(filter)}
                className={`filter-input ${validationErrors[filter] ? 'error' : ''}`}
                disabled={loading}
              />
              {validationErrors[filter] && (
                <span className="error-message">{validationErrors[filter]}</span>
              )}
            </div>
          ))}
        </div>
        <button 
          type="submit" 
          className="apply-filters-btn"
          disabled={loading || !hasValues}
        >
          {loading ? 'Applying...' : 'Apply Filters'}
        </button>
      </form>
    </div>
  );
};

export default FilterForm;