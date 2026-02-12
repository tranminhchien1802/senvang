const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Cấu hình thư mục uploads
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer để upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Tạo thư mục con theo loại ảnh
    const type = req.body.type || 'general';
    const typeDir = path.join(uploadDir, type);
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }
    cb(null, typeDir);
  },
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Chỉ cho phép file ảnh
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  }
});

// Endpoint upload ảnh
router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Không có file được upload'
    });
  }

  // Trả về URL của ảnh đã upload
  const imageUrl = `/uploads/${req.body.type || 'general'}/${req.file.filename}`;
  
  res.json({
    success: true,
    message: 'Upload ảnh thành công',
    url: imageUrl,
    filename: req.file.filename
  });
});

// Endpoint xóa ảnh
router.delete('/image/:type/:filename', (req, res) => {
  const { type, filename } = req.params;
  const imagePath = path.join(__dirname, `../public/uploads/${type}/${filename}`);

  fs.unlink(imagePath, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa ảnh',
        error: err.message
      });
    }

    res.json({
      success: true,
      message: 'Xóa ảnh thành công'
    });
  });
});

module.exports = router;