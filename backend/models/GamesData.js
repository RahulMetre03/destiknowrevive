import mongoose from 'mongoose';

const gamesDataSchema = new mongoose.Schema({
  placeId: { type: Number, required: true, unique: true },
  sport: { type: String, required: true, maxlength: 25 },
  area: { type: String, required: true, maxlength: 30 },
  type: { type: String, required: true, maxlength: 30 },
  budget: { type: Number, required: true, max: 99999 }
}, { timestamps: true });

export default mongoose.model('GamesData', gamesDataSchema);
