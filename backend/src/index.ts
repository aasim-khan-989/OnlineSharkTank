import express from 'express';
import dotenv from 'dotenv';
import cors from "cors" // Import CORS middleware
import authRoutes from './routes/authRoutes';
import prisma from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors({
  origin: '*', // Allow all origins
  credentials: true // Enable credentials if needed
}));

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
