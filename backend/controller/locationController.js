import {Location} from '../models/Location.js';
import RestaurantData from '../models/RestaurantData.js';
import AdventureData from '../models/AdventureData.js';
import SceneryData from '../models/SceneryData.js';
import ResortsData from '../models/ResortsData.js';
import GamesData from '../models/GamesData.js';
import Filters from '../models/Filters.js';
import mongoose from 'mongoose';

// Search locations by category
export const searchLocations = async (req, res) => {
  try {
    const { search, city } = req.body;

    if (!search) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    const locations = await Location.find({
      categoryName: { $regex: search, $options: 'i' },
      city: city
    });

    if (locations.length === 0) {
      return res.status(404).json({ message: 'No matching places found' });
    }

    const locationsWithImages = locations.map(location => ({
      ...location.toObject(),
      image: location.image ? `data:image/jpeg;base64,${location.image.toString('base64')}` : null
    }));

    const category = search.toLowerCase();
    const filters = await Filters.findOne({ category });

    res.json({
      locations: locationsWithImages,
      filters: filters ? filters.filters : [],
      category
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const applyFilters = async (req, res) => {
  try {
    const { category, filters, city } = req.body;

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    let DataModel;
    switch (category.toLowerCase()) {
      case 'restaurant':
        DataModel = RestaurantData;
        break;
      case 'adventure':
        DataModel = AdventureData;
        break;
      case 'scenery':
        DataModel = SceneryData;
        break;
      case 'resorts':
        DataModel = ResortsData;
        break;
      case 'games':
        DataModel = GamesData;
        break;
      default:
        return res.status(400).json({ message: 'Invalid category' });
    }

    const filterQuery = {};
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value && value.trim() !== '') {
        if (['budget', 'price', 'numberAllowed', 'people'].includes(key.toLowerCase())) {
          const numValue = parseInt(value);
          if (!isNaN(numValue)) {
            filterQuery[key] = { $lte: numValue };
          }
        } else {
          filterQuery[key] = { $regex: value, $options: 'i' };
        }
      }
    });

    const matchingData = await DataModel.find(filterQuery);
    const placeIds = matchingData.map(item => item.placeId);

    if (placeIds.length === 0) {
      return res.status(404).json({ message: 'No matching places found with applied filters' });
    }

    const locations = await Location.find({
      placeId: { $in: placeIds },
      city: city
    });

    const locationsWithImages = locations.map(location => ({
      ...location.toObject(),
      image: location.image ? `data:image/jpeg;base64,${location.image.toString('base64')}` : null
    }));

    res.json({ locations: locationsWithImages });

  } catch (error) {
    console.error('Filter error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all distinct categories from Location
export const getCategories = async (req, res) => {
  try {
    const categories = await Location.distinct('categoryName');
    res.json({ categories });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single location details by placeId
export const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findOne({ placeId: parseInt(id) });

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const locationWithImage = {
      ...location.toObject(),
      image: location.image ? `data:image/jpeg;base64,${location.image.toString('base64')}` : null
    };

    res.json({ location: locationWithImage });
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getDetails = async (req, res) => {
  try {
    const { tablename, placeId } = req.body;

    if (!tablename || !placeId) {
      return res.status(400).json({ message: 'tablename and placeId are required' });
    }

    const tableNameFinal = tablename.charAt(0).toUpperCase() + tablename.slice(1).toLowerCase() + 'Data';

    // Ensure the model is already registered
    if (!mongoose.models[tableNameFinal]) {
      return res.status(400).json({ message: `Model '${tableNameFinal}' is not registered.` });
    }

    const Model = mongoose.models[tableNameFinal];

    const details = await Model.findOne({ placeId });

    if (!details) {
      return res.status(404).json({ message: 'No details found for the given placeId.' });
    }

    res.json(details);
  } catch (error) {
    console.error('Error in getDetails:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

