import React, { useState, useEffect, useRef } from 'react';
import { handleGenerateQR } from '../controllers/qrController';
import QRCode from 'qrcode';
import BannerLogo from '../components/BannerLogo';

function GenerateQRView() {
  const user = JSON.parse(localStorage.getItem('user'));
  const id_admin = user?.id_admin;
  const [token, setToken] = useState('');
  const [image, setImage] = useState('');
  const [qrList, setQrList] = useState([]);
  const [absensi, setAbsensi] = useState([]);
  const [selectedQR, setSelectedQR] = useState({ token: '', image: '' });
  const [message, setMessage] = useState('');
  const [absensiInfo, setAbsensiInfo] = useState('');
  const qrImageRef = useRef();
  const [imageLoaded, setImageLoaded] = useState(false);


  useEffect(() => {
    fetch('https://qrabsence.onrender.com/api/qr/all')
      .then(res => res.json())
      .then(data => setQrList(data.qrCodes || []));
  }, []);

  // Check if there is already a QR code for today
  const isTodayQRExists = () => {
    const today = getTodayString();
    return qrList.some(qr => new Date(qr.waktu_buat).toISOString().slice(0, 10) === today);
  };

  const handleGenerate = async () => {
    setMessage('');
    setImageLoaded(false); // Reset imageLoaded before generating
    if (isTodayQRExists()) {
      setMessage('Sudah ada QR Code untuk hari ini');
      return;
    }
    await handleGenerateQR(id_admin, setToken, setImage);
    // Refresh QR list after generating
    fetch('https://qrabsence.onrender.com/api/qr/all')
      .then(res => res.json())
      .then(data => setQrList(data.qrCodes || []));
  };

  const viewAbsensi = (token_qr) => {
    setAbsensiInfo('');
    fetch(`https://qrabsence.onrender.com/api/absensi/byqr/${token_qr}`)
      .then(res => res.json())
      .then(data => {
        if (data.absensi && data.absensi.length > 0) {
          setAbsensi(data.absensi);
          setAbsensiInfo('');
        } else {
          setAbsensi([]);
          // Find waktu_buat for this token
          const qr = qrList.find(q => q.token_qr === token_qr);
          let waktu = '';
          if (qr) {
            const d = new Date(qr.waktu_buat);
            waktu = d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
          }
          setAbsensiInfo(`Belum ada absensi untuk hari ${waktu}`);
        }
      });
  };

  const handlePrint = () => {
    if (!imageLoaded) return; // Prevent print if image not loaded
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Print QR Code</title></head>
        <body style="text-align:center;">
          <img src="${image}" alt="QR Code" style="width:300px;height:300px;" />
          <p>Token: ${token}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Show QR for previous token
  const handleShowQR = async (qr_token) => {
  const qr = qrList.find(q => q.token_qr === qr_token);
  const qrImage = await QRCode.toDataURL(qr_token);
  setSelectedQR({ token: qr_token, image: qrImage, waktu_buat: qr?.waktu_buat });
};

  // Helper to get today's date string (YYYY-MM-DD)
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  };

  // Helper to check if QR is expired (not today)
  const isQRExpired = waktu_buat => {
    const qrDate = new Date(waktu_buat).toISOString().slice(0, 10);
    return qrDate !== getTodayString();
  };

   // Print QR for previous QR (selectedQR)
  const handlePrintSelectedQR = () => {
    if (!selectedQR.image) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Print QR Code</title></head>
        <body style="text-align:center;">
          <img src="${selectedQR.image}" alt="QR Code" style="width:300px;height:300px;" />
          <p>Token: ${selectedQR.token}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
  <div style={{
    minHeight: '100vh',
    width: '100vw',
    background: '#DED3C4',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }}>
    <BannerLogo />
    <div style={{
      background: '#3a4061',
      borderRadius: '18px',
      boxShadow: '0 8px 32px rgba(60,64,97,0.12)',
      maxWidth: 520,
      width: '100%',
      padding: '2.5rem 2.5rem 3.5rem 2.5rem',
      color: '#F4EBD3',
      minHeight: 700,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      marginTop: '2rem'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#F4EBD3',
        letterSpacing: 1
      }}>Generate QR Code</h2>
      {message && (
        <div style={{
          background: '#F87171',
          color: '#fff',
          borderRadius: 8,
          padding: '0.7rem 1rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {message}
        </div>
      )}

      {/* QR Preview Section - moved above Daftar QR Code */}
      {selectedQR.image && (
        <div style={{
          margin: '0 0 2rem 0',
          textAlign: 'center',
          background: '#DED3C4',
          borderRadius: 12,
          padding: '1.5rem 0'
        }}>
          <h4 style={{ color: '#3a4061', marginBottom: 16 }}>QR Code untuk Token:</h4>
          <div style={{ wordBreak: 'break-all', color: '#2d314d', marginBottom: 12 }}>{selectedQR.token}</div>
          <img
            src={selectedQR.image}
            alt="QR Code"
            style={{
              width: 180,
              height: 180,
              borderRadius: 12,
              border: '2px solid #DED3C4',
              background: '#fff',
              marginBottom: 10
            }}
          />
          {/* Print QR button directly below QR image */}
          {!isQRExpired(selectedQR.waktu_buat)
            ? (
              <button
                onClick={handlePrintSelectedQR}
                style={{
                  marginTop: 0,
                  padding: '0.6rem 1.5rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(90deg, #3a4061 0%, #98A1BC 100%)',
                  color: '#F4EBD3',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
              >
                Print QR Code
              </button>
            )
            : (
              <button
                disabled
                style={{
                  marginTop: 0,
                  padding: '0.6rem 1.5rem',
                  borderRadius: '8px',
                  background: '#bdbdbd',
                  color: '#555879',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'not-allowed',
                  opacity: 0.7,
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
              >
                QR sudah expired
              </button>
            )
          }
        </div>
      )}

      {/* Generate & Token Section */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          onClick={handleGenerate}
          style={{
            padding: '0.8rem 2.2rem',
            borderRadius: '10px',
            background: 'linear-gradient(90deg, #98A1BC 0%, #F4EBD3 100%)',
            color: '#3a4061',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(60,64,97,0.08)'
          }}
        >
          Generate
        </button>
      </div>
      {token && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontWeight: 'bold', color: '#3a4061' }}>Token: <span style={{ color: '#2d314d' }}>{token}</span></p>
          {image && (
            <>
              <img
                ref={qrImageRef}
                src={image}
                alt="QR Code"
                style={{ width: 180, height: 180, borderRadius: 12, border: '2px solid #DED3C4', background: '#fff', marginBottom: 12 }}
                onLoad={() => setImageLoaded(true)}
              />
              <br />
              <button
                onClick={handlePrint}
                style={{
                  marginTop: 10,
                  padding: '0.6rem 1.5rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(90deg, #3a4061 0%, #98A1BC 100%)',
                  color: '#F4EBD3',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  border: 'none',
                  cursor: imageLoaded ? 'pointer' : 'not-allowed',
                  opacity: imageLoaded ? 1 : 0.5
                }}
                disabled={!imageLoaded}
              >
                Print QR Code
              </button>
            </>
          )}
        </div>
      )}

      {/* Daftar QR Code Section */}
      <h3 style={{
        textAlign: 'center',
        margin: '2rem 0 1rem 0',
        color: '#F4EBD3',
        fontSize: '1.2rem',
        borderBottom: '1px solid #DED3C4',
        paddingBottom: 8
      }}>Daftar QR Code</h3>
      <ul style={{
        listStyle: 'none',
        padding: 0,
        maxHeight: 220,
        overflowY: 'auto',
        marginBottom: 0
      }}>
        {qrList.map(qr => (
          <li key={qr.token_qr} style={{
            background: '#DED3C4',
            borderRadius: 10,
            marginBottom: 12,
            padding: '1rem',
            boxShadow: '0 2px 8px rgba(60,64,97,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            <span style={{ fontWeight: 500, color: '#3a4061' }}>
              Token: <span style={{ color: '#2d314d' }}>{qr.token_qr}</span>
            </span>
            <span style={{ fontSize: 13, color: '#555879' }}>
              Waktu: {new Date(qr.waktu_buat).toLocaleString()}
            </span>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                onClick={() => viewAbsensi(qr.token_qr)}
                style={{
                  flex: 1,
                  padding: '0.5rem 0',
                  borderRadius: '7px',
                  background: 'linear-gradient(90deg, #3a4061 0%, #98A1BC 100%)',
                  color: '#F4EBD3',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Lihat Absensi
              </button>
              <button
                onClick={() => handleShowQR(qr.token_qr)}
                style={{
                  flex: 1,
                  padding: '0.5rem 0',
                  borderRadius: '7px',
                  background: 'linear-gradient(90deg, #3a4061 0%, #98A1BC 100%)',
                  color: '#F4EBD3',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Lihat QR
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Absensi Info Section */}
      {absensiInfo && (
        <div style={{
          margin: '2rem 0 0 0',
          background: '#F4EBD3',
          borderRadius: 12,
          padding: '1.5rem 1rem',
          color: '#3a4061',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {absensiInfo}
        </div>
      )}
      {absensi.length > 0 && (
        <div style={{
          margin: '2rem 0 0 0',
          background: '#F4EBD3',
          borderRadius: 12,
          padding: '1.5rem 1rem'
        }}>
          <h4 style={{ color: '#3a4061', marginBottom: 12 }}>Absensi untuk QR ini:</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {absensi.map(a => (
              <li key={a.id_kehadiran} style={{
                background: '#DED3C4',
                borderRadius: 8,
                marginBottom: 10,
                padding: '0.7rem 1rem',
                color: '#3a4061',
                boxShadow: '0 1px 4px rgba(60,64,97,0.04)'
              }}>
                <div><b>Pegawai:</b> {a.nama}</div>
                <div><b>Email:</b> {a.email}</div>
                <div><b>Tanggal:</b> {new Date(a.tanggal).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);
}

export default GenerateQRView;