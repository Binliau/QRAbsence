export async function loginUser(email, password) {
  const response = await fetch('https://qrabsence.onrender.com/api/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return await response.json();
}

export async function registerUser(nama, email, password) {
  const response = await fetch('https://qrabsence.onrender.com/api/user/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nama, email, password })
  });
  return await response.json();
}
