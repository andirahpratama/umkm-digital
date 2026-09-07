/* =========================================================
   UMKM Digital — Admin Panel Logic
   ========================================================= */

let adminToken = null;

document.addEventListener('DOMContentLoaded', () => {
  adminToken = sessionStorage.getItem('admin_token');
  if (adminToken) {
    showAdminDashboard();
  } else {
    showAdminLogin();
  }
  initParticles();
});

/* ─── Show / Hide ────────────────────────────────────────── */
function showAdminLogin() {
  document.getElementById('admin-login-page').classList.remove('hidden');
  document.getElementById('admin-dashboard-page').classList.add('hidden');
}

function showAdminDashboard() {
  document.getElementById('admin-login-page').classList.add('hidden');
  document.getElementById('admin-dashboard-page').classList.remove('hidden');
  loadAdminData();
}

/* ─── Admin Login ────────────────────────────────────────── */
async function handleAdminLogin(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type="submit"]');
  const username = form.querySelector('#admin-username').value.trim();
  const password = form.querySelector('#admin-password').value;
  const errorEl = document.getElementById('admin-login-error');

  errorEl.parentElement.classList.add('hidden');
  setButtonLoading(btn, true, 'Masuk...');

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login gagal');

    adminToken = data.token;
    sessionStorage.setItem('admin_token', adminToken);
    showAdminDashboard();
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.parentElement.classList.remove('hidden');
  } finally {
    setButtonLoading(btn, false);
  }
}

function adminRequest(method, url, data = null, isFormData = false) {
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  if (!isFormData && data) headers['Content-Type'] = 'application/json';
  return fetch(url, {
    method,
    headers,
    body: data ? (isFormData ? data : JSON.stringify(data)) : undefined
  }).then(async r => {
    const json = await r.json();
    if (!r.ok) throw new Error(json.error || 'Request gagal');
    return json;
  });
}

/* ─── Load All Admin Data ────────────────────────────────── */
async function loadAdminData() {
  loadAppSettings();
  loadStats();
  loadUsers();
  loadMessages();
  loadSettingsData();
  initAdminTabs();
}

/* ─── Stats ──────────────────────────────────────────────── */
async function loadStats() {
  try {
    const data = await adminRequest('GET', '/api/admin/stats');
    document.getElementById('stat-total-users').textContent = data.totalUsers;
    document.getElementById('stat-active-users').textContent = data.activeUsers;
    document.getElementById('stat-total-messages').textContent = data.totalMessages;
    document.getElementById('stat-unread-messages').textContent = data.unreadMessages;

    if (data.unreadMessages > 0) {
      document.getElementById('inbox-tab-badge').textContent = data.unreadMessages;
      document.getElementById('inbox-tab-badge').classList.remove('hidden');
    }
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
}

/* ─── Users ──────────────────────────────────────────────── */
async function loadUsers() {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;

  try {
    const data = await adminRequest('GET', '/api/admin/users');
    if (!data.users.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding:40px">
        Belum ada user yang mendaftar
      </td></tr>`;
      return;
    }

    tbody.innerHTML = data.users.map((u, i) => `
      <tr class="animate-fade-in" style="animation-delay: ${i * 0.05}s">
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:36px;height:36px;border-radius:50%;background:var(--grad-gold);display:flex;align-items:center;justify-content:center;font-weight:700;color:#000;flex-shrink:0">
              ${u.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div class="fw-semibold">${escapeHtml(u.name)}</div>
            </div>
          </div>
        </td>
        <td class="user-email-cell" title="${escapeHtml(u.email)}">${escapeHtml(u.email)}</td>
        <td>${formatDate(u.created_at)}</td>
        <td>${u.last_login ? formatDate(u.last_login) : '<span class="text-muted">Belum login</span>'}</td>
        <td>
          ${u.has_api_key
            ? '<span class="badge badge-success">✓ Ada</span>'
            : '<span class="badge badge-error">✗ Belum</span>'}
        </td>
        <td>
          <div class="user-actions">
            <button class="btn btn-danger btn-sm" onclick="deleteUser('${u.id}', '${escapeHtml(u.name)}')">
              🗑️ Hapus
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-error" style="padding:20px">${err.message}</td></tr>`;
  }
}

async function deleteUser(id, name) {
  if (!confirm(`Hapus user "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
  try {
    await adminRequest('DELETE', `/api/admin/users/${id}`);
    showToast(`User ${name} berhasil dihapus`, 'success');
    loadUsers();
    loadStats();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

/* ─── Messages ───────────────────────────────────────────── */
async function loadMessages() {
  const container = document.getElementById('messages-container');
  if (!container) return;

  try {
    const data = await adminRequest('GET', '/api/admin/messages');
    if (!data.messages.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <p class="fw-semibold">Kotak masuk kosong</p>
          <p class="text-sm text-muted">Belum ada pesan masuk dari user</p>
        </div>
      `;
      return;
    }

    container.innerHTML = data.messages.map(m => `
      <div class="glass-card message-card ${m.is_read ? '' : 'unread'}" id="msg-${m.id}">
        <div class="message-card-header">
          <div>
            <div class="message-card-meta">
              <span class="message-sender">👤 ${escapeHtml(m.user_name)}</span>
              <span class="message-email">${escapeHtml(m.user_email)}</span>
              ${!m.is_read ? '<span class="badge badge-gold">Baru</span>' : '<span class="badge" style="background:rgba(255,255,255,0.04);color:var(--color-text-muted)">Dibaca</span>'}
            </div>
            <div class="message-subject">📌 ${escapeHtml(m.subject || 'Saran & Masukan')}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0">
            <span class="message-time">🕐 ${formatDate(m.created_at)}</span>
            <div style="display:flex;gap:6px">
              ${!m.is_read ? `<button class="btn btn-success btn-sm" onclick="markRead('${m.id}')">✓ Tandai Dibaca</button>` : ''}
              <button class="btn btn-danger btn-sm" onclick="deleteMessage('${m.id}')">🗑️</button>
            </div>
          </div>
        </div>
        <div class="message-body">${escapeHtml(m.message)}</div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p class="text-error">${err.message}</p></div>`;
  }
}

async function markRead(id) {
  try {
    await adminRequest('PUT', `/api/admin/messages/${id}/read`);
    document.getElementById(`msg-${id}`)?.classList.remove('unread');
    loadStats();
    loadMessages();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteMessage(id) {
  if (!confirm('Hapus pesan ini?')) return;
  try {
    await adminRequest('DELETE', `/api/admin/messages/${id}`);
    showToast('Pesan dihapus', 'success');
    loadMessages();
    loadStats();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

/* ─── Settings ───────────────────────────────────────────── */
async function loadSettingsData() {
  try {
    const data = await fetch('/api/admin/settings').then(r => r.json());
    const s = data.settings;

    const faviconPreview = document.getElementById('current-favicon');
    const logoPreview = document.getElementById('current-logo');

    if (faviconPreview && s.favicon_url) faviconPreview.src = s.favicon_url;
    if (logoPreview && s.logo_url) logoPreview.src = s.logo_url;

    const appNameInput = document.getElementById('app-name-input');
    if (appNameInput && s.app_name) appNameInput.value = s.app_name;
  } catch {}
}

async function handleSaveSettings(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type="submit"]');
  const formData = new FormData(form);

  setButtonLoading(btn, true, 'Menyimpan...');
  try {
    const response = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);

    showToast('Pengaturan berhasil disimpan! ✅', 'success');
    loadSettingsData();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    setButtonLoading(btn, false);
  }
}

/* ─── Admin Tabs ─────────────────────────────────────────── */
function initAdminTabs() {
  const tabs = document.querySelectorAll('.admin-tab');
  const contents = document.querySelectorAll('.admin-tab-content');

  function switchAdminTab(target) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === target));
    contents.forEach(c => {
      const isTarget = c.dataset.adminTab === target;
      c.classList.toggle('hidden', !isTarget);
      c.classList.toggle('active', isTarget);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchAdminTab(tab.dataset.tab));
  });

  // Initial state
  switchAdminTab('users');
}

/* ─── Admin Logout ───────────────────────────────────────── */
function adminLogout() {
  sessionStorage.removeItem('admin_token');
  adminToken = null;
  showAdminLogin();
  showToast('Berhasil keluar dari admin panel', 'info');
}

/* ─── Helpers ────────────────────────────────────────────── */
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
