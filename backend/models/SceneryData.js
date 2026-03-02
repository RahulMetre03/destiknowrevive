import mongoose from 'mongoose';

const sceneryDataSchema = new mongoose.Schema({
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
    unique: true
  },
  type: { type: [String], required: true, maxlength: 25 },
  area: { type: [String], required: true, maxlength: 30 }
}, { timestamps: true });

export default mongoose.model('scenerydatas', sceneryDataSchema);
