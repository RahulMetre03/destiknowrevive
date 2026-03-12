import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import locationRoutes from './routes/LocationRoutes.js';
import cors from 'cors';
import loginRoutes from './routes/login.js';
import reviewRoutes from './routes/ReviewRoutes.js';

// Social routes
import postRoutes from './routes/social/postRoutes.js';
import feedRoutes from './routes/social/feedRoutes.js';
import followRoutes from './routes/social/followRoutes.js';
import commentRoutes from './routes/social/commentRoutes.js';
import likeRoutes from './routes/social/likeRoutes.js';
import socialUserRoutes from './routes/social/userRoutes.js';

import { authMiddleware } from './middleware/auth.js';

dotenv.config();
const app = express();
const PORT = 5000;

connectDB();
app.use(express.json());
app.use(cors());

app.get('/healthz', (req, res) => res.status(200).send('OK'));

app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});

// Existing routes (public)
app.use('/api/users', loginRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/reviews', reviewRoutes);

// Social routes require authentication
app.use('/api/posts', authMiddleware, postRoutes);
app.use('/api/posts/:id/comments', authMiddleware, commentRoutes);
app.use('/api/posts/:id/like', authMiddleware, likeRoutes);
app.use('/api/feed', authMiddleware, feedRoutes);
app.use('/api/follow', authMiddleware, followRoutes);
app.use('/api/social/users', authMiddleware, socialUserRoutes);

app.get('/', (req, res) => res.send('API is running...'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
