import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  placeName: { type: String, required: true, maxlength: 40 },
  categoryName: { type: String, required: true, maxlength: 25 },
  image: { type: Buffer, required: true },
  categoryId: { type: Number, required: true },
  placeId: { type: Number, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('Location', locationSchema);
