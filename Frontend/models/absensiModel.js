export async function submitAbsensi(id_pegawai, token) {
  const res = await fetch('http://localhost:3000/api/absensi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_pegawai, token })
  });
  return await res.json();
}
export async function getAbsensi(id_pegawai) {
  const res = await fetch(`http://localhost:3000/api/absensi/${id_pegawai}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  return await res.json();
}
export async function getAbsensiByQR(token_qr) {
  const res = await fetch(`http://localhost:5000/api/absensi/byqr/${token_qr}`);
  return await res.json();
}