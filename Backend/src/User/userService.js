const pool = require('../../db');

async function login(userDetails) {
  const { email, password } = userDetails;

  const adminRes = await pool.query(
    'SELECT id_admin AS id, nama, email FROM admin WHERE email = $1 AND password = $2',
    [email, password]
  );

  if (adminRes.rows.length > 0) {
    const admin = adminRes.rows[0];
    return {
      id_admin: admin.id,
      nama: admin.nama,
      email: admin.email,
      role: 'admin'
    };
  }

  const pegawaiRes = await pool.query(
    'SELECT id_pegawai AS id, nama, email FROM pegawai WHERE email = $1 AND password = $2',
    [email, password]
  );

  if (pegawaiRes.rows.length > 0) {
    const pegawai = pegawaiRes.rows[0];
    return {
      id: pegawai.id,
      nama: pegawai.nama,
      email: pegawai.email,
      role: 'pegawai'
    };
  }

  return null;
}

async function register(userDetails) {
  const { nama, email, password } = userDetails;

  // Cek apakah email sudah digunakan
  const check = await pool.query('SELECT * FROM pegawai WHERE email = $1', [email]);
  if (check.rows.length > 0) return null;

  // Masukkan data ke DB
  const result = await pool.query(
    'INSERT INTO pegawai (nama, email, password) VALUES ($1, $2, $3) RETURNING id_pegawai AS id, nama, email',
    [nama, email, password]
  );

  return {
  id_pegawai: result.rows[0].id_pegawai,
  nama: result.rows[0].nama,
  email: result.rows[0].email,
  role: 'pegawai'
  };
}

module.exports = {
  login,
  register
};
