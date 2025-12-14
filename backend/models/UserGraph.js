// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true, maxlength: 25 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  bio: { type: String, maxlength: 200 },
  avatarUrl: { type: String },
  city: { type: String },

  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
