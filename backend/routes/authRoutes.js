const express = require('express');
const router = express.Router();
const {
  login,
  requestPasswordReset,
  verifyCode,
  changePassword,
  resendCode,
} = require('../controllers/authController');

router.post('/login', login);
router.post('/request-password-reset', requestPasswordReset);
router.post('/verify-code', verifyCode);
router.post('/change-password', changePassword);
router.post('/resend-code', resendCode);

module.exports = router;