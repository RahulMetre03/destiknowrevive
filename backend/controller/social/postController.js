import Post from '../../models/social/Post.js';
import { User } from '../../models/user.js';
import { Location } from '../../models/Location.js';
import cloudinary from '../../config/cloudinary.js';

// POST /api/posts  (multipart/form-data)
export const createPost = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one image is required' });
        }

        const { caption, placeId, category } = req.body;

        // Build image array from Cloudinary upload results
        const images = req.files.map(f => ({
            url: f.path,
            publicId: f.filename,
            width: f.width || null,
            height: f.height || null,
            format: f.format || null,
        }));

        // Optionally resolve placeName from existing Location collection
        let placeName = null;
        if (placeId) {
            const loc = await Location.findById(placeId).select('placeName').lean();
            if (loc) placeName = loc.placeName;
        }

        const post = await Post.create({
            userId: req.user._id,
            images,
            caption: caption || '',
            placeId: placeId || null,
            placeName,
            category: category || '',
        });

        // Increment user post counter atomically
        await User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: 1 } });

        return res.status(201).json({ success: true, post });
    } catch (err) {
        console.error('createPost error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/posts/:id
export const getPost = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id, isDeleted: false })
            .populate('userId', 'username displayName avatarUrl')
            .lean();

        if (!post) return res.status(404).json({ message: 'Post not found' });
        return res.json({ post });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE /api/posts/:id  (soft delete)
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id, isDeleted: false });
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.userId.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Delete images from Cloudinary
        await Promise.all(post.images.map(img =>
            cloudinary.uploader.destroy(img.publicId).catch(() => { })
        ));

        post.isDeleted = true;
        await post.save();
        await User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: -1 } });

        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/users/:id/posts?cursor=<postId>&limit=12
export const getUserPosts = async (req, res) => {
    try {
        const { cursor, limit = 12 } = req.query;
        const lim = Math.min(parseInt(limit), 30);
        const query = {
            userId: req.params.id,
            isDeleted: false,
            isArchived: false,
            ...(cursor && { _id: { $lt: cursor } }),
        };

        const posts = await Post.find(query)
            .sort({ _id: -1 })
            .limit(lim + 1)
            .lean();

        const hasMore = posts.length > lim;
        if (hasMore) posts.pop();

        return res.json({
            posts,
            nextCursor: hasMore ? posts[posts.length - 1]._id : null,
            hasMore,
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
