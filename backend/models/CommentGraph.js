// models/Comment.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  commentId: { type: String, required: true, unique: true },
  postId: { type: String, required: true },
  userId: { type: String, required: true },

  text: { type: String, required: true, maxlength: 200 }
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);
