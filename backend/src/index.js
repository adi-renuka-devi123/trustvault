const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// --- CORS FIX ---
const allowedOrigins = [
  "https://trustvault-siik.vercel.app",
  "https://trustvault-2-jx6q.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174"
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(null, true); // temporarily allow all for debugging
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight
app.options('*', cors());

app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('TrustVault backend running - Adi!');
});

// DB connect
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err.message));

// Routes
try {
  let authRoutes = require('./routes/auth');
  if (authRoutes.default) authRoutes = authRoutes.default;
  app.use('/api/auth', authRoutes);
  console.log('Auth routes loaded');
} catch (e) {
  console.log('Auth route error:', e.message);
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