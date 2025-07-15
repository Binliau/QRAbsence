import { loginUser, registerUser } from '../models/userModel';

export async function handleLogin(email, password, setMessage, onSuccess) {
  try {
    const res = await fetch('http://localhost:5000/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message || 'Login berhasil');
      if (onSuccess) onSuccess(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      setMessage(data.message || 'Login gagal');
    }
  } catch (err) {
    setMessage('Terjadi kesalahan jaringan');
  }
}

export async function handleRegister(nama, email, password, setMessage, onSuccess) {
  try {
    const res = await fetch('http://localhost:5000/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message || 'Register berhasil');
      if (onSuccess) onSuccess(data.user);
    } else {
      setMessage(data.message || 'Register gagal');
    }
  } catch (err) {
    setMessage('Terjadi kesalahan jaringan');
  }
}