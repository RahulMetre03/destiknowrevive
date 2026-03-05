import mongoose from 'mongoose';

const restaurantDataSchema = new mongoose.Schema({
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
    unique: true
  },
  numberAllowed: { type: Number, required: true, max: 99 },
  area: { type: String, required: true },
  cuisine: { type: [String], required: true },
  ambience: { type: [String], required: true },
  budget: { type: Number, required: true, max: 99999 },
}, { timestamps: true });

export default mongoose.model('restaurantdatas', restaurantDataSchema);
