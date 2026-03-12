import express from 'express';
import { addComment, getComments, deleteComment } from '../../controller/social/commentController.js';

const router = express.Router({ mergeParams: true }); // inherit :id from posts router

router.post('/', addComment);
router.get('/', getComments);
router.delete('/:commentId', deleteComment);

export default router;
