import mongoose from 'mongoose';

const sceneryDataSchema = new mongoose.Schema({
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
    unique: true
  },
  type: { type: String, required: true },
  area: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('scenerydatas', sceneryDataSchema);
