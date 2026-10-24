const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// --- SIMPLE UPLOAD - NO DB NEEDED FOR LIVE ---
const uploadDir = '/tmp/uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, {recursive:true});
const upload = multer({ dest: uploadDir });

app.get('/', (req,res) => res.send('TrustVault Backend LIVE - Ready to Submit!'));
app.get('/api/test', (req,res) => res.json({ok:true, message:"Live"}));

app.post('/api/upload', upload.single('file'), (req,res) => {
  console.log("File:", req.file?.originalname);
  res.json({message:"Upload success", file: req.file?.originalname});
});

app.post('/api/files/upload', upload.single('file'), (req,res) => {
  res.json({message:"Upload success", file: req.file?.originalname});
});

// IMPORTANT - Render kosam 0.0.0.0
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server LIVE on ${PORT}`);
});