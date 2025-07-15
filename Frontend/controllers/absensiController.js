import { submitAbsensi, getAbsensi, getAbsensiByQR } from '../models/absensiModel';

// For submitting absensi and handling result in a component
export async function handleSubmitAbsensi(id_pegawai, token, setMessage) {
  const res = await submitAbsensi(id_pegawai, token);
  setMessage(res.message || 'Gagal submit absensi');
}

// For getting absensi data for a pegawai and handling result in a component
export async function handleGetAbsensi(id_pegawai, setAbsensi) {
  const res = await getAbsensi(id_pegawai);
  setAbsensi(res.absensi || []);
}

// For getting absensi data by QR code and handling result in a component
export async function handleGetAbsensiByQR(token_qr, setAbsensi) {
  const res = await getAbsensiByQR(token_qr);
  setAbsensi(res.absensi || []);
}