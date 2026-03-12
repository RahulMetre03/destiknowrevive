import express from 'express';
import { getFeed } from '../../controller/social/feedController.js';

const router = express.Router();

router.get('/', getFeed);

export default router;
