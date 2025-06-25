import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import locationRoutes from './routes/LocationRoutes.js';
import cors from 'cors';

import loginRoutes from './routes/login.js'
dotenv.config();
const app = express();

const PORT=5000


connectDB();
app.use(express.json());

app.use(cors());

app.use('/api/users', loginRoutes);
app.use('/api/locations',locationRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});







