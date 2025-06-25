import mongoose from 'mongoose';

const adventureDataSchema = new mongoose.Schema({
  placeId: { type: Number, required: true, unique: true },
  type: { type: String, required: true, maxlength: 25 },
  area: { type: String, required: true, maxlength: 30 },
  numberAllowed: { type: Number, default: null },
  budget: { type: Number, required: true, max: 99999 }
}, { timestamps: true });

export default mongoose.model('AdventureData', adventureDataSchema);
