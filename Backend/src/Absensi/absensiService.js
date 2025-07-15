const pool = require('../../db');

async function insertAbsensi(id_pegawai, token) {
  // Check if already absensi
  const checkQuery = `
    SELECT 1 FROM Kehadiran WHERE id_pegawai = $1 AND token_qr = $2
  `;
  const check = await pool.query(checkQuery, [id_pegawai, token]);
  if (check.rows.length > 0) {
    // Already absensi
    throw new Error('Anda sudah melakukan absensi pada QR ini.');
  }

  // Insert if not exists
  const query = `
    INSERT INTO Kehadiran (id_pegawai, token_qr, tanggal)
    VALUES ($1, $2, NOW())
  `;
  await pool.query(query, [id_pegawai, token]);
}

async function findQR(token) {
  const res = await pool.query(
    'SELECT * FROM qr_code WHERE token_qr = $1',
    [token]
  );
  return res.rows;
}

async function getAllAbsensi() {
  const query = `
    SELECT 
      p.nama,
      p.email,
      k.tanggal,
      k.token_qr
    FROM Kehadiran k
    JOIN Pegawai p ON k.id_pegawai = p.id_pegawai
    ORDER BY k.tanggal DESC
  `;
  const result = await pool.query(query);
  return result.rows;
}

async function getAbsensiByQR(token_qr) {
  const result = await pool.query(
    `SELECT k.id_kehadiran, k.tanggal, p.nama, p.email
     FROM kehadiran k
     JOIN pegawai p ON k.id_pegawai = p.id_pegawai
     WHERE k.token_qr = $1
     ORDER BY k.tanggal DESC`,
    [token_qr]
  );
  return result.rows;
}

async function submitAbsensi(id_pegawai, token) {
  // Check if already absensi
  const checkQuery = `
    SELECT 1 FROM Kehadiran WHERE id_pegawai = $1 AND token_qr = $2
  `;
  const check = await pool.query(checkQuery, [id_pegawai, token]);
  if (check.rows.length > 0) {
    // Already absensi
    throw new Error('Kamu sudah absensi hari ini');
  }

  // Insert if not exists
  const query = `
    INSERT INTO Kehadiran (id_pegawai, token_qr, tanggal)
    VALUES ($1, $2, NOW())
  `;
  await pool.query(query, [id_pegawai, token]);
}

module.exports = {
  insertAbsensi,
  findQR,
  getAllAbsensi,
  getAbsensiByQR,
  submitAbsensi,
};
