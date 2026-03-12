import Follow from '../../models/social/Follow.js';
import { User } from '../../models/user.js';

// POST /api/follow/:userId
export const follow = async (req, res) => {
    try {
        const followerId = req.user._id;
        const followingId = req.params.userId;

        if (followerId === followingId) {
            return res.status(400).json({ message: 'Cannot follow yourself' });
        }

        const target = await User.findById(followingId);
        if (!target) return res.status(404).json({ message: 'User not found' });

        const status = target.isPrivate ? 'pending' : 'accepted';

        // upsert — idempotent
        await Follow.findOneAndUpdate(
            { followerId, followingId },
            { followerId, followingId, status },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (status === 'accepted') {
            await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
            await User.findByIdAndUpdate(followingId, { $inc: { followersCount: 1 } });
        }

        const me = await User.findById(followerId).select('followingCount').lean();
        return res.json({ success: true, status, followingCount: me.followingCount });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Already following' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE /api/follow/:userId
export const unfollow = async (req, res) => {
    try {
        const followerId = req.user._id;
        const followingId = req.params.userId;

        const doc = await Follow.findOneAndDelete({ followerId, followingId });
        if (!doc) return res.status(404).json({ message: 'Not following this user' });

        if (doc.status === 'accepted') {
            await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
            await User.findByIdAndUpdate(followingId, { $inc: { followersCount: -1 } });
        }

        const me = await User.findById(followerId).select('followingCount').lean();
        return res.json({ success: true, followingCount: me.followingCount });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/follow/:userId/status
export const getFollowStatus = async (req, res) => {
    try {
        const doc = await Follow.findOne({
            followerId: req.user._id,
            followingId: req.params.userId,
        }).lean();

        return res.json({ isFollowing: !!doc, status: doc?.status || null });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/follow/:userId/followers?cursor=&limit=20
export const getFollowers = async (req, res) => {
    try {
        const { cursor, limit = 20 } = req.query;
        const lim = Math.min(parseInt(limit), 50);

        const docs = await Follow.find({
            followingId: req.params.userId,
            status: 'accepted',
            ...(cursor && { _id: { $lt: cursor } }),
        })
            .sort({ _id: -1 })
            .limit(lim + 1)
            .populate('followerId', 'username displayName avatarUrl')
            .lean();

        const hasMore = docs.length > lim;
        if (hasMore) docs.pop();

        return res.json({
            users: docs.map(d => d.followerId),
            nextCursor: hasMore ? docs[docs.length - 1]._id : null,
            hasMore,
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/follow/:userId/following?cursor=&limit=20
export const getFollowing = async (req, res) => {
    try {
        const { cursor, limit = 20 } = req.query;
        const lim = Math.min(parseInt(limit), 50);

        const docs = await Follow.find({
            followerId: req.params.userId,
            status: 'accepted',
            ...(cursor && { _id: { $lt: cursor } }),
        })
            .sort({ _id: -1 })
            .limit(lim + 1)
            .populate('followingId', 'username displayName avatarUrl')
            .lean();

        const hasMore = docs.length > lim;
        if (hasMore) docs.pop();

        return res.json({
            users: docs.map(d => d.followingId),
            nextCursor: hasMore ? docs[docs.length - 1]._id : null,
            hasMore,
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
