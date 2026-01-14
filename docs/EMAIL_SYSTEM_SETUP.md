# 📧 Email System Setup Guide

## Overview
The EduBridge AI Platform now includes an automated email system that sends credentials to school administrators when they register. The system uses Gmail SMTP for reliable email delivery.

## Features

### 1. **Automatic Credential Generation**
- When a school registers, a secure 12-character password is automatically generated for the admin
- Password includes uppercase, lowercase, numbers, and special characters
- Admin doesn't need to create a password during registration

### 2. **Email Notifications**
- **Registration Email**: Sent immediately after school registration with:
  - School code
  - Admin email
  - Auto-generated temporary password
  - Instructions to change password
  - Link to login page
  
- **Approval Email**: Sent when super-admin approves the school with:
  - Approval confirmation
  - Features available
  - Link to dashboard

### 3. **Security Features**
- Passwords are auto-generated with strong complexity
- Emails sent via secure Gmail SMTP
- Credentials are hashed in database
- Users prompted to change password after first login

## Setup Instructions

### Step 1: Enable Gmail SMTP

1. **Go to your Google Account**
   - Visit: https://myaccount.google.com/security

2. **Enable 2-Step Verification**
   - Click on "2-Step Verification"
   - Follow the setup wizard
   - This is required for App Passwords

3. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Enter "EduBridge Platform" as the name
   - Click "Generate"
   - Copy the 16-character password (remove spaces)

### Step 2: Configure Environment Variables

Edit your `.env.local` file:

```env
# Email Configuration
SMTP_EMAIL=your-actual-email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop  # 16-character app password (no spaces)
```

**Example:**
```env
SMTP_EMAIL=edubridge.platform@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop  # Copy exactly as shown by Google
```

### Step 3: Test the Email System

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Register a test school:**
   - Go to: http://localhost:3000/school-registration
   - Fill in the school details
   - Use a real email address you can access
   - Submit the form

3. **Check your email inbox:**
   - You should receive an email with credentials
   - Check spam folder if not in inbox

## Email Templates

### Registration Email
```
Subject: Welcome to EduBridge - Admin Credentials

Content includes:
- Welcome message
- School information
- Login credentials
- Security notice
- Next steps
- Login link
```

### Approval Email
```
Subject: 🎉 School Approved - EduBridge AI Platform

Content includes:
- Approval confirmation
- Available features
- Dashboard link
```

## Troubleshooting

### Issue: Emails not sending

**Solution 1: Check environment variables**
```bash
# Verify in .env.local
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

**Solution 2: Verify App Password**
- Make sure 2-Step Verification is enabled
- Generate a new App Password
- Remove all spaces from the password
- Update .env.local

**Solution 3: Check Gmail security**
- Go to: https://myaccount.google.com/security
- Check "Recent security events"
- Allow EduBridge if blocked

### Issue: Error "Invalid login"

**Cause:** Using regular Gmail password instead of App Password

**Solution:** 
- Generate App Password from Google Account
- Use the 16-character App Password, not your Gmail password

### Issue: Emails going to spam

**Solution:**
- Add your sending email to contacts
- Mark email as "Not Spam"
- For production: Use a dedicated email service (SendGrid, AWS SES)

### Issue: Registration completes but no email

**Cause:** Email sending is non-blocking - registration succeeds even if email fails

**Solution:**
- Check server logs for email errors
- Verify SMTP credentials
- Test with a different email address

## Production Deployment

### For Vercel Deployment:

1. **Add environment variables in Vercel:**
   ```
   Dashboard → Settings → Environment Variables
   ```

2. **Add these variables:**
   - `SMTP_EMAIL`: Your Gmail address
   - `SMTP_PASSWORD`: Your App Password
   - `NEXT_PUBLIC_APP_URL`: Your production URL

3. **Redeploy:**
   ```bash
   vercel --prod
   ```

### For Better Production Email:

Consider using dedicated email services for better deliverability:

1. **SendGrid**
   - Free tier: 100 emails/day
   - Better deliverability
   - Easy setup

2. **AWS SES**
   - Very low cost
   - High reliability
   - Requires AWS account

3. **Mailgun**
   - Free tier: 5,000 emails/month
   - Good documentation
   - Easy integration

## Code Files Modified

1. **lib/email.ts** (NEW)
   - Email utility functions
   - Password generator
   - Email templates
   - Nodemailer configuration

2. **app/api/school-registration/route.ts**
   - Auto-generate password
   - Create admin user
   - Send credentials email

3. **app/api/super-admin/schools/route.ts**
   - Send approval email when school activated

4. **app/school-registration/page.tsx**
   - Removed password fields
   - Added info about auto-generated passwords

5. **.env.local & .env.example**
   - Added SMTP configuration

## Security Best Practices

1. ✅ **Never commit .env.local to git**
   - Already in .gitignore
   
2. ✅ **Use App Passwords, not account password**
   - More secure
   - Can be revoked independently

3. ✅ **Rotate credentials regularly**
   - Generate new App Password monthly

4. ✅ **Monitor email usage**
   - Check for unusual activity
   - Gmail free tier: ~500 emails/day

5. ✅ **Use dedicated email for production**
   - Create edubridge.platform@gmail.com
   - Don't use personal email

## Features in Action

### Registration Flow:
1. User fills school registration form (no password required)
2. System generates 12-character secure password
3. Admin user created with hashed password
4. Email sent with credentials
5. User receives email with login details
6. User logs in and changes password

### Approval Flow:
1. Super-admin approves school
2. System sends approval email to admin
3. Admin receives notification
4. Admin can now access full features

## Testing Commands

```bash
# Test development
npm run dev

# Test build
npm run build

# Check for errors
npm run lint
```

## Support

If you encounter issues:
1. Check this documentation
2. Verify environment variables
3. Check server logs
4. Test with different email addresses
5. Verify Gmail App Password is correct

## Future Enhancements

Planned features:
- [ ] Password reset via email
- [ ] Email verification
- [ ] Welcome email for teachers/students
- [ ] Bulk email notifications
- [ ] Email templates customization
- [ ] Multi-language email support
