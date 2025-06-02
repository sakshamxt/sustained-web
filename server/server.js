// server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sdgRoutes from './routes/sdgRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import newsRoutes from './routes/newsRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Basic route
app.get('/', (req, res) => {
  res.send('API is running');
});


// Mount auth routes
app.use('/api/auth', authRoutes);

// Mount user routes
app.use('/api/users', userRoutes);

// Mount SDG routes
app.use('/api/sdgs', sdgRoutes);

// Mount progress routes
app.use('/api/progress', progressRoutes);

// Mount Community (news) routes
app.use('/api/community/news', newsRoutes);

// Basic Error Handling Middleware (optional, can be expanded)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});