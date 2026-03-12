import express from 'express';
import { createPost, getPost, deletePost, getUserPosts } from '../../controller/social/postController.js';
import { uploadPostImages } from '../../config/cloudinary.js';

const router = express.Router();

router.post('/', (req, res, next) => {
    uploadPostImages(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message });
        next();
    });
}, createPost);

router.get('/:id', getPost);
router.delete('/:id', deletePost);

export default router;
