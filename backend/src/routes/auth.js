import express from 'express';
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    res.json({ message: "Register success", user: req.body });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  res.json({ message: "Login success" });
});

export default router;