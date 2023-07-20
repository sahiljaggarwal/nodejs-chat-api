const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail, generateOTP } = require('../services/emailService');
const { generateToken } = require("../services/generateToken")

const createAccount = async (req, res) => {
  try {
    // Extract data from the request body
    const { name, username, email, password, role } = req.body;

    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Generate verification OTP and send it via email
    const verificationOTP = generateOTP();
    await sendVerificationEmail(email, verificationOTP);

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user based on the User model
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword, // Use the hashed password
      role,
      verificationOTP, // Store the verification OTP in the user schema
      verificationExpiry: Date.now() + 3600000, // Set the expiry time to 1 hour from now
    });

    // Save the user to the database
    await newUser.save();

    // Return the created user data in the response
    res.status(201).json({ message: 'Account created successfully!', user: newUser });
  } catch (err) {
    console.error('Error creating account:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyEmail =  async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.verificationOTP === otp && user.verificationExpiry > Date.now()) {
      user.isVerified = true;
      await user.save();

      res.status(200).json({ message: 'Email verified successfully!' });
    } else {
      res.status(400).json({ error: 'Invalid OTP or OTP has expired.' });
    }
  } catch (err) {
    console.error('Error verifying email:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(403).json({ error: 'User is not verified. Please verify your email.' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // // Generate JWT token with user data (id, email, username)

    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
    };
    const token = generateToken(payload);

    // Return the JWT token as a response
    res.status(200).json({ token, message: "login successfully" });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  createAccount,
  verifyEmail,
  login
};
