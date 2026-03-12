import Post from '../../models/social/Post.js';
import Follow from '../../models/social/Follow.js';
import Like from '../../models/social/Like.js';

// GET /api/feed?cursor=<postId>&limit=12
export const getFeed = async (req, res) => {
    try {
        console.log("came here");
        const { cursor, limit = 12, category } = req.query;
        const lim = Math.min(parseInt(limit), 30);
        const userId = req.user._id;

        // Get IDs of users the current user follows
        const follows = await Follow.find({ followerId: userId, status: 'accepted' })
            .select('followingId')
            .lean();
        const followingIds = follows.map(f => f.followingId);

        if (followingIds.length === 0) {
            return res.json({ posts: [], nextCursor: null, hasMore: false });
        }

        const query = {
            userId: { $in: followingIds },
            isDeleted: false,
            isArchived: false,
            ...(cursor && { _id: { $lt: cursor } }),
            ...(category && { category })
        };

        console.log(query);

        const posts = await Post.find(query)
            .sort({ _id: -1 })
            .limit(lim + 1)
            .populate('userId', 'username displayName avatarUrl')
            .lean();

        const hasMore = posts.length > lim;
        if (hasMore) posts.pop();

        // Batch-check which posts the current user has liked
        const postIds = posts.map(p => p._id);
        const likes = await Like.find({
            userId: userId,
            targetId: { $in: postIds },
            targetType: 'post',
        }).select('targetId').lean();
        const likedSet = new Set(likes.map(l => l.targetId.toString()));

        const enrichedPosts = posts.map(p => ({
            ...p,
            author: p.userId,
            isLikedByMe: likedSet.has(p._id.toString()),
        }));

        return res.json({
            posts: enrichedPosts,
            nextCursor: hasMore ? posts[posts.length - 1]._id : null,
            hasMore,
        });
    } catch (err) {
        console.error('getFeed error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
