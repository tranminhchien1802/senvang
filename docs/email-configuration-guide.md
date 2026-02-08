# Email Configuration Guide

## Setting up Gmail for Email Notifications

To enable email notifications in the application, you need to configure your Gmail account properly. Follow these steps:

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings (https://myaccount.google.com/)
2. Navigate to Security
3. Under "Signing in to Google," enable 2-Step Verification if not already enabled

### Step 2: Generate an App Password
1. Go to your Google Account settings (https://myaccount.google.com/)
2. Navigate to Security
3. Under "Signing in to Google," select "App passwords"
4. You may need to sign in again
5. Select "Mail" for the app and "Other (Custom name)" for the device (name it "Sen Vang App")
6. Click "Generate"
7. Copy the 16-character password that appears (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update Environment Variables
Update your `.env` file in the `my-backend` directory with the correct values:

```env
EMAIL_USER=your_actual_gmail_address@gmail.com
EMAIL_PASS=your_16_character_app_password_with_spaces_removed
```

Replace:
- `your_actual_gmail_address@gmail.com` with your actual Gmail address
- `your_16_character_app_password_with_spaces_removed` with the 16-character app password you generated (remove spaces)

**Example:**
If Google gave you: `abcd efgh ijkl mnop`
Then your .env should contain: `EMAIL_PASS=abcdefghijklmnop`

### Step 4: Restart the Backend Server
After updating the .env file, restart your backend server for the changes to take effect:

```bash
cd my-backend
npm run dev  # or npm start
```

### Alternative Email Services
If you prefer to use other email services, update the transporter configuration in `my-backend/routers/Admin.js`:

For Outlook/Hotmail:
```javascript
const transporter = nodemailer.createTransporter({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

For custom SMTP:
```javascript
const transporter = nodemailer.createTransporter({
  host: 'your-smtp-server.com',
  port: 587, // or 465 for SSL
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

### Testing Email Configuration
To test if your email configuration is working:

1. Make sure your backend server is running
2. Run the test script: `node test-email-config.js` in the my-backend directory
3. Or use the "Gửi lại email" button in the Service Order Manager interface
4. Check the browser console and backend logs for any error messages
5. Verify that the email is received in the customer's inbox (and spam folder)

### Troubleshooting Common Issues

#### Issue: "Invalid login: 535-5.7.8 Username and Password not accepted"
- Solution: Make sure you're using an App Password, not your regular Gmail password
- Ensure 2FA is enabled on your account
- Double-check that you removed spaces from the App Password

#### Issue: "connect ETIMEDOUT" or connection errors
- Solution: Check your firewall settings
- Verify that your network allows outbound connections on port 587

#### Issue: Emails going to spam
- Solution: Ask recipients to mark your emails as "Not Spam"
- Consider using a custom domain for sending emails

#### Issue: "Cấu hình email chưa được thiết lập đúng"
- Solution: Make sure EMAIL_PASS in your .env file is not "mat_khau_ung_dung_gmail"

### Security Best Practices
- Never commit your .env file to version control
- Use strong, unique app passwords
- Regularly rotate your app passwords
- Monitor your email sending activity

### Quick Verification Steps
1. Check that your .env file has the correct EMAIL_USER and EMAIL_PASS
2. Ensure 2FA is enabled on your Google account
3. Verify the App Password was generated correctly (16 characters, no spaces)
4. Restart the backend server after making changes
5. Run the test script to verify configuration