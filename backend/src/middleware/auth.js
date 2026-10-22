const jwt = require('jsonwebtoken');

// simple auth check
function auth(req, res, next) {
  let token = req.headers.authorization;
  if(!token){
    return res.status(401).json({msg: "no token, login first"});
  }
  token = token.replace("Bearer ", "");
  try {
    let decoded = jwt.verify(token, "trustvault_secret_2026");
    req.user = decoded;
    next();
  } catch(err) {
    // token wrong
    return res.status(401).json({msg: "token invalid"});
  }
}

module.exports = auth;
