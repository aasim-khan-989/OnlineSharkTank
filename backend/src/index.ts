import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import prisma from './config/db';
import profileRoutes from './routes/profileRoutes'; 
import feedRoutes from "./routes/feedRoutes"
import userRoutes from "./routes/userRoutes"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for specific origins
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Adjust this in production
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Test the database connection
prisma.$connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Failed to connect to the database', error);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use("/api/feed",feedRoutes)
app.use("/api/user",userRoutes)
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
