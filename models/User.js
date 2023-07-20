const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Remove leading and trailing spaces
    minlength: 3, // Minimum length of username
    maxlength: 30, // Maximum length of username
    validate: {
      validator: function (v) {
        // Validate username with regex pattern
        return /^[a-zA-Z0-9._]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid username!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'normal'],
    default: 'normal',
  },
  profileImage: {
    type: String,
    validate: {
      validator: function (v) {
        // Validate image URL (can be extended for more stringent checks)
        return /^(http|https):\/\/\S+\.(jpeg|jpg|gif|png)$/.test(v);
      },
      message: (props) => `${props.value} is not a valid image URL!`,
    },
  },
  bio: {
    type: String,
    maxlength: 50, // Maximum 50 characters for bio
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationOTP: {
    type: Number,
  },
  verificationExpiry: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
