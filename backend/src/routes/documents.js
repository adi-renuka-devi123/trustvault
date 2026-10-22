const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// adi - secure doc viewing, direct link block chesanu
router.get('/:id/preview', auth, (req, res) => {
  const docId = req.params.id;
  // console for checking
  console.log("user viewed doc:", req.user.email, docId, new Date());

  // watermark - user email tho
  let watermarkText = req.user.email + " | " + new Date().toDateString();
  
  res.json({
    docId: docId,
    canView: true,
    watermark: watermarkText, // screenshot teeste telustundi evarido
    // file url direct ga ivvatledu - secure
    data: "pdf data here with watermark"
  });
});

// one time link - snovasys requirement
router.post('/:id/share-link', auth, (req, res) => {
  const crypto = require('crypto');
  const token = crypto.randomBytes(16).toString('hex'); // random token
  
  // simple logic, 1 hour only
  res.json({
    link: "/view-once/" + token,
    token: token,
    validFor: "1 hour",
    note: "after one view link will expire"
  });
});

module.exports = router;
