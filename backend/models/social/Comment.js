import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: { type: String, required: true, maxlength: 2200 },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    isDeleted: { type: Boolean, default: false },
    likesCount: { type: Number, default: 0 },
}, { timestamps: true });

commentSchema.index({ postId: 1, createdAt: 1 });

export default mongoose.model('Comment', commentSchema);
