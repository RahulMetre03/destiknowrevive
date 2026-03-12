import Like from '../../models/social/Like.js';
import Post from '../../models/social/Post.js';

// POST /api/posts/:id/like
export const likePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findOne({ _id: postId, isDeleted: false });
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // upsert — safe if already liked
        const result = await Like.findOneAndUpdate(
            { userId, targetId: postId, targetType: 'post' },
            { userId, targetId: postId, targetType: 'post' },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Only increment if doc was newly inserted
        if (result._id) {
            await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
        }

        const updated = await Post.findById(postId).select('likesCount').lean();
        return res.json({ success: true, likesCount: updated.likesCount, isLiked: true });
    } catch (err) {
        if (err.code === 11000) {
            // Already liked — return current count anyway
            const p = await Post.findById(req.params.id).select('likesCount').lean();
            return res.json({ success: true, likesCount: p?.likesCount ?? 0, isLiked: true });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE /api/posts/:id/like
export const unlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;

        const doc = await Like.findOneAndDelete({
            userId, targetId: postId, targetType: 'post',
        });

        if (doc) {
            await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
        }

        const updated = await Post.findById(postId).select('likesCount').lean();
        return res.json({ success: true, likesCount: Math.max(0, updated?.likesCount ?? 0), isLiked: false });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
