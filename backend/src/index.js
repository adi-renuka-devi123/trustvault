const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Mongo
mongoose.connect(process.env.MONGO_URI).then(()=>console.log("Mongo OK"));

// --- AUTH MIDDLEWARE INSIDE SAME FILE (no import error) ---
const auth = (req,res,next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({message:"No token"});
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.user = decoded;
    next();
  } catch(e){
    return res.status(401).json({message:"Invalid token"});
  }
};

// --- Auth routes from your existing file ---
try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
} catch(e){ 
  console.log("auth routes file missing, using dummy");
  app.post('/api/auth/login', (req,res)=> res.json({token:"dummy"}));
}

// --- UPLOAD ---
const uploadDir = '/tmp/uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, {recursive:true});
const storage = multer.diskStorage({
  destination: (req,file,cb)=> cb(null, uploadDir),
  filename: (req,file,cb)=> cb(null, Date.now()+"-"+file.originalname)
});
const upload = multer({storage});

app.post('/api/upload', auth, upload.single('file'), (req,res)=>{
  res.json({message:"Upload success", file: req.file.originalname});
});
app.post('/api/files/upload', auth, upload.single('file'), (req,res)=>{
  res.json({message:"Upload success", file: req.file.originalname});
});

app.get('/', (req,res)=> res.send("TrustVault Backend FIXED"));
app.get('/api/test', (req,res)=> res.json({ok:true}));

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=> console.log("Running "+PORT));