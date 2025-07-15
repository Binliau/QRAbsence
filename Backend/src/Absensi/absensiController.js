const absensiService = require('./absensiService');

async function submitAbsensi(req, res) {
  const { token, id_pegawai } = req.body;
  console.log('submitAbsensi called with:', { token, id_pegawai });
  try {
    // Only call the service, let it handle all logic
    await absensiService.submitAbsensi(id_pegawai, token);
    res.json({ message: 'Absensi sukses' });
  } catch (err) {
  if (
    err.message.includes('Sudah melakukan absensi') ||
    err.message.includes('Kamu sudah absensi hari ini')
  ) {
    return res.status(400).json({ message: err.message });
  }
  if (err.message.includes('Invalid QR token')) {
    return res.status(400).json({ message: err.message });
  }
  console.error('Error in submitAbsensi:', err);
  res.status(500).json({ message: 'Gagal submit absensi', error: err.message });
}
}

async function getAllAbsensi(req, res) {
  try {
    const absensi = await absensiService.getAllAbsensi();
    res.json({ absensi });
  } catch (err) {
    console.error('Error in getAllAbsensi:', err);
    res.status(500).json({ message: 'Gagal mengambil data absensi', error: err.message });
  }
}

async function getAbsensiByQR(req, res) {
  const { token_qr } = req.params;
  try {
    const absensi = await absensiService.getAbsensiByQR(token_qr);
    res.json({ absensi });
  } catch (err) {
    console.error('Error in getAbsensiByQR:', err);
    res.status(500).json({ message: 'Gagal mengambil data absensi', error: err.message });
  }
}

module.exports = {
  submitAbsensi,
  getAllAbsensi,
  getAbsensiByQR
};