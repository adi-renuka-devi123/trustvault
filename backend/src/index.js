const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(e => console.log(e));

// Auth routes
try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
} catch(e){ console.log("auth route missing") }

const auth = require('./middleware/auth');

// Render kosam /tmp use cheyyali
const uploadDir = '/tmp/uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, {recursive:true});

const storage = multer.diskStorage({
  destination: (req,file,cb)=> cb(null, uploadDir),
  filename: (req,file,cb)=> cb(null, Date.now()+"-"+file.originalname)
});
const upload = multer({storage});

// RENDU ROUTES - Edi hit aina work avvali
app.post('/api/upload', auth, upload.single('file'), (req,res)=>{
  console.log("Upload hit:", req.file?.originalname);
  if(!req.file) return res.status(400).json({message:"No file"});
  res.json({message:"Upload success", file: req.file.originalname});
});

app.post('/api/files/upload', auth, upload.single('file'), (req,res)=>{
  if(!req.file) return res.status(400).json({message:"No file"});
  res.json({message:"Upload success", file: req.file.originalname});
});

app.get('/', (req,res)=> res.send("TrustVault Backend LIVE - 404 FIXED"));
app.get('/api/test', (req,res)=> res.json({status:"ok"}));

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=> console.log("Server "+PORT));