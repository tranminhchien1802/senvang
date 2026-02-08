const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Allow null for public orders
  },
  orderType: {
    type: String,
    enum: ['package', 'registration'],  // package for service purchases, registration for user registration
    default: 'package'
  },
  packageName: {
    type: String,
    required: function() { return this.orderType === 'package'; }  // Required only for package orders
  },
  packagePrice: {
    type: String,
    required: function() { return this.orderType === 'package'; }  // Required only for package orders
  },
  packagePriceNumber: {
    type: Number,
    required: function() { return this.orderType === 'package'; }  // Required only for package orders
  },
  customerInfo: {
    fullName: String,
    phone: String,
    email: String
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled', 'completed'],
    default: 'completed' // For registration orders, default to completed
  },
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paymentQrCode: String,
  paymentDeadline: Date,
  captcha: String  // Add captcha field
});

// Middleware để chuyển đổi giá từ chuỗi sang số
orderSchema.pre('save', function(next) {
  // Chuyển đổi giá từ chuỗi như "1.500.000đ" sang số, chỉ khi packagePriceNumber chưa được thiết lập
  if (this.packagePrice && !this.packagePriceNumber) {
    // Loại bỏ các ký tự không phải số và chuyển sang số
    const priceStr = this.packagePrice.replace(/[^\d]/g, '');
    this.packagePriceNumber = parseInt(priceStr) || 0;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);