const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    console.log('Register body:', req.body);
    const { email, password, name, username } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and Password required' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists, please login' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      email,
      password: hashedPassword,
      name: name || username || email.split('@')[0],
      username: username || email.split('@')[0]
    });
    
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'trustvault_secret', { expiresIn: '7d' });
    
    res.status(201).json({ token, user: { email: user.email, name: user.name } });
  } catch (err) {
    console.log('Register error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    console.log('Login body:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and Password required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found, please register' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'trustvault_secret', { expiresIn: '7d' });
    
    res.json({ token, user: { email: user.email, name: user.name } });
  } catch (err) {
    console.log('Login error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;