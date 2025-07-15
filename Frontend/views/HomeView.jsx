import React from 'react';
import { useNavigate } from 'react-router-dom';
import bannerlogo from '../src/assets/banner-logo.png';

function HomeView() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#DED3C4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
  
      <div style={{
        background: '#3a4061',
        padding: '2.5rem 2rem',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        minWidth: '320px',
        textAlign: 'center',
        color: '#F4EBD3'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img
            src={bannerlogo}
            alt="App Logo"
            style={{
              maxWidth: 200,
              maxHeight: 200,
              width: '120%',
              height: '120%',
              display: 'block',
              margin: '0 auto'
            }}
          />
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#F4EBD3' }}>Sistem Absensi QR</h1>
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            background: 'linear-gradient(90deg, #98A1BC 0%, #F4EBD3 100%)',
            color: '#555879',
            fontWeight: 'bold',
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            background: 'linear-gradient(90deg, #F4EBD3 0%, #98A1BC 100%)',
            color: '#555879',
            fontWeight: 'bold',
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Registrasi Pegawai
        </button>
      </div>
    </div>
  );
}

export default HomeView;