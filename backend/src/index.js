const express = require('express');
const cors = require('cors');
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes - adi added
const docRoutes = require('./routes/documents');
const authRoutes = require('./routes/auth');

app.use('/api/documents', docRoutes);
app.use('/api/auth', authRoutes);

// test route
app.get('/', (req, res) => {
  res.send('TrustVault backend running - Adi');
});

// no static folder here, private docs should not be public
// app.use(express.static('private_storage')) - removed this, its not secure

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('server running on', PORT);
});
