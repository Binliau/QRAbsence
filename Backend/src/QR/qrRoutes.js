const express = require('express');
const router = express.Router();
const qrController = require('./qrController');

router.post('/generate', qrController.generateQR);
router.get('/latest', qrController.getLatestQR);
router.get('/all', qrController.getAllQR);

module.exports = router;