/* =========================================================
   UMKM Digital — App UI Utilities
   ========================================================= */

/* ─── Toast Notification ─────────────────────────────────── */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ─── Loading Button ─────────────────────────────────────── */
function setButtonLoading(btn, loading, loadingText = null) {
  if (loading) {
    btn._originalHTML = btn.innerHTML;
    btn._originalDisabled = btn.disabled;
    btn.disabled = true;
    btn.innerHTML = loadingText
      ? `<span class="spinner" style="width:18px;height:18px;border-width:2px"></span> ${loadingText}`
      : `<span class="spinner" style="width:18px;height:18px;border-width:2px"></span>`;
  } else {
    btn.disabled = btn._originalDisabled || false;
    btn.innerHTML = btn._originalHTML || btn.innerHTML;
  }
}

/* ─── Password Toggle ────────────────────────────────────── */
function initPasswordToggles() {
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.innerHTML = input.type === 'password'
        ? `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>`
        : `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>`;
    });
  });
}

/* ─── Drag & Drop Upload ─────────────────────────────────── */
function initUploadZone(zone) {
  const input = zone.querySelector('input[type="file"]');
  const preview = zone.querySelector('.upload-preview');
  const text = zone.querySelector('.upload-text');

  if (!input) return;

  ['dragenter', 'dragover'].forEach(evt => {
    zone.addEventListener(evt, e => {
      e.preventDefault();
      zone.classList.add('dragging');
    });
  });

  ['dragleave', 'drop'].forEach(evt => {
    zone.addEventListener(evt, e => {
      e.preventDefault();
      zone.classList.remove('dragging');
    });
  });

  zone.addEventListener('drop', e => {
    const files = e.dataTransfer?.files;
    if (files?.length) {
      input.files = files;
      input.dispatchEvent(new Event('change'));
    }
  });

  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (file) {
      zone.classList.add('has-file');
      if (preview) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
      }
      if (text) {
        text.innerHTML = `<span class="text-success">✓ ${file.name}</span>`;
      }
    }
  });
}

/* ─── Copy to Clipboard ──────────────────────────────────── */
async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    const original = btn.innerHTML;
    btn.innerHTML = '✓ Disalin!';
    btn.classList.add('btn-success');
    setTimeout(() => { btn.innerHTML = original; btn.classList.remove('btn-success'); }, 2000);
  } catch {
    showToast('Gagal menyalin teks', 'error');
  }
}

/* ─── Download Image ─────────────────────────────────────── */
function downloadImage(base64Data, mimeType, filename) {
  const link = document.createElement('a');
  link.href = `data:${mimeType};base64,${base64Data}`;
  link.download = filename || `umkm-promo-${Date.now()}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Gambar berhasil didownload! 🎉', 'success');
}

/* ─── Format Date ────────────────────────────────────────── */
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

/* ─── Particles ──────────────────────────────────────────── */
function initParticles() {
  const container = document.querySelector('.particles-bg');
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(p);
  }
}

/* ─── Load App Settings (favicon/logo) ──────────────────── */
async function loadAppSettings() {
  try {
    const data = await fetch('/api/admin/settings').then(r => r.json());
    const settings = data.settings || {};

    // Update favicon
    if (settings.favicon_url) {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.favicon_url;
    }

    // Update logo in navbar
    const navLogo = document.getElementById('nav-logo');
    if (navLogo && settings.logo_url) navLogo.src = settings.logo_url;

    // Update app name
    if (settings.app_name) {
      const nameEl = document.getElementById('nav-app-name');
      if (nameEl) nameEl.textContent = settings.app_name;
    }

    return settings;
  } catch {
    return {};
  }
}

/* ─── Tab System ─────────────────────────────────────────── */
function initTabs(tabContainer, contentContainer, onChange) {
  const tabs = tabContainer.querySelectorAll('[data-tab]');
  const contents = contentContainer ? contentContainer.querySelectorAll('[data-tab-content]') : [];

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');

      const content = contentContainer
        ? contentContainer.querySelector(`[data-tab-content="${target}"]`)
        : document.querySelector(`[data-tab-content="${target}"]`);
      if (content) content.classList.add('active');

      if (onChange) onChange(target);
    });
  });
}
