const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { authenticateToken } = require('../middleware/auth');

// GET all settings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const settings = await Setting.find({});
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách cài đặt',
      error: error.message
    });
  }
});

// GET setting by key
router.get('/:key', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Cài đặt không tồn tại'
      });
    }
    res.json({
      success: true,
      data: setting.value
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy cài đặt',
      error: error.message
    });
  }
});

// UPDATE or CREATE setting
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'Key là bắt buộc'
      });
    }

    // Find existing setting or create new one
    let setting = await Setting.findOne({ key: key });
    
    if (setting) {
      // Update existing setting
      setting.value = value;
      await setting.save();
    } else {
      // Create new setting
      setting = new Setting({
        key,
        value
      });
      await setting.save();
    }

    res.json({
      success: true,
      message: 'Cài đặt đã được cập nhật thành công',
      data: setting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật cài đặt',
      error: error.message
    });
  }
});

// UPDATE specific setting by key
router.put('/:key', authenticateToken, async (req, res) => {
  try {
    const { value } = req.body;

    let setting = await Setting.findOne({ key: req.params.key });
    
    if (setting) {
      // Update existing setting
      setting.value = value;
      await setting.save();
    } else {
      // Create new setting
      setting = new Setting({
        key: req.params.key,
        value
      });
      await setting.save();
    }

    res.json({
      success: true,
      message: 'Cài đặt đã được cập nhật thành công',
      data: setting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật cài đặt',
      error: error.message
    });
  }
});

// DELETE setting
router.delete('/:key', authenticateToken, async (req, res) => {
  try {
    const setting = await Setting.findOneAndDelete({ key: req.params.key });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Cài đặt không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Cài đặt đã được xóa thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa cài đặt',
      error: error.message
    });
  }
});

module.exports = router;