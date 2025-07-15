import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleRegister } from '../controllers/userController';
import BannerLogo from '../components/BannerLogo';

function RegisterView() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const onRegister = async () => {
    await handleRegister(nama, email, password, setMessage, () => {
      navigate('/login');
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#DED3C4',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <BannerLogo />
      <div style={{
        background: '#3a4061',
        padding: 0,
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: 350,
        color: '#F4EBD3',
        margin: '2rem 1rem 0 1rem',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '2rem 1.5rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#F4EBD3' }}>Registrasi Pegawai</h2>
          <div style={{ marginBottom: '1rem' }}>
            <input
              placeholder="Nama"
              value={nama}
              onChange={e => setNama(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #98A1BC',
                marginBottom: '1rem',
                fontSize: '1rem',
                background: '#DED3C4',
                color: '#555879'
              }}
            />
            <input
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #98A1BC',
                marginBottom: '1rem',
                fontSize: '1rem',
                background: '#DED3C4',
                color: '#555879'
              }}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #98A1BC',
                fontSize: '1rem',
                background: '#DED3C4',
                color: '#555879'
              }}
            />
          </div>
          <button
            onClick={onRegister}
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
            Registrasi
          </button>
          {message && (
            <p style={{
              textAlign: 'center',
              color: message.toLowerCase().includes('berhasil') ? '#F4EBD3' : '#F4EBD3',
              margin: 0
            }}>
              {message}
            </p>
          )}
          <p style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ color: '#DED3C4', cursor: 'pointer' }} onClick={() => navigate('/login')}>
              Sudah punya akun? Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterView;