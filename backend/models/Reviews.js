import mongoose from "mongoose";
import User from './user.js';
import Locations from './Location.js'

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // or String if you're not using ObjectId
    required: true,
    ref: User
  },
  locationId: {
    type: Number, // or String
    required: true,
    ref: Location
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Reviews", reviewSchema);