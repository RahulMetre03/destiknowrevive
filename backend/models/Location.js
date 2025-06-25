import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  placeName: { type: String, required: true, maxlength: 40 },
  description : {type:String, required: true},
  city : {type:String},
  state: {type:String},
  country : {type:String},
  categoryName: { type: String, required: true, maxlength: 25 },
  categoryId: { type: Number, required: true },
  placeId: { type: Number, required: true, unique: true }
}, { timestamps: true });

export const Location = mongoose.model('Location', locationSchema);
