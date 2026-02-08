const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  googleId: { type: String }, // For Google OAuth
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for OAuth users
  phone: { type: String },
  avatar: { type: String }, // Avatar from OAuth
  isOAuth: { type: Boolean, default: false }, // Flag to identify OAuth users
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving (only if password is provided and not OAuth user)
userSchema.pre('save', async function(next) {
  // Only hash password if it's provided and this is not an OAuth user
  if (this.isModified('password') && this.password && !this.isOAuth) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Return true automatically for OAuth users (they don't have local passwords)
  if (this.isOAuth) return true;
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);