const express = require('express');
const router = express.Router();
const absensiController = require('./absensiController');

router.post('/submit', absensiController.submitAbsensi);
router.get('/log', absensiController.getAllAbsensi);

// Add this route for absensi by QR code
router.get('/byqr/:token_qr', absensiController.getAbsensiByQR);

module.exports = router;