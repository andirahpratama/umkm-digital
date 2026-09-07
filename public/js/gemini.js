/* =========================================================
   UMKM Digital — Gemini AI + Nano Banana F&B Engine
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

    if (errMsg.toLowerCase().includes('api key not valid') || errMsg.toLowerCase().includes('invalid api key')) {
      return false;
    }

    return cleanKey.length >= 15;
  } catch {
    return cleanKey.length >= 15;
  }
}

/**
 * Main Image Generation Pipeline (Nano Banana AI Engine)
 */
async function generatePromotionalImage(apiKey, productPhoto, logoFile, theme, promoDesc, platform) {
  const cleanKey = apiKey.trim();

  // 1. Try Imagen 3 REST API first if available on user key
  try {
    const imagenResult = await tryImagen3Generation(cleanKey, theme, promoDesc, platform);
    if (imagenResult) return imagenResult;
  } catch (err) {
    console.warn('Imagen 3 API skipped, engaging Nano Banana AI Engine:', err.message);
  }

  // 2. Nano Banana AI Engine: Multimodal Vision + High-Fidelity F&B Composite
  return await generateNanoBananaCompositeImage(cleanKey, productPhoto, logoFile, theme, promoDesc, platform);
}

/**
 * Try generating image via Imagen 3 REST API
 */
async function tryImagen3Generation(apiKey, theme, promoDesc, platform) {
  const prompt = `Commercial professional food and beverage product advertisement poster for ${platform === 'wa_story' ? 'WhatsApp Story 9:16' : 'Instagram Post 3:4'}. ${theme ? 'Theme: ' + theme + '.' : ''} ${promoDesc ? 'Promo text: ' + promoDesc + '.' : ''} Studio lighting, mouth-watering food photography, vibrant advertising graphics, high resolution 4k F&B ad layout, clean typography.`;

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
 * Nano Banana Composite Generator: Gemini Vision Prompting + Photorealistic AI Studio Scene
 */
async function generateNanoBananaCompositeImage(apiKey, productPhoto, logoFile, theme, promoDesc, platform) {
  // Analyze photo using Gemini Vision to get creative copy & photorealistic background prompt
  let aiDesign = {
    headline: 'PEDASNYA BIKIN NAGIH!',
    subheadline: promoDesc || 'Renyah, Gurih & Bumbu Melimpah',
    badge: '🔥 BEST SELLER',
    aiBackgroundPrompt: 'Commercial studio food photography background, dramatic warm lighting, dark rustic wooden table, raw spices and fresh chili peppers garnish, 8k resolution, photorealistic, cinematic food ad'
  };

  try {
    const visionDesign = await getNanoBananaVisionAnalysis(apiKey, productPhoto, theme, promoDesc);
    if (visionDesign) aiDesign = { ...aiDesign, ...visionDesign };
  } catch (e) {
    console.warn('Nano Banana Vision analysis fallback used:', e);
  }

  // Load Photorealistic AI Backdrop from Nano Banana Image Generator (Flux Engine)
  const isWA = platform === 'wa_story';
  const canvasW = 1080;
  const canvasH = isWA ? 1920 : 1350;
  const seed = Math.floor(Math.random() * 999999);

  const nanoAiBackdropUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiDesign.aiBackgroundPrompt)}?width=${canvasW}&height=${canvasH}&seed=${seed}&nologo=true&model=flux`;

  let aiBackdropImgUrl = null;
  try {
    // Pre-check if AI backdrop loads quickly
    const backdropRes = await fetch(nanoAiBackdropUrl, { method: 'HEAD' }).catch(() => null);
    if (backdropRes && backdropRes.ok) {
      aiBackdropImgUrl = nanoAiBackdropUrl;
    }
  } catch (e) {
    console.warn('AI backdrop fetch warning:', e);
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

  // Render Studio Quality Poster on HTML5 Canvas
  return await renderNanoBananaPosterCanvas(productDataUrl, aiBackdropImgUrl, logoDataUrl, aiDesign, platform);
}

/**
 * Gemini Vision Nano Banana Analysis
 */
async function getNanoBananaVisionAnalysis(apiKey, productPhoto, theme, promoDesc) {
  const { base64, mimeType } = await fileToBase64(productPhoto);

  const prompt = `Analisis foto produk makanan/minuman ini dengan cermat.
  Tugas kamu sebagai Nano Banana AI Director:
  1. headline: Judul promo iklan F&B yang SANGAT MENARIK & PROVOKATIF (maks 4 kata, misal: "PEDASNYA BIKIN NAGIH!", "KELEZATAN TIADA TARA!", "GURIH RENYAH SPESIAL!").
  2. subheadline: Teks pendukung promo (maks 8 kata, misal: "${promoDesc || 'Dibuat dengan bahan kualitas terbaik'}").
  3. badge: Teks badge promo (maks 2 kata, misal: "🔥 BEST SELLER", "⚡ PROMO HARI INI", "💥 DISC 50%").
  4. aiBackgroundPrompt: Deskripsi fotografi latar studio F&B komersial 8k dalam Bahasa Inggris berdasarkan jenis makanan di foto (misal: "Commercial studio food photography background for spicy chili macaroni, dark marble table, warm golden spotlight, floating red chili peppers, fresh herbs, cinematic lighting, 8k resolution, photorealistic").

  Keluaran HANYA JSON berformat valid tanpa markdown:
  {"headline": "...", "subheadline": "...", "badge": "...", "aiBackgroundPrompt": "..."}`;

  const parts = [
    { inlineData: { data: base64, mimeType } },
    { text: prompt }
  ];

  try {
    const res = await fetch(
      `${GEMINI_BASE_URL}/${GEMINI_TEXT_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 400 }
        })
      }
    );

    if (res.ok) {
      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned);
    }
  } catch (err) {
    console.warn('Nano Banana Vision analysis failed:', err);
  }
  return null;
}

/**
 * Render Nano Banana Studio Poster on HTML5 Canvas
 */
async function renderNanoBananaPosterCanvas(productImgUrl, aiBackdropImgUrl, logoImgUrl, design, platform) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

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

      // Function to complete rendering
      const drawPoster = (bgImg = null) => {

        // 1. Draw Background (Photorealistic AI Backdrop or Studio Radial Gradient)
        if (bgImg) {
          ctx.drawImage(bgImg, 0, 0, width, height);
          // Darken backdrop slightly for contrast
          ctx.fillStyle = 'rgba(10, 5, 8, 0.45)';
          ctx.fillRect(0, 0, width, height);
        } else {
          const bgGrad = ctx.createRadialGradient(width / 2, height * 0.45, 100, width / 2, height / 2, height * 0.85);
          bgGrad.addColorStop(0, '#2D0A0E');
          bgGrad.addColorStop(0.5, '#180608');
          bgGrad.addColorStop(1, '#050203');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, width, height);

          // Ambient Spotlight Beams
          const spotGrad = ctx.createRadialGradient(width / 2, isWA ? 980 : 680, 80, width / 2, isWA ? 980 : 680, 600);
          spotGrad.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
          spotGrad.addColorStop(0.5, 'rgba(220, 38, 38, 0.25)');
          spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = spotGrad;
          ctx.fillRect(0, 0, width, height);
        }

        // Floating Ember Particles
        ctx.save();
        for (let i = 0; i < 40; i++) {
          const px = Math.random() * width;
          const py = Math.random() * height;
          const pr = Math.random() * 4 + 1;
          ctx.beginPath();
          ctx.arc(px, py, pr, 0, Math.PI * 2);
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(252, 211, 77, 0.6)' : 'rgba(248, 113, 113, 0.5)';
          ctx.shadowColor = '#F59E0B';
          ctx.shadowBlur = 10;
          ctx.fill();
        }
        ctx.restore();

        // 2. Food Hero Showcase Frame
        ctx.save();
        const pBoxWidth = width * 0.86;
        const pBoxHeight = isWA ? height * 0.46 : height * 0.54;
        const pBoxX = (width - pBoxWidth) / 2;
        const pBoxY = isWA ? 560 : 330;
        const radius = 36;

        // Outer Glow Shadow
        ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
        ctx.shadowBlur = 45;
        ctx.shadowOffsetY = 15;

        // Fill background behind product photo
        ctx.beginPath();
        ctx.roundRect(pBoxX, pBoxY, pBoxWidth, pBoxHeight, radius);
        ctx.fillStyle = '#0F0406';
        ctx.fill();
        ctx.restore();

        // Clip product photo inside container
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(pBoxX, pBoxY, pBoxWidth, pBoxHeight, radius);
        ctx.clip();

        // Draw product photo cover style
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

        // Vignette Overlay at bottom of food frame
        const pGrad = ctx.createLinearGradient(0, pBoxY + pBoxHeight - 160, 0, pBoxY + pBoxHeight);
        pGrad.addColorStop(0, 'rgba(0,0,0,0)');
        pGrad.addColorStop(1, 'rgba(15, 4, 6, 0.85)');
        ctx.fillStyle = pGrad;
        ctx.fillRect(pBoxX, pBoxY, pBoxWidth, pBoxHeight);
        ctx.restore();

        // Golden Neon Frame Border
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(pBoxX, pBoxY, pBoxWidth, pBoxHeight, radius);
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.restore();

        // 3. Promo Badge Tag
        if (design.badge) {
          ctx.save();
          const badgeX = pBoxX + 30;
          const badgeY = pBoxY + 30;
          ctx.font = '900 30px sans-serif';
          const textWidth = ctx.measureText(design.badge.toUpperCase()).width;
          const badgeW = textWidth + 46;
          const badgeH = 56;

          const bGrad = ctx.createLinearGradient(badgeX, 0, badgeX + badgeW, 0);
          bGrad.addColorStop(0, '#DC2626');
          bGrad.addColorStop(1, '#991B1B');

          ctx.beginPath();
          ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 14);
          ctx.fillStyle = bGrad;
          ctx.shadowColor = 'rgba(220, 38, 38, 0.7)';
          ctx.shadowBlur = 20;
          ctx.fill();

          ctx.strokeStyle = '#FEE2E2';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(design.badge.toUpperCase(), badgeX + badgeW / 2, badgeY + badgeH / 2 + 2);
          ctx.restore();
        }

        // 4. Header Titles & Typography
        ctx.save();
        const headerY = isWA ? 220 : 140;

        // Golden Main Headline
        ctx.font = '900 68px sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
        ctx.shadowBlur = 25;

        const hGrad = ctx.createLinearGradient(0, headerY - 50, 0, headerY + 10);
        hGrad.addColorStop(0, '#FDE68A');
        hGrad.addColorStop(0.5, '#F59E0B');
        hGrad.addColorStop(1, '#D97706');
        ctx.fillStyle = hGrad;

        ctx.fillText(design.headline.toUpperCase(), width / 2, headerY);

        // Subheadline Ribbon
        ctx.font = '600 34px sans-serif';
        ctx.fillStyle = '#F3F4F6';
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 12;
        ctx.fillText(design.subheadline, width / 2, headerY + 64);
        ctx.restore();

        // 5. Footer Call To Action Button
        ctx.save();
        const ctaY = isWA ? height - 230 : height - 150;
        const ctaW = width * 0.78;
        const ctaH = 96;
        const ctaX = (width - ctaW) / 2;

        const ctaGrad = ctx.createLinearGradient(ctaX, 0, ctaX + ctaW, 0);
        ctaGrad.addColorStop(0, '#F59E0B');
        ctaGrad.addColorStop(0.5, '#EF4444');
        ctaGrad.addColorStop(1, '#DC2626');

        ctx.beginPath();
        ctx.roundRect(ctaX, ctaY, ctaW, ctaH, 48);
        ctx.fillStyle = ctaGrad;
        ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
        ctx.shadowBlur = 30;
        ctx.fill();

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FEF08A';
        ctx.stroke();

        ctx.font = '900 38px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 10;
        ctx.fillText('🛒 PESAN SEKARANG JUGAK!', width / 2, ctaY + ctaH / 2 + 2);
        ctx.restore();

        // 6. Draw Logo (if provided)
        if (logoImgUrl) {
          const lImg = new Image();
          lImg.crossOrigin = 'Anonymous';
          lImg.src = logoImgUrl;
          lImg.onload = () => {
            ctx.save();
            const logoSize = 110;
            const logoX = width - 160;
            const logoY = 70;

            ctx.beginPath();
            ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 4, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 15;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(lImg, logoX, logoY, logoSize, logoSize);
            ctx.restore();

            const base64Data = canvas.toDataURL('image/jpeg', 0.94).split(',')[1];
            resolve({ imageBase64: base64Data, mimeType: 'image/jpeg' });
          };
          lImg.onerror = () => {
            const base64Data = canvas.toDataURL('image/jpeg', 0.94).split(',')[1];
            resolve({ imageBase64: base64Data, mimeType: 'image/jpeg' });
          };
        } else {
          const base64Data = canvas.toDataURL('image/jpeg', 0.94).split(',')[1];
          resolve({ imageBase64: base64Data, mimeType: 'image/jpeg' });
        }
      };

      // Load AI Backdrop if available
      if (aiBackdropImgUrl) {
        const bgImg = new Image();
        bgImg.crossOrigin = 'Anonymous';
        bgImg.src = aiBackdropImgUrl;
        bgImg.onload = () => drawPoster(bgImg);
        bgImg.onerror = () => drawPoster(null);
      } else {
        drawPoster(null);
      }
    };
  });
}

/**
 * Generate viral promotional caption using Gemini Multimodal Vision API
 */
async function generateCaption(apiKey, productPhoto, theme, promoDesc, platform) {
  const cleanKey = apiKey.trim();

  let imagePart = null;
  if (productPhoto && typeof productPhoto === 'object' && productPhoto.name) {
    try {
      const { base64, mimeType } = await fileToBase64(productPhoto);
      imagePart = { inlineData: { data: base64, mimeType } };
    } catch (e) {
      console.warn('Failed to convert product photo for caption:', e);
    }
  }

  const platformConfig = {
    wa_story: `Format: WhatsApp Story (Status WA)
- Maksimal 3-4 kalimat, singkat, menggugah selera makan, dan langsung to the point
- Gunakan emoji yang sangat relevan dan menarik (3-4 emoji)
- Call-To-Action yang mendesak (contoh: "Chat kami sekarang!", "Stok terbatas hari ini!")
- JANGAN gunakan hashtag sama sekali.`,
    instagram: `Format: Instagram Post
- 2-4 baris paragraf dengan Hook kuat di kalimat pertama
- Gunakan line break yang rapi
- Tambahkan 6-8 hashtag F&B dan UMKM populer di bagian akhir
- Call-To-Action jualan (DM / Klik Link di Bio)`
  };

  const promptText = `
Kamu adalah Copywriter Marketing F&B Kelas Dunia & Viral Strategist.
Analisis foto produk makanan/minuman yang diunggah ini.

Tugas: Buat caption promosi yang SANGAT MENARIK, GURIH, dan PERSUASIF untuk produk di foto ini.
Detail Tema: ${theme || 'Promosi Utama Harian'}.
Detail Promo: ${promoDesc || 'Penawaran Spesial Hari Ini'}.

${platformConfig[platform] || platformConfig.wa_story}

ATURAN MUTLAK KUALITAS:
- JANGAN PERNAH menyertakan nama file seperti 'IMG...', 'DCIM...', atau kode angka di dalam caption!
- Kenali jenis makanan di foto (misal: makaroni pedas, nasi goreng, boba, snack, dll) dan buat caption khusus tentang kelezatan makanan tersebut!
- Gunakan Bahasa Indonesia yang natural, kekinian, dan membakar selera makan pembaca.
- HANYA keluarkan teks caption-nya saja, tanpa kata pengantar atau tanda petik.
`.trim();

  const parts = [];
  if (imagePart) parts.push(imagePart);
  parts.push({ text: promptText });

  try {
    const res = await fetch(
      `${GEMINI_BASE_URL}/${GEMINI_TEXT_MODEL}:generateContent?key=${cleanKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 500 }
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
          contents: [{ parts }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 500 }
        })
      }
    );

    if (resAlt.ok) {
      const dataAlt = await resAlt.json();
      const textAlt = dataAlt.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textAlt) return textAlt.trim();
    }
  } catch (err) {
    console.error('Caption generation error:', err);
  }

  return `🔥 PROMO SPESIAL HARI INI! 😋\nNikmati kelezatan produk F&B pilihan dengan cita rasa gurih & renyah tiada tara. ${promoDesc ? promoDesc + '!' : ''} Pesan sekarang juga sebelum kehabisan! 📱✨`;
}
