const jwt = require('jsonwebtoken');

const SECRET_KEY = "your_super_secret_key"; // In production, use process.env.JWT_SECRET

// Generate a token with ID and Role
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, SECRET_KEY, { expiresIn: '24h' });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // console.log("\nauthHeader: " + authHeader + "\n");
  if (!token) {
    // console.log("\nAccess Denied\n");
    return res.status(401).json({ message: "Access Denied" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      // console.log("\nInvalid Token\n");
      return res.status(403).json({ message: "Invalid Token" });
    }
    req.userId = user.id; // req.user = user;
    req.role = user.role; // req.user = user;
    // console.log("authenticated user (jsonwebtoken) :");
    // console.log(req.user);
    // console.log("\n\n");
    next();
  });
};

module.exports = { generateToken, authenticateToken };