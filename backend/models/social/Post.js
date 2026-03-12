import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
}, { _id: false });

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    images: {
        type: [imageSchema],
        validate: [arr => arr.length >= 1 && arr.length <= 10, 'Must have 1–10 images']
    },
    caption: { type: String, maxlength: 2200, default: '' },
    category: {
        type: String,
        enum: ['restaurant', 'adventure', 'scenery', 'resorts', 'games', ''],
        default: ''
    },

    // References the existing Location collection _id
    placeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        default: null
    },
    placeName: { type: String, default: null }, // denormalized for fast display

    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },

    isArchived: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

// Indexes
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ userId: 1, isDeleted: 1, _id: -1 });
postSchema.index({ placeId: 1, createdAt: -1 });

export default mongoose.model('Post', postSchema);
