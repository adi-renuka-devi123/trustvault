import express from 'express';
const router = express.Router();

router.post('/register', (req, res) => {
  console.log('Register hit:', req.body);
  res.json({ message: "Register OK", email: req.body.email });
});

router.post('/login', (req, res) => {
  res.json({ message: "Login OK", email: req.body.email });
});

export default router;