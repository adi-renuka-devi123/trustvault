require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
const uploadDir='/tmp/uploads';
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir,{recursive:true});
const upload=multer({dest:uploadDir});
const userSchema=new mongoose.Schema({email:{type:String,unique:true},password:String,name:String},{timestamps:true});
const User=mongoose.models.User||mongoose.model('User',userSchema);
app.get('/',(req,res)=>res.send('TrustVault Backend LIVE with Auth!'));
app.post('/api/auth/register',async(req,res)=>{
 try{const{email,password,name}=req.body;const exists=await User.findOne({email});if(exists)return res.status(400).json({message:"User exists"});const hashed=await bcrypt.hash(password,10);const user=await User.create({email,password:hashed,name});const token=jwt.sign({id:user._id},process.env.JWT_SECRET||'secret');res.json({token,user:{email:user.email,name:user.name}})}catch(e){res.status(500).json({message:e.message})}
});
app.post('/api/auth/login',async(req,res)=>{
 try{const{email,password}=req.body;const user=await User.findOne({email});if(!user)return res.status(400).json({message:"No user"});const ok=await bcrypt.compare(password,user.password);if(!ok)return res.status(400).json({message:"Wrong password"});const token=jwt.sign({id:user._id},process.env.JWT_SECRET||'secret');res.json({token,user:{email:user.email,name:user.name}})}catch(e){res.status(500).json({message:e.message})}
});
app.post('/api/upload',upload.single('file'),(req,res)=>{res.json({message:"Uploaded!",file:req.file?.originalname})});
app.post('/api/files/upload',upload.single('file'),(req,res)=>{res.json({message:"Uploaded!",file:req.file?.originalname})});
const PORT=process.env.PORT||10000;
app.listen(PORT,'0.0.0.0',()=>console.log(`✅ LIVE on ${PORT}`));
if(process.env.MONGO_URI){mongoose.connect(process.env.MONGO_URI).then(()=>console.log("✅ MongoDB Connected")).catch(err=>console.log("❌ Mongo Error:",err.message));}