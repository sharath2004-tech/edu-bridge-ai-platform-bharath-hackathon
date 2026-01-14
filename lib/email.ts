import nodemailer from 'nodemailer'

// Create transporter with Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

// Generate random password
export function generatePassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  // Ensure at least one of each type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
  password += '0123456789'[Math.floor(Math.random() * 10)]
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

// Send admin credentials email
export async function sendAdminCredentials(
  email: string,
  adminName: string,
  schoolName: string,
  schoolCode: string,
  password: string
): Promise<boolean> {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: {
        name: 'EduBridge AI Platform',
        address: process.env.SMTP_EMAIL || '',
      },
      to: email,
      subject: 'Welcome to EduBridge - Admin Credentials',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border: 1px solid #ddd;
              border-radius: 0 0 8px 8px;
            }
            .credentials {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #667eea;
            }
            .credential-item {
              margin: 10px 0;
            }
            .label {
              font-weight: bold;
              color: #667eea;
            }
            .value {
              background: #f0f0f0;
              padding: 8px 12px;
              border-radius: 4px;
              display: inline-block;
              margin-left: 10px;
              font-family: monospace;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .button {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              display: inline-block;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #777;
              font-size: 12px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎓 Welcome to EduBridge AI Platform</h1>
          </div>
          
          <div class="content">
            <h2>Hello ${adminName},</h2>
            
            <p>Your school <strong>${schoolName}</strong> has been successfully registered with EduBridge AI Platform!</p>
            
            <p>Your school registration is currently <strong>pending approval</strong> from our super admin team. Once approved, you will be able to access all features of the platform.</p>
            
            <div class="credentials">
              <h3>📧 Your Admin Login Credentials</h3>
              
              <div class="credential-item">
                <span class="label">School Code:</span>
                <span class="value">${schoolCode}</span>
              </div>
              
              <div class="credential-item">
                <span class="label">Email:</span>
                <span class="value">${email}</span>
              </div>
              
              <div class="credential-item">
                <span class="label">Temporary Password:</span>
                <span class="value">${password}</span>
              </div>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important Security Notice:</strong>
              <ul>
                <li>This is a temporary password generated for your account</li>
                <li>Please change your password immediately after your first login</li>
                <li>Never share your password with anyone</li>
                <li>Keep your credentials secure</li>
              </ul>
            </div>
            
            <center>
              <a href="https://edu-bridge-ai-platform-bharath-hack.vercel.app/login" class="button">
                Login to Dashboard
              </a>
            </center>
            
            <h3>What's Next?</h3>
            <ol>
              <li>Wait for admin approval of your school registration</li>
              <li>You will receive a notification once approved</li>
              <li>Login with your credentials</li>
              <li>Change your password in settings</li>
              <li>Complete your school profile</li>
              <li>Start adding teachers and students</li>
            </ol>
            
            <p>If you have any questions or need assistance, please contact our support team.</p>
            
            <p>Best regards,<br>
            <strong>EduBridge AI Platform Team</strong></p>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} EduBridge AI Platform. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
Welcome to EduBridge AI Platform!

Hello ${adminName},

Your school ${schoolName} has been successfully registered!

Your Admin Login Credentials:
- School Code: ${schoolCode}
- Email: ${email}
- Temporary Password: ${password}

IMPORTANT: This is a temporary password. Please change it immediately after your first login.

Your school registration is pending approval from our admin team. You will be notified once approved.

Login URL: https://edu-bridge-ai-platform-bharath-hack.vercel.app/login

Best regards,
EduBridge AI Platform Team
      `,
    }
    
    await transporter.sendMail(mailOptions)
    console.log(`Admin credentials email sent successfully to ${email}`)
    return true
  } catch (error) {
    console.error('Error sending admin credentials email:', error)
    return false
  }
}

// Send school approval notification
export async function sendSchoolApprovalEmail(
  email: string,
  adminName: string,
  schoolName: string
): Promise<boolean> {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: {
        name: 'EduBridge AI Platform',
        address: process.env.SMTP_EMAIL || '',
      },
      to: email,
      subject: '🎉 School Approved - EduBridge AI Platform',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border: 1px solid #ddd;
              border-radius: 0 0 8px 8px;
            }
            .button {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              display: inline-block;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #777;
              font-size: 12px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Congratulations!</h1>
            <h2>Your School Has Been Approved</h2>
          </div>
          
          <div class="content">
            <h2>Hello ${adminName},</h2>
            
            <p>Great news! Your school <strong>${schoolName}</strong> has been approved by our admin team.</p>
            
            <p>You can now access the full features of the EduBridge AI Platform:</p>
            
            <ul>
              <li>✅ Add and manage teachers</li>
              <li>✅ Enroll students</li>
              <li>✅ Create and manage courses</li>
              <li>✅ Track attendance and marks</li>
              <li>✅ Use AI-powered tools</li>
              <li>✅ Access analytics and reports</li>
            </ul>
            
            <center>
              <a href="https://edu-bridge-ai-platform-bharath-hack.vercel.app/login" class="button">
                Access Your Dashboard
              </a>
            </center>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
            
            <p>Best regards,<br>
            <strong>EduBridge AI Platform Team</strong></p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} EduBridge AI Platform. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    }
    
    await transporter.sendMail(mailOptions)
    console.log(`School approval email sent to ${email}`)
    return true
  } catch (error) {
    console.error('Error sending approval email:', error)
    return false
  }
}
