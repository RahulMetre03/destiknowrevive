import mongoose from 'mongoose';

const filtersSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['restaurant', 'adventure', 'scenery', 'resorts', 'games']
  },
  filters: [{
    type: String,
    required: true
  }]
}, { timestamps: true });

export default mongoose.model('Filters', filtersSchema);
