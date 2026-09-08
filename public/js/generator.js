/* =========================================================
   UMKM Digital — Generator Logic
   ========================================================= */

let currentGeneratedImage = null;
let currentCaption = null;
let currentPlatform = null;

/* ─── Init Dashboard ─────────────────────────────────────── */
async function initDashboard() {
  const user = Auth.getUser();
  if (!user) { handleLogout(); return; }

  // Load settings (favicon, logo)
  await loadAppSettings();

  // Set user info
  document.getElementById('user-name').textContent = user.name;
  document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('dropdown-user-name').textContent = user.name;
  document.getElementById('dropdown-user-email').textContent = user.email;

  // Check API key
  const hasApiKey = !!user.gemini_api_key;
  const apiKeyBanner = document.getElementById('api-key-banner');
  if (!hasApiKey && apiKeyBanner) {
    apiKeyBanner.classList.remove('hidden');
  }

  // Init navigation tabs
  initMainNavTabs();

  // Init upload zones
  document.querySelectorAll('.upload-zone').forEach(zone => initUploadZone(zone));

  // Init user dropdown
  initUserDropdown();

  // Init forms
  document.getElementById('wa-story-form')?.addEventListener('submit', (e) => handleGenerate(e, 'wa_story'));
  document.getElementById('instagram-form')?.addEventListener('submit', (e) => handleGenerate(e, 'instagram'));
  document.getElementById('feedback-form')?.addEventListener('submit', handleFeedback);
  document.getElementById('api-key-form')?.addEventListener('submit', handleUpdateApiKey);
}

/* ─── Main Nav Tabs ──────────────────────────────────────── */
function initMainNavTabs() {
  // Grab ALL nav-tab buttons (desktop + mobile)
  const tabs = document.querySelectorAll('.nav-tab');
  const pages = document.querySelectorAll('.tab-page');

  function switchTab(target) {
    // Update all tab button states (desktop + mobile)
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === target);
    });
    // Show/hide content pages
    pages.forEach(page => {
      const isTarget = page.dataset.tabContent === target;
      page.classList.toggle('hidden', !isTarget);
      page.classList.toggle('active', isTarget);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // Set initial state
  switchTab('wa-story');
}

/* ─── User Dropdown ──────────────────────────────────────── */
function initUserDropdown() {
  const btn = document.getElementById('user-btn');
  const dropdown = document.getElementById('user-dropdown');
  if (!btn || !dropdown) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', () => dropdown.classList.remove('open'));
}

/* ─── Handle Generate ────────────────────────────────────── */
async function handleGenerate(e, platform) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type="submit"]');

  const user = Auth.getUser();
  if (!user?.gemini_api_key) {
    showToast('Kamu belum memasukkan API Key Gemini!', 'error');
    openApiKeyModal();
    return;
  }

  const prefix = platform === 'wa_story' ? 'wa' : 'ig';
  const productInput = document.getElementById(`${prefix}-product-photo`);
  const logoInput = document.getElementById(`${prefix}-logo`);
  const themeInput = document.getElementById(`${prefix}-theme`);
  const promoInput = document.getElementById(`${prefix}-promo`);
  const genCaptionInput = document.getElementById(`${prefix}-gen-caption`);

  const productFile = productInput?.files?.[0];
  if (!productFile) {
    showToast('Upload foto produk dulu ya!', 'error');
    return;
  }

  const logoFile = logoInput?.files?.[0] || null;
  const theme = themeInput?.value?.trim() || '';
  const promo = promoInput?.value?.trim() || '';
  const generateCaptionBool = genCaptionInput ? genCaptionInput.checked : true;

  // Show generating state
  const resultArea = document.getElementById(`${prefix}-result`);
  const resultPlaceholder = document.getElementById(`${prefix}-placeholder`);
  const resultImageWrapper = document.getElementById(`${prefix}-image-wrapper`);
  const resultActionsEl = document.getElementById(`${prefix}-actions`);
  const captionBoxEl = document.getElementById(`${prefix}-caption-box`);

  if (resultPlaceholder) {
    resultPlaceholder.innerHTML = `
      <div class="animate-fade-in" style="text-align:center">
        <div style="margin-bottom:16px; font-size:3rem">✨</div>
        <div class="shimmer" style="width:200px;height:16px;margin:0 auto 12px"></div>
        <div class="shimmer" style="width:160px;height:12px;margin:0 auto 8px"></div>
        <div class="shimmer" style="width:140px;height:12px;margin:0 auto"></div>
        <p style="margin-top:20px;color:var(--color-text-muted);font-size:var(--text-sm)">
          AI (Google Nano Banana v5.0) sedang memproses foto produk kamu...<br>
          <span style="font-size:var(--text-xs)">Mengunci identitas produk & menerapkan gaya komersial...</span>
        </p>
      </div>
    `;
  }

  if (resultImageWrapper) resultImageWrapper.classList.add('hidden');
  if (resultActionsEl) resultActionsEl.classList.add('hidden');
  if (captionBoxEl) captionBoxEl.classList.add('hidden');

  // Set btn loading
  btn.disabled = true;
  btn.innerHTML = `
    <span class="loading-dots">
      <span></span><span></span><span></span>
    </span>
    AI Generating...
  `;

  try {
    // Generate image using Google Nano Banana v5.0 Prompt Rules
    const { imageBase64, mimeType, visualConcept } = await generatePromotionalImage(
      user.gemini_api_key, productFile, logoFile, theme, promo, platform
    );

    // Generate caption with Gemini Vision analyzing the product photo
    const caption = await generateCaption(
      user.gemini_api_key, productFile, logoFile, theme, promo, platform, generateCaptionBool
    );

    // Store results
    currentGeneratedImage = { imageBase64, mimeType };
    currentCaption = caption;
    currentPlatform = platform;

    // Show image
    const img = document.getElementById(`${prefix}-result-img`);
    if (img) {
      img.src = `data:${mimeType};base64,${imageBase64}`;
      img.onload = () => {
        if (resultPlaceholder) resultPlaceholder.classList.add('hidden');
        if (resultImageWrapper) resultImageWrapper.classList.remove('hidden');
        if (resultActionsEl) resultActionsEl.classList.remove('hidden');
        if (caption && captionBoxEl) captionBoxEl.classList.remove('hidden');
      };
    }

    // Show caption if enabled
    const captionTextEl = document.getElementById(`${prefix}-caption-text`);
    if (captionTextEl && caption) {
      captionTextEl.textContent = caption;
    }

    showToast('Gambar promosi berhasil dibuat dengan AI Food Promotion v5.0! 🎨', 'success');
  } catch (err) {
    if (resultPlaceholder) {
      resultPlaceholder.innerHTML = `
        <div class="animate-fade-in" style="text-align:center">
          <div style="font-size:3rem;margin-bottom:16px">❌</div>
          <p style="color:var(--color-error);font-weight:600;margin-bottom:8px">Gagal Generate</p>
          <p style="color:var(--color-text-muted);font-size:var(--text-sm)">${err.message}</p>
          <p style="color:var(--color-text-muted);font-size:var(--text-xs);margin-top:8px">Coba lagi atau periksa API Key kamu</p>
        </div>
      `;
    }
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span>🪄</span> Generate Gambar`;
  }
}

/* ─── Download Image ─────────────────────────────────────── */
function handleDownload(platform) {
  if (!currentGeneratedImage) return;
  const platformName = platform === 'wa_story' ? 'wa-story' : 'instagram';
  const filename = `umkm-promo-${platformName}-${Date.now()}.jpg`;
  downloadImage(currentGeneratedImage.imageBase64, currentGeneratedImage.mimeType, filename);
}

/* ─── Copy Caption ───────────────────────────────────────── */
function handleCopyCaption(platform) {
  const prefix = platform === 'wa_story' ? 'wa' : 'ig';
  const captionEl = document.getElementById(`${prefix}-caption-text`);
  const btn = document.getElementById(`${prefix}-copy-caption`);
  if (captionEl && btn) {
    copyToClipboard(captionEl.textContent, btn);
  }
}

/* ─── Regenerate ─────────────────────────────────────────── */
function handleRegenerate(platform) {
  const prefix = platform === 'wa_story' ? 'wa' : 'ig';
  const form = document.getElementById(`${prefix === 'wa' ? 'wa-story' : 'instagram'}-form`);
  if (form) {
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  }
}

/* ─── Feedback ───────────────────────────────────────────── */
async function handleFeedback(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type="submit"]');
  const subject = form.querySelector('#feedback-subject').value.trim();
  const message = form.querySelector('#feedback-message').value.trim();
  const successEl = document.getElementById('feedback-success');
  const errorEl = document.getElementById('feedback-error');

  if (!message) { showToast('Isi pesan dulu ya!', 'error'); return; }

  successEl?.classList.add('hidden');
  errorEl?.classList.add('hidden');
  setButtonLoading(btn, true, 'Mengirim...');

  try {
    await api.post('/api/messages', { subject, message });
    form.reset();
    successEl?.classList.remove('hidden');
    showToast('Pesan berhasil terkirim! Terima kasih atas masukan kamu 🙏', 'success');
  } catch (err) {
    if (errorEl) errorEl.textContent = err.message;
    errorEl?.classList.remove('hidden');
    showToast(err.message, 'error');
  } finally {
    setButtonLoading(btn, false);
  }
}

/* ─── API Key Modal ──────────────────────────────────────── */
function openApiKeyModal() {
  const user = Auth.getUser();
  const input = document.getElementById('new-api-key');
  if (input && user?.gemini_api_key) {
    input.value = user.gemini_api_key;
  }
  const modal = document.getElementById('api-key-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeApiKeyModal() {
  const modal = document.getElementById('api-key-modal');
  if (modal) modal.classList.add('hidden');
}

async function handleUpdateApiKey(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type="submit"]');
  const input = form.querySelector('#new-api-key');
  const apiKey = input ? input.value.trim() : '';

  if (!apiKey) { showToast('API Key wajib diisi!', 'error'); return; }

  setButtonLoading(btn, true, 'Memvalidasi...');

  try {
    // Validate key
    const isValid = await validateGeminiApiKey(apiKey);
    if (!isValid) {
      showToast('API Key tidak valid! Periksa kembali API Key Gemini kamu.', 'error');
      setButtonLoading(btn, false);
      return;
    }

    // Try saving to backend API
    try {
      await api.put('/api/user/apikey', { gemini_api_key: apiKey });
    } catch (apiErr) {
      console.warn('API update failed, saving locally:', apiErr);
    }

    // Update local storage user state
    const user = Auth.getUser();
    if (user) {
      user.gemini_api_key = apiKey;
      Storage.set('user', user);
    }

    closeApiKeyModal();
    document.getElementById('api-key-banner')?.classList.add('hidden');
    showToast('API Key Gemini berhasil disimpan! 🔑✅', 'success');
  } catch (err) {
    showToast('Gagal menyimpan API Key: ' + err.message, 'error');
  } finally {
    setButtonLoading(btn, false);
  }
}
