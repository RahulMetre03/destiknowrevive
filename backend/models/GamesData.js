import mongoose from 'mongoose';

const gamesDataSchema = new mongoose.Schema({
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
    unique: true
  },
  sport: { type: String, required: true, maxlength: 25 },
  area: { type: String, required: true, maxlength: 30 },
  type: { type: String, required: true, maxlength: 30 },
  budget: { type: Number, required: true, max: 99999 }
}, { timestamps: true });

export default mongoose.model('gamesdatas', gamesDataSchema);
