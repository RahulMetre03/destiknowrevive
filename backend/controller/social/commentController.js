import Comment from '../../models/social/Comment.js';
import Post from '../../models/social/Post.js';

// POST /api/posts/:id/comments
export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const post = await Post.findOne({ _id: req.params.id, isDeleted: false });
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = await Comment.create({
            postId: req.params.id,
            userId: req.user._id,
            text: text.trim(),
        });

        await Post.findByIdAndUpdate(req.params.id, { $inc: { commentsCount: 1 } });

        const populated = await comment.populate('userId', 'username displayName avatarUrl');
        return res.status(201).json({ success: true, comment: populated });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/posts/:id/comments?cursor=&limit=20
export const getComments = async (req, res) => {
    try {
        const { cursor, limit = 20 } = req.query;
        const lim = Math.min(parseInt(limit), 50);

        const query = {
            postId: req.params.id,
            isDeleted: false,
            parentCommentId: null,
            ...(cursor && { _id: { $gt: cursor } }),
        };

        const comments = await Comment.find(query)
            .sort({ createdAt: 1 })
            .limit(lim + 1)
            .populate('userId', 'username displayName avatarUrl')
            .lean();

        const hasMore = comments.length > lim;
        if (hasMore) comments.pop();

        return res.json({
            comments,
            nextCursor: hasMore ? comments[comments.length - 1]._id : null,
            hasMore,
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE /api/posts/:id/comments/:commentId
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findOne({
            _id: req.params.commentId,
            postId: req.params.id,
        });

        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        if (comment.userId.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        comment.isDeleted = true;
        await comment.save();
        await Post.findByIdAndUpdate(req.params.id, { $inc: { commentsCount: -1 } });

        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
