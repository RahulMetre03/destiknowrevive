import mongoose from 'mongoose';

const sceneryDataSchema = new mongoose.Schema({
  placeId: { type: Number, required: true, unique: true },
  type: { type: String, required: true, maxlength: 25 },
  area: { type: String, required: true, maxlength: 30 }
}, { timestamps: true });

export default mongoose.model('SceneryData', sceneryDataSchema);
