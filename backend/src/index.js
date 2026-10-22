require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Security headers
app.use(helmet());
app.use(cors());
app.use(express.json());

// T3 FIX: No static serving of private_storage folder

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'TrustVault Secure API Running', secure: true });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/documents', require('./routes/documents'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`TrustVault running on port ${PORT}`);
});
