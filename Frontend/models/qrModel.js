export async function generateQR(id_admin) {
  const response = await fetch('https://qrabsence.onrender.com/api/qr/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_admin })
  });
  return await response.json();
}
