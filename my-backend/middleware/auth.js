const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Truy cập bị từ chối. Không tìm thấy token.'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token không hợp lệ.'
      });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { authenticateToken };