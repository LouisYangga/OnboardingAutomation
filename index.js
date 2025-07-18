import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import routes from './routes/onboardingRoutes.js';
import cors from 'cors';
import { Server } from 'socket.io';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {cors: { origin: '*' } });
const allowedOrigins = [
  'http://localhost:5173',
  "https://portfolio-with-chatbot-five.vercel.app",  // Vercel-provided domain
  "https://louisyangga.com", 
  "https://www.louisyangga.com"];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization','x-api-key']
}));

app.use(express.json());
app.use('/api', routes);

app.set('io', io); // Make io available in routes/controllers

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // <-- Use server.listen, not app.listen
  })
  .catch(err => console.error('MongoDB connection error:', err));
