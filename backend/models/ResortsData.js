import mongoose from 'mongoose';

const resortsDataSchema = new mongoose.Schema({
  placeId: { type: Number, required: true, unique: true },
  type: { type: String, required: true, maxlength: 25 },
  people: { type: Number, required: true, max: 999 },
  price: { type: Number, required: true, max: 99999 },
  customization: { type: String, required: true, maxlength: 50 },
  area: { type: String, required: true, maxlength: 50 }
}, { timestamps: true });

export default mongoose.model('ResortsData', resortsDataSchema);
