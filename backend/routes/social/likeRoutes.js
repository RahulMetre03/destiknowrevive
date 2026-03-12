import express from 'express';
import { likePost, unlikePost } from '../../controller/social/likeController.js';

const router = express.Router({ mergeParams: true });

router.post('/', likePost);
router.delete('/', unlikePost);

export default router;
