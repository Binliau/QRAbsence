import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import BannerLogo from '../components/BannerLogo';

function AbsensiView() {
  const [scanned, setScanned] = useState(false);
  const [cameraId, setCameraId] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [message, setMessage] = useState('');
  const [qrImage, setQrImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const qrRef = useRef(null);
  const videoRef = useRef(null);

  // Get user info for id_pegawai
  const user = JSON.parse(localStorage.getItem('user'));
  const id_pegawai = user?.id;

  useEffect(() => {
    Html5Qrcode.getCameras().then(devices => {
      setCameras(devices);
      if (devices.length > 0) setCameraId(devices[0].id);
    });
  }, []);

  useEffect(() => {
    if (!cameraId || scanned) return;

    if (!qrRef.current) {
      qrRef.current = new Html5Qrcode("qr-reader");
    }

    let isMounted = true;
    setQrImage(null); // Reset gambar setiap mulai scan baru

    qrRef.current.start(
      cameraId,
      { fps: 10, qrbox: 220 },
      async (decodedText) => {
        if (isMounted && !scanned) {
          // Ambil still image dari video
          const videoElem = document.querySelector('#qr-reader video');
          if (videoElem) {
            const canvas = document.createElement('canvas');
            canvas.width = videoElem.videoWidth;
            canvas.height = videoElem.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
            setQrImage(canvas.toDataURL('image/png'));
          }

          setScanned(true);

          // Send POST request to backend to record absensi
          try {
            const res = await fetch('http://localhost:5000/api/absensi/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                token: decodedText,
                id_pegawai: id_pegawai
              })
            });
            const data = await res.json();
            if (res.ok) {
              setMessage('Absensi sukses!');
            } else {
              setMessage(data.message || 'Gagal absensi');
            }
          } catch (err) {
            setMessage('Gagal mengirim absensi');
          }

          qrRef.current.stop().catch(() => {});
        }
      },
      (error) => {
        // ignore scan errors
      }
    ).catch(() => {
      // handle start error
    });

    return () => {
      isMounted = false;
      if (qrRef.current) {
        qrRef.current.stop().catch(() => {});
      }
    };
    // eslint-disable-next-line
  }, [cameraId, scanned]);

  useEffect(() => {
    if (scanned && qrImage && message === 'Absensi sukses!') {
      setShowPopup(true);
    }
  }, [scanned, qrImage, message]);

  const handleScanAgain = () => {
    setScanned(false);
    setMessage('');
    setQrImage(null);
    setShowPopup(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#DED3C4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Popup for still image */}
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(42,44,61,0.55)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#3a4061',
            borderRadius: 16,
            padding: '2rem 2.5rem',
            boxShadow: '0 8px 32px rgba(60,64,97,0.18)',
            textAlign: 'center',
            color: '#F4EBD3',
            maxWidth: 320
          }}>
            <h3 style={{ marginBottom: 18, color: '#F4EBD3' }}>Absensi Berhasil!</h3>
            <img
              src={qrImage}
              alt="Foto QR yang di-scan"
              style={{
                width: 180,
                height: 180,
                borderRadius: 12,
                border: '2px solid #DED3C4',
                background: '#fff',
                objectFit: 'cover',
                marginBottom: 12
              }}
            />
            <div style={{ color: '#F4EBD3', marginBottom: 18, fontSize: 13 }}>Foto QR yang di-scan</div>
            <button
              onClick={handleScanAgain}
              style={{
                padding: '0.7rem 1.5rem',
                borderRadius: '8px',
                background: 'linear-gradient(90deg, #98A1BC 0%, #F4EBD3 100%)',
                color: '#3a4061',
                fontWeight: 'bold',
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Tutup & Scan Lagi
            </button>
          </div>
        </div>
      )}
      <div style={{
        background: '#3a4061',
        padding: 0,
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: 350,
        color: '#F4EBD3',
        margin: '0 1rem',
        overflow: 'hidden'
      }}>
        <BannerLogo />
        <div style={{ padding: '2rem 1.5rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#F4EBD3' }}>Scan QR Code untuk Absensi</h2>
          {cameras.length > 1 && (
            <select
              value={cameraId || ''}
              onChange={e => setCameraId(e.target.value)}
              style={{
                width: '100%',
                marginBottom: 16,
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid #98A1BC',
                background: '#DED3C4',
                color: '#555879'
              }}
            >
              {cameras.map(cam => (
                <option key={cam.id} value={cam.id}>{cam.label || `Kamera ${cam.id}`}</option>
              ))}
            </select>
          )}
          <div id="qr-reader" style={{ width: 300, height: 300, margin: '0 auto' }}></div>
          {message && (
            <p style={{
              textAlign: 'center',
              color: message === 'Absensi sukses!' ? '#A3E635' : '#F87171',
              fontWeight: 'bold',
              marginTop: 16
            }}>
              {message}
            </p>
          )}
          {/* Still image moved to popup */}
          {scanned && !showPopup && (
            <button onClick={handleScanAgain} style={{
              width: '90%',
              marginTop: 16,
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'linear-gradient(90deg, #98A1BC 0%, #F4EBD3 100%)',
              color: '#555879',
              fontWeight: 'bold',
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer'
            }}>
              Scan Lagi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AbsensiView;