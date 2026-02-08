const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../utils/upload');
const path = require('path');
const fs = require('fs');

// GET all banners
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
    res.json({
      success: true,
      data: banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách banner',
      error: error.message
    });
  }
});

// GET active banners only
router.get('/active', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
    res.json({
      success: true,
      data: banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách banner hoạt động',
      error: error.message
    });
  }
});

// GET single banner
router.get('/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner không tồn tại'
      });
    }
    res.json({
      success: true,
      data: banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy banner',
      error: error.message
    });
  }
});

// CREATE new banner
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, buttonText, buttonLink, image, isActive, sortOrder } = req.body;

    const newBanner = new Banner({
      title,
      description,
      buttonText,
      buttonLink: buttonLink || '/',
      image,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0
    });

    const savedBanner = await newBanner.save();
    res.status(201).json({
      success: true,
      message: 'Banner đã được tạo thành công',
      data: savedBanner
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi khi tạo banner',
      error: error.message
    });
  }
});

// UPDATE banner
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, buttonText, buttonLink, image, isActive, sortOrder } = req.body;

    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        buttonText,
        buttonLink,
        image,
        isActive,
        sortOrder
      },
      { new: true, runValidators: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Banner đã được cập nhật thành công',
      data: banner
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi khi cập nhật banner',
      error: error.message
    });
  }
});

// DELETE banner
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Banner đã được xóa thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa banner',
      error: error.message
    });
  }
});

// ACTIVATE banner
router.patch('/activate/:id', authenticateToken, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Banner đã được kích hoạt',
      data: banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kích hoạt banner',
      error: error.message
    });
  }
});

// DEACTIVATE banner
router.patch('/deactivate/:id', authenticateToken, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Banner đã được vô hiệu hóa',
      data: banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi vô hiệu hóa banner',
      error: error.message
    });
  }
});

// UPLOAD banner image
router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được upload'
      });
    }

    // Return the URL of the uploaded image
    const imageUrl = `/uploads/banners/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Upload ảnh banner thành công',
      url: imageUrl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi upload ảnh banner',
      error: error.message
    });
  }
});

module.exports = router;