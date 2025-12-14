import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import locationRoutes from './routes/LocationRoutes.js';
import cors from 'cors';
import postRoutes from './routes/graphRoutes.js';
import loginRoutes from './routes/login.js'
import PostGraph from './models/PostGraph.js';
import { initNeo4j } from "./test.js";
 

dotenv.config();
const app = express();

const PORT=5000


// connectDB();
initNeo4j(app);  
app.use(express.json());

app.use(cors());

app.use('/api/users', loginRoutes);
app.use('/api/locations',locationRoutes);
app.use('/api/graph', postRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});







