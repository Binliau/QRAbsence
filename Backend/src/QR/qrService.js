const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const pool = require('../../db');

async function generateQR(id_admin) {
  const token = uuidv4();
  try {
    // Check if a QR code already exists for today
    const check = await pool.query(
      `SELECT * FROM qr_code WHERE DATE(waktu_buat) = CURRENT_DATE`
    );
    if (check.rows.length > 0) {
      throw new Error('QR code for today already exists');
    }

    const qrImage = await QRCode.toDataURL(token);
    await pool.query(
      'INSERT INTO qr_code (token_qr, id_admin) VALUES ($1, $2)',
      [token, id_admin]
    );
    return { token, qrImage };
  } catch (err) {
    console.error('Error in generateQR service:', err);
    throw err;
  }
}

async function getAllQR() {
  try {
    const result = await pool.query('SELECT * FROM qr_code ORDER BY waktu_buat DESC');
    return result.rows;
  } catch (err) {
    console.error('Error in getAllQR:', err); // Add this line
    throw err;
  }
}
module.exports = {
  generateQR,
  getAllQR,
};