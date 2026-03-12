import express from 'express';
import { getProfile, updateProfile, searchUsers } from '../../controller/social/userController.js';
import { getUserPosts } from '../../controller/social/postController.js';
import { uploadAvatar } from '../../config/cloudinary.js';

const router = express.Router();

router.get('/search', searchUsers);
router.get('/me/profile', (req, res) => {
    req.params.id = req.user._id;
    getProfile(req, res);
});
router.put('/me/profile', (req, res, next) => {
    uploadAvatar(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message });
        next();
    });
}, updateProfile);
router.get('/:id', getProfile);
router.get('/:id/posts', getUserPosts);

export default router;
