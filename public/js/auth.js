/* =========================================================
   UMKM Digital — Auth Logic
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect to dashboard
  if (Auth.isLoggedIn() && window.location.pathname === '/') {
    showDashboard();
    return;
  }
  showAuthPage();
  initParticles();
  initPasswordToggles();
});

/* ─── Show / Hide Pages ──────────────────────────────────── */
function showAuthPage() {
  document.getElementById('auth-page')?.classList.remove('hidden');
  document.getElementById('dashboard-page')?.classList.add('hidden');
  document.getElementById('loading-screen')?.classList.add('hidden');
}

function showDashboard() {
  document.getElementById('auth-page')?.classList.add('hidden');
  document.getElementById('dashboard-page')?.classList.remove('hidden');
  document.getElementById('loading-screen')?.classList.add('hidden');
  initDashboard();
}

function showLoading() {
  document.getElementById('loading-screen')?.classList.remove('hidden');
}

/* ─── Tab Switching (Login ↔ Register) ───────────────────── */
function switchToRegister() {
  document.getElementById('login-form-wrapper').classList.add('hidden');
  document.getElementById('register-form-wrapper').classList.remove('hidden');
}

function switchToLogin() {
  document.getElementById('register-form-wrapper').classList.add('hidden');
  document.getElementById('login-form-wrapper').classList.remove('hidden');
}

/* ─── Login ──────────────────────────────────────────────── */
async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type="submit"]');
  const email = form.querySelector('#login-email').value.trim();
  const password = form.querySelector('#login-password').value;
  const errorEl = document.getElementById('login-error');

  if (!email || !password) {
    errorEl.textContent = 'Email dan password wajib diisi';
    errorEl.parentElement.classList.remove('hidden');
    return;
  }

  errorEl.parentElement.classList.add('hidden');
  setButtonLoading(btn, true, 'Masuk...');

  try {
    const data = await api.post('/api/auth/login', { email, password });
    Auth.save(data.token, data.user);
    showToast(`Selamat datang, ${data.user.name}! 🎉`, 'success');
    showDashboard();
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.parentElement.classList.remove('hidden');
  } finally {
    setButtonLoading(btn, false);
  }
}

/* ─── Register ───────────────────────────────────────────── */
async function handleRegister(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type="submit"]');
  const name = form.querySelector('#reg-name').value.trim();
  const email = form.querySelector('#reg-email').value.trim();
  const password = form.querySelector('#reg-password').value;
  const confirmPassword = form.querySelector('#reg-confirm-password').value;
  const geminiKey = form.querySelector('#reg-apikey').value.trim();
  const errorEl = document.getElementById('register-error');

  errorEl.parentElement.classList.add('hidden');

  if (!name || !email || !password) {
    errorEl.textContent = 'Nama, email, dan password wajib diisi';
    errorEl.parentElement.classList.remove('hidden');
    return;
  }

  if (password.length < 6) {
    errorEl.textContent = 'Password minimal 6 karakter';
    errorEl.parentElement.classList.remove('hidden');
    return;
  }

  if (password !== confirmPassword) {
    errorEl.textContent = 'Password dan konfirmasi password tidak cocok';
    errorEl.parentElement.classList.remove('hidden');
    return;
  }

  setButtonLoading(btn, true, 'Mendaftar...');

  try {
    const data = await api.post('/api/auth/register', { name, email, password, gemini_api_key: geminiKey || null });
    Auth.save(data.token, data.user);
    showToast(`Akun berhasil dibuat! Selamat datang, ${data.user.name}! 🎉`, 'success');
    showDashboard();
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.parentElement.classList.remove('hidden');
  } finally {
    setButtonLoading(btn, false);
  }
}

/* ─── Logout ─────────────────────────────────────────────── */
function handleLogout() {
  Auth.logout();
  showToast('Berhasil keluar. Sampai jumpa! 👋', 'info');
  showAuthPage();
}
