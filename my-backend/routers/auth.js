const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

// Initialize Google OAuth2 client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

// Check if Google OAuth is configured
const isGoogleConfigured = () => {
  return process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
};

// Google login
router.get('/google', (req, res, next) => {
  if (!isGoogleConfigured()) {
    return res.status(400).json({
      msg: 'Google OAuth chưa được cấu hình. Vui lòng liên hệ quản trị viên để cập nhật GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET.'
    });
  }

  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Google callback (traditional method using passport.js with redirect)
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login?error=google_auth_failed',
    session: false // We're using JWT, not sessions
  }),
  async (req, res) => {
    try {
      console.log('✅ Google callback triggered');
      console.log('✅ Using callbackURL:', process.env.GOOGLE_CALLBACK_URL);

      // Check if the user exists in our database (created during authentication)
      const user = req.user;

      // Generate JWT token
      const payload = { userId: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });

      // Send confirmation email
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          const mailOptions = {
            from: `"Kế Toán Sen Vàng" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Xác nhận đăng nhập tài khoản - Kế Toán Sen Vàng',
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <title>Xác nhận đăng nhập tài khoản</title>
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="text-align: center; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">
                    <h1 style="color: #FFD700;">KẾ TOÁN SEN VÀNG</h1>
                  </div>

                  <div style="margin: 20px 0;">
                    <h2 style="color: #555;">Xác nhận đăng nhập tài khoản</h2>
                    <p>Xin chào <strong>${user.name}</strong>,</p>
                    <p>Chúng tôi xác nhận rằng bạn đã đăng nhập thành công vào tài khoản trên hệ thống Kế Toán Sen Vàng thông qua Google.</p>
                    <p><strong>Thời gian đăng nhập:</strong> ${new Date().toLocaleString('vi-VN')}</p>
                    <p><strong>Email:</strong> ${user.email}</p>

                    <div style="background-color: #e6f7ee; padding: 15px; border-left: 4px solid #52c41a; margin: 20px 0;">
                      <p>✅ Bạn đã đăng nhập thành công vào web Sen Vàng. Bây giờ bạn có thể sử dụng các dịch vụ của chúng tôi.</p>
                    </div>

                    <p>Đây là email xác nhận tự động. Vui lòng không reply lại email này.</p>
                  </div>

                  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 0.9em;">
                    <p>Trân trọng,<br/><strong>Đội ngũ Kế Toán Sen Vàng</strong></p>
                    <p>© 2025 Kế Toán Sen Vàng. Tất cả quyền được bảo lưu.</p>
                  </div>
                </div>
              </body>
              </html>
            `
          };

          await transporter.sendMail(mailOptions);
          console.log(`Login confirmation email sent to: ${user.email}`);
        } catch (emailErr) {
          console.error('Error sending login confirmation email:', emailErr);
        }
      }

      // Redirect to frontend with token
      res.redirect(`http://localhost:5173/auth/success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
    } catch (err) {
      console.error(err);
      res.redirect('http://localhost:5173/login?error=server_error');
    }
  }
);

// Google callback for JSON response (alternative approach for specific frontend implementations)
router.get('/google/callback/json',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login?error=google_auth_failed',
    session: false // We're using JWT, not sessions
  }),
  async (req, res) => {
    try {
      console.log('✅ Google callback triggered (JSON response)');
      console.log('✅ Using callbackURL:', process.env.GOOGLE_CALLBACK_URL);

      // Check if the user exists in our database (created during authentication)
      const user = req.user;

      // Generate JWT token
      const payload = { userId: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });

      // Send confirmation email
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          const mailOptions = {
            from: `"Kế Toán Sen Vàng" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Xác nhận đăng nhập tài khoản - Kế Toán Sen Vàng',
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <title>Xác nhận đăng nhập tài khoản</title>
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="text-align: center; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">
                    <h1 style="color: #FFD700;">KẾ TOÁN SEN VÀNG</h1>
                  </div>

                  <div style="margin: 20px 0;">
                    <h2 style="color: #555;">Xác nhận đăng nhập tài khoản</h2>
                    <p>Xin chào <strong>${user.name}</strong>,</p>
                    <p>Chúng tôi xác nhận rằng bạn đã đăng nhập thành công vào tài khoản trên hệ thống Kế Toán Sen Vàng thông qua Google.</p>
                    <p><strong>Thời gian đăng nhập:</strong> ${new Date().toLocaleString('vi-VN')}</p>
                    <p><strong>Email:</strong> ${user.email}</p>

                    <div style="background-color: #e6f7ee; padding: 15px; border-left: 4px solid #52c41a; margin: 20px 0;">
                      <p>✅ Bạn đã đăng nhập thành công vào web Sen Vàng. Bây giờ bạn có thể sử dụng các dịch vụ của chúng tôi.</p>
                    </div>

                    <p>Đây là email xác nhận tự động. Vui lòng không reply lại email này.</p>
                  </div>

                  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 0.9em;">
                    <p>Trân trọng,<br/><strong>Đội ngũ Kế Toán Sen Vàng</strong></p>
                    <p>© 2025 Kế Toán Sen Vàng. Tất cả quyền được bảo lưu.</p>
                  </div>
                </div>
              </body>
              </html>
            `
          };

          await transporter.sendMail(mailOptions);
          console.log(`Login confirmation email sent to: ${user.email}`);
        } catch (emailErr) {
          console.error('Error sending login confirmation email:', emailErr);
        }
      }

      // Return JSON response for applications that need it
      res.json({
        success: true,
        token: token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        },
        message: "Đăng nhập thành công!"
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Server error during Google authentication'
      });
    }
  }
);

// Google callback alternative - for compatibility
router.get('/google/callback/alternative',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login?error=google_auth_failed'
  }),
  (req, res) => {
    // User authenticated successfully
    const payload = { userId: req.user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });

    // Redirect with token in URL
    res.redirect(`http://localhost:5173/auth/success?token=${token}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}`);
  }
);

// Google login endpoint (for frontend integration with token verification)
router.post('/google-login', async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const googleUser = ticket.getPayload();

    const { name, email, picture, sub: googleId } = googleUser;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Update user with Google info if they registered without OAuth before
      if (!user.isOAuth) {
        user.googleId = googleId;
        user.avatar = picture;
        user.isOAuth = true;
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        googleId,
        name,
        email,
        avatar: picture,
        isOAuth: true // Mark as OAuth user
      });

      await user.save();

      // Send welcome email for new users
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          const mailOptions = {
            from: `"Kế Toán Sen Vàng" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Chào mừng bạn đến với Kế Toán Sen Vàng',
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <title>Chào mừng bạn đến với Kế Toán Sen Vàng</title>
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="text-align: center; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">
                    <h1 style="color: #FFD700;">KẾ TOÁN SEN VÀNG</h1>
                  </div>

                  <div style="margin: 20px 0;">
                    <h2 style="color: #555;">Chào mừng bạn đến với hệ thống của chúng tôi!</h2>
                    <p>Xin chào <strong>${name}</strong>,</p>
                    <p>Cảm ơn bạn đã đăng ký tài khoản trên hệ thống Kế Toán Sen Vàng thông qua Google.</p>
                    <p>Bạn đã tạo tài khoản thành công và có thể bắt đầu sử dụng các dịch vụ của chúng tôi.</p>

                    <div style="background-color: #e6f7ee; padding: 15px; border-left: 4px solid #52c41a; margin: 20px 0;">
                      <p>✅ Bạn đã đăng ký thành công! Tài khoản của bạn đã được xác thực.</p>
                    </div>

                    <p>Trân trọng,<br/>Đội ngũ Kế Toán Sen Vàng</p>
                  </div>

                  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 0.9em;">
                    <p>© 2025 Kế Toán Sen Vàng. Tất cả quyền được bảo lưu.</p>
                  </div>
                </div>
              </body>
              </html>
            `
          };

          await transporter.sendMail(mailOptions);
          console.log(`Welcome email sent to: ${email}`);
        } catch (emailErr) {
          console.error('Error sending welcome email:', emailErr);
        }
      }
    }

    // Generate JWT token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });

    // Send login confirmation email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: `"Kế Toán Sen Vàng" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: 'Xác nhận đăng nhập tài khoản - Kế Toán Sen Vàng',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Xác nhận đăng nhập tài khoản</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">
                  <h1 style="color: #FFD700;">KẾ TOÁN SEN VÀNG</h1>
                </div>

                <div style="margin: 20px 0;">
                  <h2 style="color: #555;">Xác nhận đăng nhập tài khoản</h2>
                  <p>Xin chào <strong>${user.name}</strong>,</p>
                  <p>Chúng tôi xác nhận rằng bạn đã đăng nhập thành công vào tài khoản trên hệ thống Kế Toán Sen Vàng.</p>
                  <p><strong>Thời gian đăng nhập:</strong> ${new Date().toLocaleString('vi-VN')}</p>
                  <p><strong>Email:</strong> ${user.email}</p>

                  <div style="background-color: #e6f7ee; padding: 15px; border-left: 4px solid #52c41a; margin: 20px 0;">
                    <p>✅ Bạn đã đăng nhập thành công vào web Sen Vàng. Bây giờ bạn có thể sử dụng các dịch vụ của chúng tôi.</p>
                  </div>

                  <p>Đây là email xác nhận tự động. Vui lòng không reply lại email này.</p>
                </div>

                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 0.9em;">
                  <p>Trân trọng,<br/><strong>Đội ngũ Kế Toán Sen Vàng</strong></p>
                  <p>© 2025 Kế Toán Sen Vàng. Tất cả quyền được bảo lưu.</p>
                </div>
              </div>
            </body>
            </html>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Login confirmation email sent to: ${user.email}`);
      } catch (emailErr) {
        console.error('Error sending login confirmation email:', emailErr);
        // Don't fail the login if email fails
      }
    }

    res.json({
      msg: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: 'Token xác thực không hợp lệ hoặc đã hết hạn' });
  }
});

module.exports = router;