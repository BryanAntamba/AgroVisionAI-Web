const express = require('express');
const router = express.Router();
const {
  forgotPassword,
  resendCode,
  verifyCode,
  resetPassword,
} = require('../controllers/passwordReset.controller');

router.post('/forgot-password', forgotPassword);
router.post('/resend-code', resendCode);
router.post('/verify-code', verifyCode);
router.post('/reset-password', resetPassword);

module.exports = router;
