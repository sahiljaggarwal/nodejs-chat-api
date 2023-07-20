const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  // Setup your email service provider here (e.g., Gmail, Outlook, etc.)
  service: 'Gmail', // Set the email service provider (Gmail in this case)
  auth: {
    user: 'sahiljaggarwal6@gmail.com', // Your email address
    pass: 'psemifmkbjgapcnf', // Your email account password or application-specific password
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const sendVerificationEmail = async (email, verificationOTP) => {
  try {
    const otp = verificationOTP;
    const mailOptions = {
      from: 'sahiljaggarwal6@gmail.com',
      to: email,
      subject: 'Email Verification OTP',
      text: `Your OTP for email verification is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return otp;
  } catch (err) {
    console.error('Error sending verification email:', err);
    throw err;
  }
};



module.exports = {
  sendVerificationEmail,
  generateOTP
};
