import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: Number },
    password: { type: String, required: true },
    city: { type: String },

    // Social profile fields
    displayName: { type: String, maxlength: 50, default: '' },
    bio: { type: String, maxlength: 150, default: '' },
    avatarUrl: { type: String, default: '' },
    avatarPublicId: { type: String, default: '' },

    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },

    isPrivate: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
