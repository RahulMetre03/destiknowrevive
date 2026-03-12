import { User } from '../../models/user.js';
import Follow from '../../models/social/Follow.js';
import cloudinary from '../../config/cloudinary.js';

// GET /api/social/users/:id
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -avatarPublicId')
            .lean();

        if (!user) return res.status(404).json({ message: 'User not found' });

        const followDoc = await Follow.findOne({
            followerId: req.user._id,
            followingId: req.params.id,
        }).lean();

        return res.json({
            user: {
                ...user,
                isFollowedByMe: !!followDoc,
                followStatus: followDoc?.status || null,
            },
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// PUT /api/social/users/me/profile
export const updateProfile = async (req, res) => {
    try {
        const { displayName, bio, isPrivate } = req.body;
        const update = {};
        if (displayName !== undefined) update.displayName = displayName;
        if (bio !== undefined) update.bio = bio;
        if (isPrivate !== undefined) update.isPrivate = isPrivate;

        // Handle avatar upload
        if (req.file) {
            const user = await User.findById(req.user._id).select('avatarPublicId').lean();
            // Delete old avatar if exists
            if (user.avatarPublicId) {
                await cloudinary.uploader.destroy(user.avatarPublicId).catch(() => { });
            }
            update.avatarUrl = req.file.path;
            update.avatarPublicId = req.file.filename;
        }

        const updated = await User.findByIdAndUpdate(
            req.user._id,
            update,
            { new: true, select: '-password -avatarPublicId' }
        );

        return res.json({ success: true, user: updated });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/social/users/search?q=rahul
export const searchUsers = async (req, res) => {
    try {
        const { q = '' } = req.query;
        if (!q.trim()) return res.json({ users: [] });

        const users = await User.find({
            $or: [
                { username: { $regex: q, $options: 'i' } },
                { displayName: { $regex: q, $options: 'i' } },
            ],
            _id: { $ne: req.user._id }, // exclude self
        })
            .select('username displayName avatarUrl followersCount')
            .limit(20)
            .lean();

        return res.json({ users });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
