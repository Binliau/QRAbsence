const qrService = require('./qrService');

async function generateQR(req, res) {
  const { id_admin } = req.body;
  try {
    const { token, qrImage } = await qrService.generateQR(id_admin);
    res.json({ token, qrImage });
  } catch (err) {
    console.error('Error in generateQR controller:', err);
    if (err.message.includes('already exists')) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Gagal generate QR', error: err.message });
  }
}

async function getLatestQR(req, res) {
  try {
    const qr = await qrService.getLatestQR();
    res.json({ qr });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil QR Code' });
  }
}

async function getAllQR(req, res) {
  try {
    const qrList = await qrService.getAllQR();
    res.json({ qrList });
  } catch (err) {
    console.error('Error in getAllQR:', err);
    res.status(500).json({ message: 'Gagal mengambil data QR', error: err.message });
  }
}

module.exports = {
  generateQR,
  getLatestQR,
  getAllQR,
};