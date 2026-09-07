/* =========================================================
   UMKM Digital — Gemini API & F&B Image Generation Engine
   ========================================================= */

const GEMINI_TEXT_MODEL = 'gemini-1.5-flash';
const GEMINI_TEXT_MODEL_ALT = 'gemini-2.0-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Convert File object to base64 data URL
 */
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate Gemini API Key
 */
async function validateGeminiApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') return false;
  const cleanKey = apiKey.trim();

  // Basic length check (Gemini / GCP API Keys are >= 10 chars)
  if (cleanKey.length < 10) return false;

  try {
    const res = await fetch(
      `${GEMINI_BASE_URL}/${GEMINI_TEXT_MODEL}:generateContent?key=${cleanKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'ping' }] }],
          generationConfig: { maxOutputTokens: 5 }
        })
      }
    );

    if (res.ok) return true;

    const errData = await res.json().catch(() => ({}));
    const errMsg = errData?.error?.message || '';

    // If Google explicitly rejected key as invalid
    if (errMsg.toLowerCase().includes('api key not valid') || errMsg.toLowerCase().includes('invalid api key')) {
      return false;
    }

    // For other errors (quota limit 429, tier limitation), if length >= 15 allow saving
    return cleanKey.length >= 15;
  } catch {
    return cleanKey.length >= 15;
  }
}

/**
 * Generate promotional image using Imagen 3 API or Canvas Studio Fallback
 */
async function generatePromotionalImage(apiKey, productPhoto, logoFile, theme, promoDesc, platform) {
  const cleanKey = apiKey.trim();

  // 1. Try Imagen 3 API first
  try {
    const imagenResult = await tryImagen3Generation(cleanKey, theme, promoDesc, platform);
    if (imagenResult) return imagenResult;
  } catch (err) {
    console.warn('Imagen 3 API skipped/failed, switching to AI Graphic Composite Engine:', err.message);
  }

  // 2. Fallback: AI Graphic Composite Engine (Guaranteed to work for all API key tiers)
  return await generateStudioCompositeImage(cleanKey, productPhoto, logoFile, theme, promoDesc, platform);
}

/**
 * Try generating image via Imagen 3 REST API
 */
async function tryImagen3Generation(apiKey, theme, promoDesc, platform) {
  const prompt = `Professional food and beverage product promotional poster for ${platform === 'wa_story' ? 'WhatsApp Story 9:16' : 'Instagram Post 3:4'}. ${theme ? 'Theme: ' + theme + '.' : ''} ${promoDesc ? 'Promo text: ' + promoDesc + '.' : ''} Premium commercial studio lighting, vibrant colors, clean layout, high resolution 4k F&B advertising quality, no watermarks.`;

  const res = await fetch(
    `${GEMINI_BASE_URL}/imagen-3.0-generate-002:predict?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: platform === 'wa_story' ? '9:16' : '3:4'
        }
      })
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  const b64 = data.predictions?.[0]?.bytesBase64Encoded;
  if (b64) {
    return { imageBase64: b64, mimeType: 'image/png' };
  }
  return null;
}

/**
 * Generate Studio Composite Image using Gemini AI & HTML5 Canvas
 */
async function generateStudioCompositeImage(apiKey, productPhoto, logoFile, theme, promoDesc, platform) {
  // Extract text design elements using Gemini text API
  let copyData = {
    headline: 'PROMO SPESIAL',
    subheadline: promoDesc || 'Nikmati kelezatan terbaik hari ini!',
    badge: 'BEST SELLER',
    colorTheme: 'dark_gold'
  };

  try {
    const aiCopy = await getAICopyDesign(apiKey, theme, promoDesc);
    if (aiCopy) copyData = { ...copyData, ...aiCopy };
  } catch (e) {
    console.warn('Using default graphic copy fallback:', e);
  }

  // Convert product photo to Data URL
  const productDataUrl = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(productPhoto);
  });

  let logoDataUrl = null;
  if (logoFile) {
    logoDataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(logoFile);
    });
  }

  // Draw Studio Quality Poster on HTML5 Canvas
  return await renderPosterCanvas(productDataUrl, logoDataUrl, copyData, platform);
}

/**
 * Call Gemini Text API for AI Graphic Copy
 */
async function getAICopyDesign(apiKey, theme, promoDesc) {
  const prompt = `Kamu adalah seorang Copywriter & Art Director F&B. Buat 1 judul promosi singkat (max 4 kata), 1 sub-judul (max 8 kata), 1 teks badge promo (max 2 kata, misal: 'DISC 50%', 'LIMITED', 'BEST SELLER').
  Input Tema: "${theme || 'Modern F&B'}". Promo: "${promoDesc || 'Spesial Hari Ini'}".
  Keluarkan HANYA JSON berformat valid tanpa markdown:
  {"headline": "...", "subheadline": "...", "badge": "..."}`;

  const res = await fetch(
    `${GEMINI_BASE_URL}/${GEMINI_TEXT_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 200 }
      })
    }
  );

  if (!res.ok) {
    // Retry with alt model
    const resAlt = await fetch(
      `${GEMINI_BASE_URL}/${GEMINI_TEXT_MODEL_ALT}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 200 }
        })
      }
    );
    if (!resAlt.ok) return null;
    const dataAlt = await resAlt.json();
    const rawTxt = dataAlt.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = rawTxt.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  }

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleaned = rawText.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Render Studio F&B Poster to Canvas and return base64
 */
async function renderPosterCanvas(productImgUrl, logoImgUrl, copy, platform) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Canvas size
    const isWA = platform === 'wa_story';
    canvas.width = 1080;
    canvas.height = isWA ? 1920 : 1350;

    const width = canvas.width;
    const height = canvas.height;

    // Load Product Image
    const pImg = new Image();
    pImg.crossOrigin = 'Anonymous';
    pImg.src = productImgUrl;
    pImg.onload = () => {

      // 1. Draw Luxurious Dark/Vibrant F&B Background Gradient
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, height * 0.8);
      bgGrad.addColorStop(0, '#1E293B');
      bgGrad.addColorStop(0.5, '#0F172A');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Decorative Light Glow Effects
      const glowGrad = ctx.createRadialGradient(width / 2, isWA ? 950 : 650, 50, width / 2, isWA ? 950 : 650, 500);
      glowGrad.addColorStop(0, 'rgba(217, 119, 6, 0.35)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Product Photo Container with Glassmorphism Border & Shadow
      ctx.save();
      const pBoxWidth = width * 0.82;
      const pBoxHeight = isWA ? height * 0.44 : height * 0.52;
      const pBoxX = (width - pBoxWidth) / 2;
      const pBoxY = isWA ? 580 : 360;
      const radius = 32;

      // Drop Shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 20;

      // Rounded container fill
      ctx.beginPath();
      ctx.roundRect(pBoxX, pBoxY, pBoxWidth, pBoxHeight, radius);
      ctx.fillStyle = '#0F172A';
      ctx.fill();
      ctx.restore();

      // Clip product photo inside container
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(pBoxX, pBoxY, pBoxWidth, pBoxHeight, radius);
      ctx.clip();

      // Fit product image cover style
      const imgRatio = pImg.width / pImg.height;
      const boxRatio = pBoxWidth / pBoxHeight;
      let renderW, renderH, renderX, renderY;

      if (imgRatio > boxRatio) {
        renderH = pBoxHeight;
        renderW = pBoxHeight * imgRatio;
        renderX = pBoxX - (renderW - pBoxWidth) / 2;
        renderY = pBoxY;
      } else {
        renderW = pBoxWidth;
        renderH = pBoxWidth / imgRatio;
        renderX = pBoxX;
        renderY = pBoxY - (renderH - pBoxHeight) / 2;
      }
      ctx.drawImage(pImg, renderX, renderY, renderW, renderH);

      // Subtle Overlay Gradient on Bottom of Product Image
      const pGrad = ctx.createLinearGradient(0, pBoxY + pBoxHeight - 150, 0, pBoxY + pBoxHeight);
      pGrad.addColorStop(0, 'rgba(0,0,0,0)');
      pGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = pGrad;
      ctx.fillRect(pBoxX, pBoxY, pBoxWidth, pBoxHeight);
      ctx.restore();

      // Gold Container Border
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(pBoxX, pBoxY, pBoxWidth, pBoxHeight, radius);
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.6)';
      ctx.stroke();
      ctx.restore();

      // 3. Draw Promo Badge Tag
      if (copy.badge) {
        ctx.save();
        const badgeX = pBoxX + 30;
        const badgeY = pBoxY + 30;
        ctx.font = 'bold 28px sans-serif';
        const textWidth = ctx.measureText(copy.badge.toUpperCase()).width;
        const badgeW = textWidth + 40;
        const badgeH = 50;

        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 12);
        ctx.fillStyle = '#DC2626'; // Spicy Red
        ctx.shadowColor = 'rgba(220, 38, 38, 0.5)';
        ctx.shadowBlur = 15;
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(copy.badge.toUpperCase(), badgeX + badgeW / 2, badgeY + badgeH / 2 + 2);
        ctx.restore();
      }

      // 4. Draw Header Brand & Text Promos
      ctx.save();
      // Tag line / Header
      ctx.font = '900 64px sans-serif';
      ctx.fillStyle = '#F59E0B'; // Gold Accent
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
      ctx.shadowBlur = 20;

      const headerY = isWA ? 240 : 160;
      ctx.fillText(copy.headline.toUpperCase(), width / 2, headerY);

      // Subheadline / Promo Description
      ctx.font = '500 34px sans-serif';
      ctx.fillStyle = '#E2E8F0';
      ctx.shadowBlur = 0;
      ctx.fillText(copy.subheadline, width / 2, headerY + 60);
      ctx.restore();

      // 5. Draw Footer Call To Action Box
      ctx.save();
      const ctaY = isWA ? height - 240 : height - 160;
      const ctaW = width * 0.75;
      const ctaH = 90;
      const ctaX = (width - ctaW) / 2;

      const ctaGrad = ctx.createLinearGradient(ctaX, 0, ctaX + ctaW, 0);
      ctaGrad.addColorStop(0, '#D97706');
      ctaGrad.addColorStop(1, '#DC2626');

      ctx.beginPath();
      ctx.roundRect(ctaX, ctaY, ctaW, ctaH, 45);
      ctx.fillStyle = ctaGrad;
      ctx.shadowColor = 'rgba(217, 119, 6, 0.5)';
      ctx.shadowBlur = 25;
      ctx.fill();

      ctx.font = 'bold 36px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔥 PESAN SEKARANG JUGAK!', width / 2, ctaY + ctaH / 2 + 2);
      ctx.restore();

      // 6. Draw Logo (if provided)
      if (logoImgUrl) {
        const lImg = new Image();
        lImg.crossOrigin = 'Anonymous';
        lImg.src = logoImgUrl;
        lImg.onload = () => {
          ctx.save();
          const logoSize = 100;
          const logoX = width - 150;
          const logoY = 80;
          ctx.beginPath();
          ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(lImg, logoX, logoY, logoSize, logoSize);
          ctx.restore();

          const base64Data = canvas.toDataURL('image/jpeg', 0.92).split(',')[1];
          resolve({ imageBase64: base64Data, mimeType: 'image/jpeg' });
        };
        lImg.onerror = () => {
          const base64Data = canvas.toDataURL('image/jpeg', 0.92).split(',')[1];
          resolve({ imageBase64: base64Data, mimeType: 'image/jpeg' });
        };
      } else {
        const base64Data = canvas.toDataURL('image/jpeg', 0.92).split(',')[1];
        resolve({ imageBase64: base64Data, mimeType: 'image/jpeg' });
      }
    };
  });
}

/**
 * Generate promotional caption using Gemini text API
 */
async function generateCaption(apiKey, productInfo, theme, promoDesc, platform) {
  const cleanKey = apiKey.trim();

  const platformConfig = {
    wa_story: {
      style: `Caption untuk WhatsApp Story:
- Maksimal 3 kalimat, singkat dan langsung to the point
- Gunakan emoji yang relevan dan menarik (2-3 emoji)
- Tone: casual, friendly, seperti teman yang merekomendasikan
- Tambahkan call-to-action yang mendesak (contoh: "Chat sekarang!", "Stok terbatas!")
- Bikin penasaran dan FOMO
- JANGAN gunakan hashtag`,
    },
    instagram: {
      style: `Caption untuk Instagram Post:
- 2-4 baris dengan hook kuat di kalimat pertama
- Gunakan line break untuk readability
- Tambahkan 5-8 hashtag yang relevan di akhir
- Tone: aspirasional, lifestyle-oriented, premium feel
- Sertakan call-to-action (DM, link bio, atau komentar)
- Gunakan emoji secara strategis`,
    }
  };

  const config = platformConfig[platform];
  const prompt = `
Kamu adalah Copywriter F&B Profesional.
Buat caption promosi produk makanan/minuman berdasarkan informasi berikut:
- Nama Produk: ${productInfo}
- Tema Promosi: ${theme || 'Promosi Harian'}
- Detail Promo: ${promoDesc || 'Spesial Hari Ini'}

Instruksi Format:
${config.style}
- Gunakan Bahasa Indonesia yang natural dan engaging
- Output HANYA teks caption, tanpa kata pengantar atau penjelasan tambahan.
`.trim();

  try {
    const res = await fetch(
      `${GEMINI_BASE_URL}/${GEMINI_TEXT_MODEL}:generateContent?key=${cleanKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 1.0, maxOutputTokens: 400 }
        })
      }
    );

    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text.trim();
    }

    // Try fallback text model
    const resAlt = await fetch(
      `${GEMINI_BASE_URL}/${GEMINI_TEXT_MODEL_ALT}:generateContent?key=${cleanKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 1.0, maxOutputTokens: 400 }
        })
      }
    );

    if (resAlt.ok) {
      const dataAlt = await resAlt.json();
      const textAlt = dataAlt.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textAlt) return textAlt.trim();
    }

    return `🔥 Promo Spesial ${productInfo}! ${promoDesc || 'Yuk cobain sekarang sebelum kehabisan!'}`;
  } catch (err) {
    return `🔥 Promo Spesial ${productInfo}! ${promoDesc || 'Yuk order sekarang!'}`;
  }
}
