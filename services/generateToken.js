const jwt = require('jsonwebtoken');
const config = require("../config/default.js")

function generateToken(payload) {
  try {
    const token = jwt.sign(payload, config.secretKey, { expiresIn: '1h' });
    return token;
  } catch (err) {
    console.error('Error generating token:', err);
    throw err;
  }
}

module.exports = {
  generateToken,
};
