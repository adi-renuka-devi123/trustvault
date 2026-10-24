const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('TrustVault backend running - Adi!');
});

// DB connect
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err.message));

// Routes - IMPORTANT FIX
try {
  let authRoutes = require('./routes/auth');
  // Fix for Module vs Router issue
  if (authRoutes.default) authRoutes = authRoutes.default;
  app.use('/api/auth', authRoutes);
  console.log('Auth routes loaded');
} catch (e) {
  console.log('Auth route error:', e.message);
  // fallback routes
  app.post('/api/auth/register', (req, res) => {
    res.status(200).json({ message: 'Register route working - add DB logic' });
  });
  app.post('/api/auth/login', (req, res) => {
    res.status(200).json({ message: 'Login route working - add DB logic' });
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('server running on', PORT);
});