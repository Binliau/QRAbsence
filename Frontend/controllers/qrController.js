import { generateQR } from '../models/qrModel';

export async function handleGenerateQR(id_admin, setResult, setImage) {
  const res = await generateQR(id_admin);
  setResult(res.token_qr || res.token);
  setImage(res.qrImage || null);
}
