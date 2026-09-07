/* =========================================================
   UMKM Digital — Gemini API Integration
   ========================================================= */

const GEMINI_IMAGE_MODEL = 'gemini-2.0-flash-preview-image-generation';
const GEMINI_TEXT_MODEL = 'gemini-2.0-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Convert File object to base64 data URL
 */
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      // Extract just the base64 data (remove data:image/...;base64, prefix)
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Generate promotional image using Gemini API
 * @param {string} apiKey - User's Gemini API key
 * @param {File} productPhoto - Product photo file
 * @param {File|null} logoFile - Business logo file (optional)
 * @param {string} theme - Promotion theme (optional)
 * @param {string} promoDesc - Promo description (optional)
 * @param {string} platform - 'wa_story' or 'instagram'
 * @returns {Promise<{imageBase64: string, mimeType: string}>}
 */
async function generatePromotionalImage(apiKey, productPhoto, logoFile, theme, promoDesc, platform) {
  const platformConfig = {
    wa_story: {
      name: 'WhatsApp Story',
      aspectRatio: '9:16 portrait',
      style: 'vertical story format, full bleed design with large impactful text, vibrant colors that pop on mobile screens',
      audience: 'casual WhatsApp contacts, informal but eye-catching'
    },
    instagram: {
      name: 'Instagram Post',
      aspectRatio: '3:4 portrait',
      style: 'Instagram-worthy food photography aesthetic, clean composition, lifestyle feel, premium quality',
      audience: 'Instagram food enthusiasts, sophisticated visual appeal'
    }
  };

  const config = platformConfig[platform];
  const themeText = theme
    ? `Tema promosi: ${theme}.`
    : 'Tentukan tema yang paling tepat dan menarik secara kreatif berdasarkan produk (modern, festive, atau elegan).';

  const promoText = promoDesc
    ? `Deskripsi promo: "${promoDesc}".`
    : 'Buat teks promosi yang menarik dan hook berdasarkan produk.';

  const prompt = `
Kamu adalah seorang desainer grafis profesional dan fotografer makanan kelas dunia.

Tugas: Buat gambar promosi produk makanan/minuman untuk ${config.name} dalam format ${config.aspectRatio}.

INSTRUKSI PENTING:
- Gunakan foto produk yang diberikan sebagai referensi utama
- ${themeText}
- ${promoText}
- Style: ${config.style}
- Target audience: ${config.audience}
- Hasil harus terlihat seperti iklan profesional dari brand F&B ternama
- Kualitas resolusi tinggi, detail tajam, pencahayaan dramatis
- Sertakan elemen desain grafis: typography yang kuat, layout yang dinamis, warna yang vibrant
- Tambahkan teks promosi dalam Bahasa Indonesia yang menarik, singkat, dan hook
- Jika ada logo bisnis, integrasikan dengan elegan di sudut gambar
- Hasil gambar harus membuat orang ingin segera membeli produk ini
- JANGAN tampilkan watermark atau tulisan AI generated

Format keluaran: Gambar promosi berkualitas tinggi dalam format ${config.aspectRatio} yang siap posting.
`.trim();

  // Build parts array
  const parts = [{ text: prompt }];

  // Add product photo
  if (productPhoto) {
    const { base64, mimeType } = await fileToBase64(productPhoto);
    parts.push({
      inlineData: { data: base64, mimeType }
    });
    parts.push({ text: 'Ini adalah foto produk yang harus dijadikan fokus utama gambar promosi.' });
  }

  // Add logo if provided
  if (logoFile) {
    const { base64, mimeType } = await fileToBase64(logoFile);
    parts.push({
      inlineData: { data: base64, mimeType }
    });
    parts.push({ text: 'Ini adalah logo bisnis yang harus diintegrasikan secara elegan di gambar.' });
  }

  const requestBody = {
    contents: [{ parts }],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
      temperature: 1.0,
    }
  };

  const response = await fetch(
    `${GEMINI_BASE_URL}/${GEMINI_IMAGE_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errMsg = errData?.error?.message || `HTTP ${response.status}`;
    if (response.status === 400 && errMsg.includes('API key')) {
      throw new Error('API Key tidak valid. Pastikan API Key Gemini kamu sudah benar.');
    }
    if (response.status === 429) {
      throw new Error('Quota API terlampaui. Coba lagi dalam beberapa saat.');
    }
    throw new Error(`Gagal generate gambar: ${errMsg}`);
  }

  const data = await response.json();
  const candidates = data.candidates;

  if (!candidates || candidates.length === 0) {
    throw new Error('Tidak ada hasil yang dihasilkan. Coba lagi.');
  }

  // Find image part in response
  for (const candidate of candidates) {
    for (const part of candidate.content?.parts || []) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        return {
          imageBase64: part.inlineData.data,
          mimeType: part.inlineData.mimeType
        };
      }
    }
  }

  throw new Error('Gambar tidak ditemukan dalam respons AI. Coba lagi.');
}

/**
 * Generate promotional caption using Gemini text API
 */
async function generateCaption(apiKey, productInfo, theme, promoDesc, platform) {
  const platformConfig = {
    wa_story: {
      style: `Caption untuk WhatsApp Story:
- Maksimal 3 kalimat, singkat dan langsung to the point
- Gunakan emoji yang relevan dan menarik (2-3 emoji)
- Tone: casual, friendly, seperti teman yang merekomendasikan
- Tambahkan call-to-action yang mendesak (contoh: "Chat sekarang!", "Stok terbatas!")
- Bikin penasaran dan FOMO (Fear Of Missing Out)
- JANGAN gunakan hashtag (tidak relevan di WA Story)`,
      example: 'Contoh: "🔥 Nggak nyobain ini? Rugi banget! Promo hari ini doang, pesan sekarang sebelum habis! 📱"'
    },
    instagram: {
      style: `Caption untuk Instagram Post:
- 2-4 baris dengan hook kuat di kalimat pertama
- Gunakan line break untuk readability
- Tambahkan 5-8 hashtag yang relevan di akhir
- Tone: aspirasional, lifestyle-oriented, premium feel
- Sertakan call-to-action (DM, link bio, atau komentar)
- Gunakan emoji secara strategis
- Bikin orang ingin save dan share postingan ini`,
      example: 'Contoh:\n"✨ Kenikmatan yang nggak bisa diabaikan...\n\nSetiap gigitan adalah pengalaman rasa yang tak terlupakan. Yuk, buktikan sendiri! 🍽️\n\n📍 Order via DM atau klik link bio\n.\n.\n#kuliner #makananenak #food #UMKM #foodie"'
    }
  };

  const config = platformConfig[platform];
  const themeInfo = theme ? `Tema: ${theme}` : 'Tema: bebas/kreatif';
  const promoInfo = promoDesc ? `Promo: ${promoDesc}` : 'Tidak ada promo spesifik';

  const prompt = `
Kamu adalah copywriter marketing F&B profesional yang ahli dalam membuat caption media sosial viral.

Buat caption promosi yang menarik untuk produk makanan/minuman berikut:
- Produk: ${productInfo || 'Produk makanan/minuman'}
- ${themeInfo}
- ${promoInfo}

${config.style}

${config.example}

Penting:
- Gunakan Bahasa Indonesia yang natural dan engaging
- Jangan buat caption yang generik atau membosankan
- Harus bikin orang penasaran dan mau take action
- Output HANYA caption-nya saja, tanpa penjelasan tambahan
`.trim();

  const response = await fetch(
    `${GEMINI_BASE_URL}/${GEMINI_TEXT_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 1.2, maxOutputTokens: 500 }
      })
    }
  );

  if (!response.ok) {
    throw new Error('Gagal generate caption');
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return text?.trim() || 'Caption tidak tersedia.';
}

/**
 * Validate Gemini API Key by making a simple test request
 */
async function validateGeminiApiKey(apiKey) {
  try {
    const response = await fetch(
      `${GEMINI_BASE_URL}/${GEMINI_TEXT_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello' }] }],
          generationConfig: { maxOutputTokens: 10 }
        })
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}
