import express from 'express';
import {
  searchLocations,
  applyFilters,
  getCategories,
  getLocationById , 
  getDetails 
} from '../controller/locationController.js';

const router = express.Router();

// @route   POST /api/locations/search
// @desc    Search locations by category
// @access  Public
router.post('/search', searchLocations);

// @route   POST /api/locations/filter
// @desc    Apply filters to search results
// @access  Public
router.post('/filter', applyFilters);

// @route   GET /api/locations/categories
// @desc    Get all categories
// @access  Public
router.get('/categories', getCategories);

// @route   GET /api/locations/:id
// @desc    Get location by ID
// @access  Public
router.get('/:id', getLocationById);

router.post('/get-details', getDetails);


export default router;
