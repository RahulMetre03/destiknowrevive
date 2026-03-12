import express from 'express';
import {
    follow,
    unfollow,
    getFollowStatus,
    getFollowers,
    getFollowing,
} from '../../controller/social/followController.js';

const router = express.Router();

router.post('/:userId', follow);
router.delete('/:userId', unfollow);
router.get('/:userId/status', getFollowStatus);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);

export default router;
