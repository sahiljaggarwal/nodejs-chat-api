const express = require('express');
const router = express.Router();

const { UserController } = require('../controllers/index.js');

// Route to handle account creation
router.post('/createAccount', UserController.createAccount);
router.post('/verifyemail', UserController.verifyEmail);
router.post('/login', UserController.login);

module.exports =  router;




