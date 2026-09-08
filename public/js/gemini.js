/* =========================================================
   UMKM Digital — Pure AI Image & Caption Generation Engine
   Powered by Google Nano Banana / AI Food Promotion Generator v5.0
   ========================================================= */

const GEMINI_TEXT_MODEL = 'gemini-1.5-flash';
const GEMINI_TEXT_MODEL_ALT = 'gemini-2.0-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * AI Food Promotion Generator JSON Specification (v5.0) - Google Nano Banana AI Engine
 */
let AI_FOOD_PROMO_JSON_CONFIG = {
  "name": "AI Food Promotion Generator",
  "version": "5.0",
  "language": "id-ID",

  "inputs": {
    "product_image": {
      "type": "image",
      "required": true,
      "label": "Foto Produk",
      "description": "Upload foto produk yang akan dipromosikan."
    },
    "promotion_theme": {
      "type": "text",
      "required": false,
      "label": "Tema Promosi",
      "placeholder": "Contoh: promo sarapan praktis, menu keluarga, promo weekend",
      "description": "Opsional. Jika kosong, AI menentukan tema promosi yang paling relevan dengan produk."
    },
    "promotional_copy": {
      "type": "textarea",
      "required": false,
      "label": "Kalimat Promosi",
      "placeholder": "Masukkan kalimat promosi. Kosongkan jika ingin AI yang menentukan.",
      "description": "Opsional. AI boleh memperbaiki kalimat tetapi wajib mempertahankan makna dan tujuan promosi."
    },
    "brand_logo": {
      "type": "image",
      "required": false,
      "label": "Logo Brand",
      "description": "Opsional. Jika diberikan, gunakan logo asli sebagai identitas brand tanpa mendesain ulang."
    },
    "generate_caption": {
      "type": "boolean",
      "required": false,
      "label": "Generate Caption",
      "default": true
    }
  },

  "priority_logic": {
    "product_identity": 1,
    "promotional_copy": 2,
    "promotion_theme": 3,
    "ai_creativity": 4
  },

  "image_generator": {
    "enabled": true,
    "output": {
      "aspect_ratio": "9:16",
      "orientation": "vertical",
      "use_case": "WhatsApp Story",
      "style": "premium commercial food advertising",
      "quality": "professional"
    },
    "prompt": "Create a premium professional vertical 9:16 promotional advertisement using the uploaded PRODUCT IMAGE as the exact physical product identity reference.\n\nIMPORTANT INPUT ROLES:\nPRODUCT IMAGE determines WHAT THE PRODUCT IS.\nPROMOTION THEME determines WHAT THE CAMPAIGN IS ABOUT.\nPROMOTIONAL COPY determines WHAT MESSAGE SHOULD BE COMMUNICATED.\nBRAND LOGO determines WHAT BRAND IDENTITY SHOULD BE SHOWN.\nAI controls CAMERA ANGLE, PHOTOGRAPHY, LIGHTING, BACKGROUND, ENVIRONMENT, COMPOSITION, TYPOGRAPHY, GRAPHIC DESIGN, AND VISUAL STORYTELLING.\n\n==================================================\n1. STRICT PRODUCT IDENTITY LOCK\n==================================================\n\nThe uploaded PRODUCT IMAGE is an exact physical product identity reference.\n\nPreserve the exact identity of the real product, including:\n- product type\n- product shape\n- physical dimensions\n- proportions\n- packaging\n- bottle, box, wrapper, container, plate, or other physical form\n- brand name\n- product logo\n- label\n- printed text\n- graphics\n- product colors\n- material\n- cap\n- lid\n- seal\n- handle\n- nozzle\n- closure\n- distinctive physical characteristics\n\nThe final image MUST show the SAME PRODUCT.\n\nDO NOT redesign the product.\nDO NOT recreate it as another product.\nDO NOT replace it with a similar product.\nDO NOT simplify it.\nDO NOT stylize it.\nDO NOT modernize it.\nDO NOT change the packaging.\nDO NOT change the product color.\nDO NOT change the proportions.\nDO NOT invent a different label.\nDO NOT invent a different brand.\nDO NOT remove important product details.\nDO NOT hallucinate product characteristics.\n\nThe product must remain immediately recognizable as the exact same physical product from the uploaded reference.\n\n==================================================\n2. CAMERA ANGLE FREEDOM\n==================================================\n\nThe uploaded photo is NOT a composition reference.\nDo NOT simply reproduce the original photograph.\n\nTreat the uploaded image as if it were a professional product reference photograph.\nImagine taking the EXACT SAME physical product and photographing it again with a professional commercial camera from a better and more creative angle.\n\nThe AI has FULL CREATIVE FREEDOM to change:\n- camera position\n- camera height\n- camera distance\n- viewing angle\n- perspective\n- lens perspective\n- focal length appearance\n- framing\n- crop\n- depth of field\n- product placement\n- physically plausible product rotation\n- foreground/background relationship\n- lighting direction\n- shadow direction\n- reflections\n- environmental context\n\nCORE PRINCIPLE:\nMOVE THE CAMERA, NOT THE PRODUCT IDENTITY.\n\nThe goal is to create a fresh professional commercial photograph of the SAME PRODUCT, not a copy of the original photo.\n\n==================================================\n3. PHYSICAL REALISM\n==================================================\n\nTreat the product as a real physical object.\n\nMaintain:\n- realistic geometry\n- physically plausible perspective\n- correct proportions\n- realistic contact with surfaces\n- realistic shadows\n- realistic reflections\n- realistic materials\n- realistic depth\n- believable lighting\n\nIf some parts of the product are hidden in the reference image, do not invent detailed branding, text, labels, or packaging for those hidden areas.\n\n==================================================\n4. PREMIUM FOOD PHOTOGRAPHY\n==================================================\n\nCreate high-end commercial food photography suitable for professional advertising.\n\nUse appropriate combinations of:\n- cinematic lighting\n- professional studio lighting\n- premium food photography lighting\n- realistic highlights\n- realistic shadows\n- realistic reflections\n- natural textures\n- dimensional lighting\n- realistic depth of field\n- premium lens perspective\n- appetizing presentation\n- polished commercial photography\n\nWhen relevant to the actual product, the AI may creatively add:\n- fresh ingredients\n- herbs\n- spices\n- sauce\n- crumbs\n- steam\n- fresh food\n- serving plates\n- utensils\n- cooking surfaces\n- subtle food particles\n- realistic kitchen elements\n\nOnly add elements that are logically relevant to the actual product.\nDo not add unrelated objects.\n\n==================================================\n5. BACKGROUND AND ENVIRONMENT\n==================================================\n\nThe AI has creative freedom to choose the most suitable premium environment.\n\nPossible environments include:\n- premium modern kitchen\n- elegant tabletop\n- restaurant environment\n- clean studio\n- warm food photography setup\n- modern kitchen counter\n- editorial food photography\n- lifestyle dining scene\n- premium commercial advertising environment\n\nChoose the environment based on the actual product and promotion theme.\n\nThe environment must support the product and must never overpower it.\n\n==================================================\n6. PROMOTION THEME\n==================================================\n\nIf PROMOTION THEME is provided:\n- Follow it as the main campaign concept.\n- Build the visual mood around it.\n- Adapt the environment, styling, composition, colors, and graphic design to the theme.\n- Never change the actual product.\n\nIf PROMOTION THEME is empty:\n- Determine the most commercially relevant theme based on the actual product.\n- Choose a theme that naturally creates curiosity and purchase interest.\n\n==================================================\n7. PROMOTIONAL COPY\n==================================================\n\nIf PROMOTIONAL COPY is provided:\n- Treat it as high-priority information.\n- Preserve its original meaning.\n- Preserve its promotional intent.\n- Preserve the actual offer.\n- Improve grammar when necessary.\n- Improve readability.\n- Improve persuasion.\n- Improve sentence structure.\n- Improve emotional impact.\n- Improve typography hierarchy.\n\nThe improved wording MUST remain correlated with the original user input.\n\nDO NOT invent:\n- different prices\n- different discounts\n- different deadlines\n- different offers\n- unsupported benefits\n- guarantees\n- new claims\n- a different promotional meaning\n\nIf PROMOTIONAL COPY is empty:\n- Generate suitable promotional copy based on the actual product and promotion theme.\n\n==================================================\n8. CURIOSITY HOOK\n==================================================\n\nCreate ONE original Indonesian curiosity-driven hook.\n\nMaximum 8 words.\n\nThe hook must:\n- relate directly to the actual product\n- create curiosity\n- create an information gap\n- make people want to know more\n- feel natural\n- be suitable for social media\n\nPsychological direction examples:\n- Kenapa yang ini cepat habis?\n- Ternyata ini rahasianya...\n- Kok bisa seenak ini?\n- Yang tahu ini pasti suka\n\nAvoid generic hooks such as:\n- PROMO TERBAIK\n- HARGA MURAH\n- DISKON BESAR\n- BURUAN BELI\n\nunless the user explicitly provides that type of message.\n\nDo not use misleading clickbait.\n\n==================================================\n9. BRAND LOGO LOCK\n==================================================\n\nIf BRAND LOGO is provided:\n- MUST include the exact uploaded logo.\n- Use it as the official brand identity.\n- Preserve the original symbol.\n- Preserve original typography.\n- Preserve proportions.\n- Preserve colors.\n- Preserve visual identity.\n\nDO NOT:\n- redesign the logo\n- redraw the logo\n- replace the logo\n- create another logo\n- distort the logo\n- change its colors\n- change its typography\n\nPlace the logo naturally in a premium location such as:\n- top corner\n- top center\n- bottom corner\n- subtle brand badge\n- clean header area\n\nThe logo should be visible but should not overpower the product.\n\nIf BRAND LOGO is absent:\nDO NOT invent a logo.\n\n==================================================\n10. TYPOGRAPHY\n==================================================\n\nCreate attractive, modern, premium promotional typography.\n\nUse:\n- bold display typography for the main hook\n- modern clean sans-serif typography for supporting text\n- strong readable typography for CTA\n- clear hierarchy\n- attractive spacing\n- smartphone-friendly sizing\n\nPossible typography treatments:\n- oversized headline\n- highlighted keywords\n- outlined keywords\n- subtle shadows\n- gradient accents\n- text inside shapes\n- layered typography\n- accent underline\n- contrasting font weights\n\nTypography must be highly readable on a smartphone screen.\n\n==================================================\n11. GRAPHIC DESIGN\n==================================================\n\nCreate sophisticated social media advertising graphic design.\n\nPossible elements:\n- dynamic geometric shapes\n- organic shapes\n- abstract curves\n- gradients\n- decorative lines\n- premium badges\n- subtle glow\n- visual framing\n- editorial elements\n- subtle patterns\n- elegant separators\n- modern visual accents\n\nUse graphic elements to strengthen the advertising composition.\n\nDO NOT clutter the image.\nDO NOT cover the product.\nDO NOT make the design look amateurish.\n\n==================================================\n12. COLOR SYSTEM\n==================================================\n\nAnalyze the actual PRODUCT IMAGE and BRAND LOGO when available.\n\nBuild a cohesive visual color palette using:\n- colors naturally present in the product\n- brand colors\n- complementary colors\n- tasteful contrasting accents\n- neutral support colors\n\nThe background and graphic design may use creative colors.\n\nNEVER change the actual product colors.\nNEVER change the actual brand logo colors.\n\n==================================================\n13. COMPOSITION\n==================================================\n\nCreate a strong vertical 9:16 composition optimized for smartphone viewing and WhatsApp Story.\n\nThe product must remain the visual hero.\n\nA possible hierarchy is:\n1. Brand Logo\n2. Curiosity Hook\n3. Hero Product\n4. Supporting Promotional Message\n5. CTA\n\nHowever, the AI may change the hierarchy when a better commercial composition is appropriate.\n\nUse:\n- balanced negative space\n- strong focal point\n- clear typography hierarchy\n- professional alignment\n- premium visual rhythm\n- natural visual flow\n\n==================================================\n14. FINAL QUALITY CONTROL\n==================================================\n\nBefore finalizing the image, compare the generated product against PRODUCT IMAGE.\n\nVerify:\n- SAME product\n- SAME packaging\n- SAME shape\n- SAME proportions\n- SAME brand\n- SAME label\n- SAME product logo\n- SAME product colors\n- SAME distinctive physical details\n\nIf unnecessary product modifications occurred, correct them before finalizing.\n\nFINAL RULE:\n\nPRODUCT IMAGE = WHAT PRODUCT\nPROMOTION THEME = WHAT CAMPAIGN\nPROMOTIONAL COPY = WHAT MESSAGE\nBRAND LOGO = WHAT BRAND\nAI = CAMERA + PHOTOGRAPHY + LIGHTING + BACKGROUND + COMPOSITION + TYPOGRAPHY + GRAPHIC DESIGN\n\nNEVER CHANGE THE ACTUAL PRODUCT.",
    "variables": {
      "PRODUCT_IMAGE": "{{PRODUCT_IMAGE}}",
      "PROMOTION_THEME": "{{PROMOTION_THEME}}",
      "PROMOTIONAL_COPY": "{{PROMOTIONAL_COPY}}",
      "BRAND_LOGO": "{{BRAND_LOGO}}"
    },
    "negative_rules": [
      "Do not change product identity",
      "Do not redesign product packaging",
      "Do not replace the product",
      "Do not create a similar product",
      "Do not change product colors",
      "Do not change product proportions",
      "Do not change product labels",
      "Do not invent product branding",
      "Do not distort brand logo",
      "Do not copy the original photo composition",
      "Do not create unrelated environments",
      "Do not clutter the composition",
      "Do not cover the product with text",
      "Do not invent unsupported promotional claims"
    ]
  },

  "caption_generator": {
    "enabled": true,
    "prompt": "Generate ONE ready-to-publish promotional caption in natural Indonesian based on the actual PRODUCT IMAGE.\n\nINPUT PRIORITY:\n1. PRODUCT IMAGE\n2. PROMOTIONAL COPY\n3. PROMOTION THEME\n4. AI CREATIVE INTERPRETATION\n\nThe caption MUST be directly related to the actual product shown in PRODUCT IMAGE.\n\n==================================================\n1. CAPTION OBJECTIVE\n==================================================\n\nCreate a caption that is:\n- simple\n- persuasive\n- conversational\n- natural\n- curiosity-driven\n- emotionally engaging\n- product-specific\n- suitable for WhatsApp\n- suitable for social media\n- ready to publish\n\nThe caption must complement the promotional image and should NOT simply repeat the exact text displayed inside the image.\n\n==================================================\n2. PROMOTIONAL COPY RULE\n==================================================\n\nIf PROMOTIONAL COPY is provided:\n- Preserve its original meaning.\n- Preserve its promotional intent.\n- Preserve the actual offer.\n- Improve the wording naturally.\n- Keep the caption strongly correlated with the original message.\n\nDO NOT invent:\n- prices\n- discounts\n- deadlines\n- promotions\n- guarantees\n- unsupported benefits\n- medical claims\n- exaggerated claims\n\nIf PROMOTIONAL COPY is empty:\n- Determine an appropriate promotional angle from the actual product and PROMOTION THEME.\n\n==================================================\n3. CURIOSITY RULE\n==================================================\n\nThe first sentence must function as the strongest curiosity hook.\n\nCreate an information gap without misleading the audience.\n\nThe reader should naturally think:\n- Kenapa?\n- Apa yang spesial?\n- Kok bisa?\n- Memangnya seenak itu?\n- Apa yang membuat produk ini menarik?\n\nAvoid generic clickbait.\n\n==================================================\n4. CAPTION STRUCTURE\n==================================================\n\nUse this structure:\n\n1. Curiosity Hook\n2. Product Appeal\n3. Promotional Message\n4. Call To Action\n\nRecommended length:\n2–5 short sentences.\n\nUse natural conversational Indonesian.\n\n==================================================\n5. PRODUCT RELEVANCE\n==================================================\n\nOnly mention:\n- characteristics visible in PRODUCT IMAGE\n- information explicitly provided by PROMOTIONAL COPY\n- information reasonably inferable from the actual product\n\nDo not make unsupported factual claims.\n\n==================================================\n6. HASHTAGS\n==================================================\n\nIf hashtags are useful:\n- maximum 5\n- highly relevant to the product\n- relevant to the promotion\n- avoid hashtag spam\n\n==================================================\n7. OUTPUT FORMAT\n==================================================\n\nCAPTION: [final ready-to-publish caption]\n\nHASHTAGS: [optional relevant hashtags]",
    "variables": {
      "PRODUCT_IMAGE": "{{PRODUCT_IMAGE}}",
      "PROMOTION_THEME": "{{PROMOTION_THEME}}",
      "PROMOTIONAL_COPY": "{{PROMOTIONAL_COPY}}"
    },
    "output": {
      "language": "Indonesian",
      "length": "2-5 short sentences",
      "ready_to_publish": true,
      "multiple_variations": false,
      "maximum_hashtags": 5
    }
  },

  "execution_flow": [
    { "step": 1, "action": "validate_input", "input": "PRODUCT_IMAGE", "required": true },
    { "step": 2, "action": "analyze_product", "instruction": "Determine exact product identity from PRODUCT_IMAGE." },
    { "step": 3, "action": "analyze_promotion_theme", "instruction": "Use PROMOTION_THEME if provided. Otherwise let AI determine the most relevant theme." },
    { "step": 4, "action": "analyze_promotional_copy", "instruction": "Use PROMOTIONAL_COPY if provided. Improve wording while preserving meaning and promotional intent." },
    { "step": 5, "action": "analyze_brand_logo", "instruction": "If BRAND_LOGO is provided, preserve and use the exact uploaded logo." },
    { "step": 6, "action": "generate_image", "instruction": "Generate the professional 9:16 promotional image using image_generator.prompt." },
    { "step": 7, "action": "quality_control", "instruction": "Verify that the generated product remains identical to PRODUCT_IMAGE." },
    { "step": 8, "action": "generate_caption", "condition": "GENERATE_CAPTION == true", "instruction": "Generate one ready-to-publish caption using caption_generator.prompt." },
    { "step": 9, "action": "return_result", "output": ["9:16 promotional image", "ready-to-publish caption when enabled"] }
  ],

  "safety_and_truthfulness": {
    "invented_prices": false,
    "invented_discounts": false,
    "invented_deadlines": false,
    "invented_offers": false,
    "unsupported_claims": false,
    "misleading_clickbait": false,
    "unsupported_medical_claims": false,
    "fake_branding": false
  }
};

/**
 * Dynamically load JSON configuration from /ai-food-promo-config.json
 */
async function loadAIFoodPromoJsonConfig() {
  try {
    const res = await fetch('/ai-food-promo-config.json');
    if (res.ok) {
      const data = await res.json();
      if (data && data.image_generator && data.image_generator.prompt) {
        AI_FOOD_PROMO_JSON_CONFIG = data;
        console.log('✅ AI Food Promotion Generator JSON config loaded (v' + data.version + ')');
      }
    }
  } catch (err) {
    console.warn('Could not fetch /ai-food-promo-config.json, using fallback config:', err);
  }
}

if (typeof window !== 'undefined') {
  loadAIFoodPromoJsonConfig();
}

/**
 * Convert File object to base64 data URL
 */
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type || 'image/jpeg' });
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
 * Gemini Vision Analysis to craft high-detail AI Prompts following AI Food Promotion Generator v5.0
 */
async function analyzePhotoForFullAIPrompt(apiKey, productPhoto, logoFile, theme, promoDesc, platform) {
  const parts = [];

  // Add Product Photo (Mandatory)
  const productB64 = await fileToBase64(productPhoto);
  parts.push({ inlineData: { data: productB64.base64, mimeType: productB64.mimeType } });

  // Add Brand Logo if uploaded (Optional)
  if (logoFile && typeof logoFile === 'object' && logoFile.name) {
    try {
      const logoB64 = await fileToBase64(logoFile);
      parts.push({ inlineData: { data: logoB64.base64, mimeType: logoB64.mimeType } });
    } catch (e) {
      console.warn('Failed to convert logo for prompt analysis:', e);
    }
  }

  const isWA = platform === 'wa_story';
  const aspectStr = isWA ? '9:16 vertical' : '3:4 portrait';
  const useCaseStr = isWA ? 'WhatsApp Story' : 'Instagram Post';

  const basePrompt = AI_FOOD_PROMO_JSON_CONFIG.image_generator.prompt;
  const negativeRules = (AI_FOOD_PROMO_JSON_CONFIG.image_generator.negative_rules || []).map(r => `- ${r}`).join('\n');

  const systemPrompt = `${basePrompt}

==================================================
15. NEGATIVE RULES (STRICTLY ENFORCED)
==================================================
${negativeRules}

INPUT PARAMETERS FOR THIS SPECIFIC REQUEST:
- PROMOTION THEME: "${theme || ''}" (If empty, determine the most relevant F&B theme based on actual product)
- PROMOTIONAL COPY: "${promoDesc || ''}" (If empty, AI generates appropriate copy)
- BRAND LOGO PROVIDED: ${logoFile ? 'Yes (provided in multimodal input)' : 'No'}
- ASPECT RATIO / USE CASE: ${aspectStr} (${useCaseStr})

Output ONLY valid JSON without markdown formatting:
{
  "foodAnalysis": "Exact physical product identity description from uploaded reference photo",
  "curiosityHook": "Indonesian curiosity hook (max 8 words)",
  "headlineWording": "Short bold promotional headline",
  "detailedPrompt": "Comprehensive high-detail English commercial food photography prompt adhering strictly to all 14 rules above for image generation model"
}`;

  parts.push({ text: systemPrompt });

  const modelsToTry = [GEMINI_TEXT_MODEL, GEMINI_TEXT_MODEL_ALT, 'gemini-1.5-pro'];

  for (const model of modelsToTry) {
    try {
      const res = await fetch(
        `${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
          })
        }
      );

      if (res.ok) {
        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.detailedPrompt) return parsed;
        }
      }
    } catch (err) {
      console.warn(`Vision prompt analysis model ${model} error:`, err);
    }
  }

  return null;
}

/**
 * Try generating full fresh image via Imagen 3 REST API
 */
async function tryImagen3FullGen(apiKey, detailedPrompt, platform) {
  const models = ['imagen-3.0-generate-002', 'imagen-3.0-fast-generate-001'];
  for (const model of models) {
    try {
      const res = await fetch(
        `${GEMINI_BASE_URL}/${model}:predict?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt: detailedPrompt }],
            parameters: {
              sampleCount: 1,
              aspectRatio: platform === 'wa_story' ? '9:16' : '3:4'
            }
          })
        }
      );

      if (res.ok) {
        const data = await res.json();
        const b64 = data.predictions?.[0]?.bytesBase64Encoded;
        if (b64) return { imageBase64: b64, mimeType: 'image/png' };
      }
    } catch (err) {
      console.warn(`Imagen 3 (${model}) call skipped/failed:`, err);
    }
  }
  return null;
}

/**
 * Smart Commercial Poster Compositor Fallback (Client-Side HTML5 Canvas)
 * Guarantees 100% fail-proof, crisp 9:16 / 3:4 promotional poster output with exact product photo & logo lock
 */
async function compositePromotionalPoster(productPhoto, logoFile, visualConcept, theme, promoDesc, platform) {
  const isWA = platform === 'wa_story';
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = isWA ? 1920 : 1350;
  const ctx = canvas.getContext('2d');

  // Load product image
  const productImg = new Image();
  const productB64 = await fileToBase64(productPhoto);
  await new Promise((res, rej) => {
    productImg.onload = res;
    productImg.onerror = rej;
    productImg.src = `data:${productB64.mimeType};base64,${productB64.base64}`;
  });

  // Load logo image if available
  let logoImg = null;
  if (logoFile && typeof logoFile === 'object' && logoFile.name) {
    try {
      const logoB64 = await fileToBase64(logoFile);
      logoImg = new Image();
      await new Promise((res) => {
        logoImg.onload = res;
        logoImg.onerror = () => { logoImg = null; res(); };
        logoImg.src = `data:${logoB64.mimeType};base64,${logoB64.base64}`;
      });
    } catch (e) {}
  }

  // 1. Draw rich commercial background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, '#0d0b18');
  bgGrad.addColorStop(0.35, '#1b122e');
  bgGrad.addColorStop(0.75, '#0e0a1b');
  bgGrad.addColorStop(1, '#050309');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Studio Spotlight Radial Glow
  const spotGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height * 0.45, 60, canvas.width / 2, canvas.height * 0.45, 550);
  spotGrad.addColorStop(0, 'rgba(245, 158, 11, 0.28)');
  spotGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.12)');
  spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = spotGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Abstract light ring accents
  ctx.save();
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.12)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(canvas.width * 0.15, canvas.height * 0.22, 220, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(canvas.width * 0.85, canvas.height * 0.72, 280, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Helper text wrapping function
  function wrapCanvasText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        context.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line.trim(), x, currentY);
    return currentY;
  }

  // 2. Draw Header & Brand Logo
  let topOffset = 80;
  if (logoImg) {
    const logoMaxW = 220;
    const logoMaxH = 90;
    let lW = logoImg.width;
    let lH = logoImg.height;
    const ratio = Math.min(logoMaxW / lW, logoMaxH / lH);
    lW = lW * ratio;
    lH = lH * ratio;

    const pad = 20;
    const boxW = lW + pad * 2;
    const boxH = lH + pad * 2;
    const boxX = (canvas.width - boxW) / 2;
    const boxY = topOffset;

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 24);
    ctx.fill();
    ctx.stroke();

    ctx.drawImage(logoImg, boxX + pad, boxY + pad, lW, lH);
    ctx.restore();

    topOffset = boxY + boxH + 35;
  } else {
    topOffset = 90;
  }

  // 3. Draw Curiosity Hook Badge
  const hookText = visualConcept.curiosityHook || 'Ternyata ini rahasia lezatnya! 😋';
  ctx.save();
  ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const hookMetrics = ctx.measureText(hookText);
  const hookW = hookMetrics.width + 64;
  const hookH = 72;
  const hookX = (canvas.width - hookW) / 2;
  const hookY = topOffset;

  const goldGrad = ctx.createLinearGradient(hookX, hookY, hookX + hookW, hookY + hookH);
  goldGrad.addColorStop(0, '#f59e0b');
  goldGrad.addColorStop(1, '#d97706');

  ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
  ctx.shadowBlur = 24;
  ctx.fillStyle = goldGrad;
  ctx.beginPath();
  ctx.roundRect(hookX, hookY, hookW, hookH, 36);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(hookText, canvas.width / 2, hookY + hookH / 2 + 2);
  ctx.restore();

  // 4. Draw Hero Product Photo
  const pMaxW = canvas.width * 0.84;
  const pMaxH = isWA ? canvas.height * 0.44 : canvas.height * 0.46;
  let pW = productImg.width;
  let pH = productImg.height;
  const pRatio = Math.min(pMaxW / pW, pMaxH / pH);
  pW = pW * pRatio;
  pH = pH * pRatio;

  const pX = (canvas.width - pW) / 2;
  const pY = hookY + hookH + 40 + (pMaxH - pH) / 2;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 45;
  ctx.shadowOffsetY = 24;

  const borderPad = 14;
  ctx.fillStyle = '#1e1933';
  ctx.beginPath();
  ctx.roundRect(pX - borderPad, pY - borderPad, pW + borderPad * 2, pH + borderPad * 2, 28);
  ctx.fill();

  ctx.beginPath();
  ctx.roundRect(pX, pY, pW, pH, 18);
  ctx.clip();
  ctx.drawImage(productImg, pX, pY, pW, pH);
  ctx.restore();

  // 5. Draw Promotional Headline & Copy at bottom
  let bottomY = pY + pH + borderPad + 50;

  const promoTitleText = theme || visualConcept.headlineWording || visualConcept.foodAnalysis || 'PROMO SPESIAL';
  ctx.save();
  ctx.font = '900 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 12;
  bottomY = wrapCanvasText(ctx, promoTitleText.toUpperCase(), canvas.width / 2, bottomY, canvas.width * 0.88, 54) + 22;

  if (promoDesc) {
    ctx.font = '500 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    bottomY = wrapCanvasText(ctx, promoDesc, canvas.width / 2, bottomY, canvas.width * 0.86, 40) + 24;
  }
  ctx.restore();

  // 6. Draw Call To Action Pill Badge
  ctx.save();
  const ctaText = '📲 Pesan Sekarang Sebelum Kehabisan!';
  ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const ctaMetrics = ctx.measureText(ctaText);
  const ctaW = ctaMetrics.width + 64;
  const ctaH = 68;
  const ctaX = (canvas.width - ctaW) / 2;
  const ctaY = Math.min(bottomY + 12, canvas.height - ctaH - 60);

  const ctaGrad = ctx.createLinearGradient(ctaX, ctaY, ctaX + ctaW, ctaY + ctaH);
  ctaGrad.addColorStop(0, '#10b981');
  ctaGrad.addColorStop(1, '#059669');

  ctx.shadowColor = 'rgba(16, 185, 129, 0.45)';
  ctx.shadowBlur = 20;
  ctx.fillStyle = ctaGrad;
  ctx.beginPath();
  ctx.roundRect(ctaX, ctaY, ctaW, ctaH, 34);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(ctaText, canvas.width / 2, ctaY + ctaH / 2 + 2);
  ctx.restore();

  const dataUrl = canvas.toDataURL('image/jpeg', 0.94);
  return {
    imageBase64: dataUrl.split(',')[1],
    mimeType: 'image/jpeg',
    visualConcept
  };
}

/**
 * Pure AI Image Generation Pipeline using Google Nano Banana v5.0 Rules
 */
async function generatePromotionalImage(apiKey, productPhoto, logoFile, theme, promoDesc, platform) {
  const cleanKey = apiKey.trim();

  // 1. Analyze product photo & logo concept using Gemini Vision under v5.0 Prompt Rules
  let visualConcept = {
    foodAnalysis: 'Indonesian F&B product',
    curiosityHook: 'Ternyata ini rahasianya...',
    headlineWording: 'PROMO SPESIAL HARI INI',
    detailedPrompt: 'A premium high-end commercial food advertisement poster for delicious Indonesian culinary product, 8k resolution food photography, professional studio spotlight lighting, cinematic background'
  };

  try {
    const aiAnalysis = await analyzePhotoForFullAIPrompt(cleanKey, productPhoto, logoFile, theme, promoDesc, platform);
    if (aiAnalysis) visualConcept = aiAnalysis;
  } catch (e) {
    console.warn('Vision prompt analysis fallback:', e);
  }

  // 2. Try Imagen 3 API with full prompt generated by Gemini Vision
  try {
    const imagenResult = await tryImagen3FullGen(cleanKey, visualConcept.detailedPrompt, platform);
    if (imagenResult) {
      return {
        ...imagenResult,
        visualConcept
      };
    }
  } catch (err) {
    console.warn('Imagen 3 direct call skipped/failed:', err.message);
  }

  // 3. Multi-Model Pollinations AI Engine
  const isWA = platform === 'wa_story';
  const width = 1080;
  const height = isWA ? 1920 : 1350;
  const seed = Math.floor(Math.random() * 9999999);

  const cleanPrompt = (visualConcept.detailedPrompt || '').substring(0, 800);
  const pollModels = ['flux', 'turbo'];

  for (const model of pollModels) {
    try {
      const fluxAiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=${model}`;
      const res = await fetch(fluxAiUrl);
      if (res.ok) {
        const blob = await res.blob();
        if (blob && blob.size > 1000) {
          const base64Data = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
          });

          return {
            imageBase64: base64Data,
            mimeType: 'image/jpeg',
            visualConcept
          };
        }
      }
    } catch (err) {
      console.warn(`Pollinations ${model} call error:`, err);
    }
  }

  // 4. Smart Commercial Poster Compositor Fallback (100% fail-proof crisp output)
  return await compositePromotionalPoster(productPhoto, logoFile, visualConcept, theme, promoDesc, platform);
}

/**
 * Generate ready-to-publish promotional caption following Google Nano Banana v5.0 Specification
 */
async function generateCaption(apiKey, productPhoto, logoFile, theme, promoDesc, platform, generateCaptionBool = true) {
  if (generateCaptionBool === false) return null;

  const cleanKey = apiKey.trim();
  const parts = [];

  // Add product photo
  if (productPhoto && typeof productPhoto === 'object' && productPhoto.name) {
    try {
      const { base64, mimeType } = await fileToBase64(productPhoto);
      parts.push({ inlineData: { data: base64, mimeType } });
    } catch (e) {
      console.warn('Failed to convert product photo for caption:', e);
    }
  }

  // Add logo file if available
  if (logoFile && typeof logoFile === 'object' && logoFile.name) {
    try {
      const { base64, mimeType } = await fileToBase64(logoFile);
      parts.push({ inlineData: { data: base64, mimeType } });
    } catch (e) {
      console.warn('Failed to convert brand logo for caption:', e);
    }
  }

  const baseCaptionPrompt = AI_FOOD_PROMO_JSON_CONFIG.caption_generator.prompt;

  const promptText = `
${baseCaptionPrompt}

INPUT PARAMETERS FOR THIS SPECIFIC REQUEST:
- PROMOTIONAL COPY: "${promoDesc || ''}"
- PROMOTION THEME: "${theme || ''}"
- TARGET PLATFORM / USE CASE: ${platform === 'wa_story' ? 'WhatsApp Story (9:16)' : 'Instagram Post (3:4)'}
- BRAND LOGO PROVIDED: ${logoFile ? 'Yes' : 'No'}

Output ONLY the final ready-to-publish text with structure:
[Caption text]

[Hashtags if applicable]
`.trim();

  parts.push({ text: promptText });

  const textModels = [GEMINI_TEXT_MODEL, GEMINI_TEXT_MODEL_ALT, 'gemini-1.5-pro'];

  for (const model of textModels) {
    try {
      const res = await fetch(
        `${GEMINI_BASE_URL}/${model}:generateContent?key=${cleanKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { temperature: 0.85, maxOutputTokens: 600 }
          })
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) return text.trim();
      }
    } catch (err) {
      console.warn(`Caption generation model ${model} error:`, err);
    }
  }

  return `Ternyata ini rahasia rasa lezat yang bikin ketagihan! 😋\nNikmati kelezatan sajian istimewa ini dengan cita rasa spesial. ${promoDesc ? promoDesc : 'Pesan sekarang sebelum kehabisan!'} 📱✨`;
}

