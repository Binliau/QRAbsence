// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(cors()); // untuk izinkan akses dari frontend lain seperti localhost:3000
app.use(express.json()); // untuk parsing body request JSON

const absensiRoutes = require('./src/Absensi/absensiRoutes');
const userRoutes = require('./src/User/userRoutes');
const qrRoutes = require('./src/QR/qrRoutes');

app.use('/api/absensi', absensiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/qr', qrRoutes);

// Uji koneksi ke database
const pool = require('./db');
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error connecting to NeonDB:', err.stack);
  }
  console.log('Connected to NeonDB');
  release();
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});