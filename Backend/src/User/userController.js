const userService = require('./userService');

async function login(req, res) {
  const userDetails = req.body;

  try {
    const user = await userService.login(userDetails);
    if (!user) {
      return res.status(401).json({ message: 'Login gagal, email atau password salah' });
    }

    const message = user.role === 'admin'
      ? 'Login berhasil sebagai Admin'
      : 'Login berhasil sebagai Pegawai';

    res.json({ message, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan saat login' });
  }
}

async function register(req, res) {
  const userDetails = req.body;

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userDetails.email)) {
    return res.status(400).json({ message: 'Email tidak valid' });
  }

  // Password must contain at least one number
  if (!/\d/.test(userDetails.password)) {
    return res.status(400).json({ message: 'Password harus mengandung angka' });
  }

  try {
    const user = await userService.register(userDetails);
    if (!user) {
      return res.status(400).json({ message: 'Email sudah digunakan' });
    }

    res.status(201).json({ message: 'Registrasi berhasil', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal melakukan registrasi' });
  }
}

module.exports = {
  login,
  register
};
