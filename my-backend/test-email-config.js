// Test script to verify email configuration
require('dotenv').config();

const nodemailer = require('nodemailer');

async function testEmailConfig() {
  console.log('🔍 Testing email configuration...\n');

  // Check if environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('❌ EMAIL_USER or EMAIL_PASS not set in environment variables');
    console.log('Current values:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
    console.log('\n💡 Solution: Update your .env file with correct EMAIL_USER and EMAIL_PASS values');
    return;
  }

  // Check for common placeholder values
  if (process.env.EMAIL_PASS === 'mat_khau_ung_dung_gmail') {
    console.log('❌ EMAIL_PASS is set to placeholder value "mat_khau_ung_dung_gmail"');
    console.log('\n💡 Solution: Generate a real Gmail App Password and update your .env file');
    console.log('   1. Go to Google Account settings');
    console.log('   2. Enable 2-Factor Authentication');
    console.log('   3. Go to Security > App passwords');
    console.log('   4. Generate a new password for "Mail"');
    console.log('   5. Use the 16-character password (without spaces) in your .env file');
    return;
  }

  console.log('✅ Environment variables are set');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS length:', process.env.EMAIL_PASS.length);
  console.log('EMAIL_PASS preview:', process.env.EMAIL_PASS.substring(0, 4) + '...' + process.env.EMAIL_PASS.substring(process.env.EMAIL_PASS.length - 2));

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    // Verify transporter
    console.log('\n🔍 Verifying transporter configuration...');
    await transporter.verify();
    console.log('✅ Transporter verified successfully - Email configuration is valid');
  } catch (error) {
    console.log('❌ Transporter verification failed:', error.message);

    if (error.message.includes('Invalid login') || error.message.includes('535')) {
      console.log('\n💡 This is typically caused by:');
      console.log('   1. Incorrect App Password (did you use your regular password instead?)');
      console.log('   2. Spaces in the App Password (remove spaces)');
      console.log('   3. 2-Factor Authentication not enabled on your Google account');
      console.log('   4. App access blocked by your Google account settings');
    }
    return;
  }

  // Test sending an email
  try {
    console.log('\n📧 Sending test email...');
    const testEmail = {
      from: `"Kế Toán Sen Vàng Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send test email to yourself
      subject: 'Test Email Configuration - Kế Toán Sen Vàng',
      html: `
        <h2>✅ Email Configuration Test Successful!</h2>
        <p>This is a test email to verify your email configuration is working correctly.</p>
        <p>If you received this email, your email configuration is set up properly!</p>
        <hr>
        <p><em>This is an automated test message.</em></p>
      `
    };

    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Check your inbox (and spam folder) for the test email.');
  } catch (error) {
    console.log('❌ Error sending test email:', error.message);

    if (error.message.includes('Invalid login') || error.message.includes('535')) {
      console.log('\n💡 Common solutions:');
      console.log('   1. Double-check your App Password (16 characters, no spaces)');
      console.log('   2. Make sure you\'re using an App Password, not your regular Gmail password');
      console.log('   3. Verify 2-Factor Authentication is enabled');
      console.log('   4. Check if your Google account allows "Less secure app access"');
    }
  }
}

testEmailConfig();