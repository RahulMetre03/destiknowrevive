// models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  postId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  placeId: { type: Number, required: true },

  caption: { type: String, maxlength: 300 },

  media: [
    {
      url: { type: String, required: true },
      type: { type: String, enum: ["image", "video"], required: true }
    }
  ],

  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
