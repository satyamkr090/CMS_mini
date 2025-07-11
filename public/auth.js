document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const res = await fetch('/login/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: e.target.username.value,
      password: e.target.password.value
    })
  });
  const text = await res.text();
  alert(text);
  if (text === 'Signup successful.') {
    window.location.href = '/dashboard.html';
  }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: e.target.username.value,
      password: e.target.password.value
    })
  });
  const text = await res.text();
  alert(text);
  if (text === 'Login successful.') {
    window.location.href = '/dashboard.html';
  }
});
