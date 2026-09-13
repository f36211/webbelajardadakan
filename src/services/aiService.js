import { GoogleGenAI } from '@google/genai';

export const AI_PROVIDERS = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Respon cepat, akurat, & cerdas dari Google AI',
    defaultModel: 'gemini-flash-lite-latest',
    availableModels: [
      { id: 'gemini-flash-lite-latest', name: 'Gemini Flash Lite (Default)' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
    ],
    keyUrl: 'https://aistudio.google.com/app/apikey',
    placeholder: 'AIzaSy...',
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Akses ratusan model AI open-source & komersial',
    defaultModel: 'google/gemini-2.0-flash-lite:free',
    availableModels: [
      { id: 'google/gemini-2.0-flash-lite:free', name: 'Gemini 2.0 Flash Lite (Free)' },
      { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B' },
      { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3' },
    ],
    keyUrl: 'https://openrouter.ai/keys',
    placeholder: 'sk-or-v1-...',
  },
  openai: {
    id: 'openai',
    name: 'OpenAI (ChatGPT)',
    description: 'Model standar industri dari OpenAI',
    defaultModel: 'gpt-4o-mini',
    availableModels: [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Cepat & Hemat)' },
      { id: 'gpt-4o', name: 'GPT-4o (Kemampuan Penuh)' },
    ],
    keyUrl: 'https://platform.openai.com/api-keys',
    placeholder: 'sk-...',
  },
  grok: {
    id: 'grok',
    name: 'xAI Grok',
    description: 'Model penalaran cepat & cerdas dari xAI',
    defaultModel: 'grok-2-mini',
    availableModels: [
      { id: 'grok-2-mini', name: 'Grok 2 Mini' },
      { id: 'grok-2', name: 'Grok 2' },
    ],
    keyUrl: 'https://console.x.ai/',
    placeholder: 'xai-...',
  },
};

const STORAGE_KEYS = {
  PROVIDER: 'chat_active_provider',
  KEYS: 'chat_api_keys',
  MODELS: 'chat_selected_models',
};

export const getStoredKeys = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.KEYS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const setStoredKey = (providerId, key) => {
  try {
    const keys = getStoredKeys();
    keys[providerId] = key.trim();
    localStorage.setItem(STORAGE_KEYS.KEYS, JSON.stringify(keys));
  } catch (e) {
    console.warn('Failed to save API key:', e);
  }
};

export const getStoredProvider = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.PROVIDER) || 'gemini';
  } catch (e) {
    return 'gemini';
  }
};

export const setStoredProvider = (providerId) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROVIDER, providerId);
  } catch (e) {
    console.warn('Failed to save provider:', e);
  }
};

export const getStoredModel = (providerId) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MODELS);
    const models = raw ? JSON.parse(raw) : {};
    return models[providerId] || AI_PROVIDERS[providerId]?.defaultModel || 'gemini-flash-lite-latest';
  } catch (e) {
    return AI_PROVIDERS[providerId]?.defaultModel || 'gemini-flash-lite-latest';
  }
};

export const setStoredModel = (providerId, modelId) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MODELS);
    const models = raw ? JSON.parse(raw) : {};
    models[providerId] = modelId;
    localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(models));
  } catch (e) {
    console.warn('Failed to save model:', e);
  }
};

export const getSystemPrompt = (materialContext) => {
  let prompt = `Kamu adalah asisten belajar cerdas TrifectaStudy untuk siswa SMA yang sedang belajar dan mempersiapkan Penilaian Sumatif Tengah Semester (PSTS) SMAITUQB.
Kamu menguasai materi pelajaran:
- IPA: Kimia, Matematika, Biologi, Fisika
- IPS: Sosiologi, Geografi, Ekonomi, Sejarah
- Basic: Bahasa Indonesia, Bahasa Inggris, Bahasa Arab, Pendidikan Agama Islam

Instruksi Menjawab:
1. Berikan penjelasan yang ramah, terstruktur, ringkas, mudah dipahami, dan akurat secara konsep ilmiah/akademik.
2. Gunakan format Markdown (bold, list, headings).
3. Jika menuliskan rumus matematika, kimia, atau fisika, gunakan notasi LaTeX seperti $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$ atau rumus kimia.
4. Berikan contoh konkret atau analogi sehari-hari jika membantu mempermudah pemahaman.
5. Dorong siswa untuk bertanya lebih lanjut jika ada yang belum dipahami.`;

  if (materialContext) {
    prompt += `\n\n[KONTEKS MATERI SAAT INI]:
- Judul Materi: ${materialContext.title || '-'}
- Mata Pelajaran: ${materialContext.subject || '-'} (${materialContext.category?.toUpperCase() || '-'})
- Ringkasan: ${materialContext.excerpt || '-'}
Siswa sedang membaca materi ini di layar. Prioritaskan memberikan jawaban yang relevan dengan materi ini bila siswa bertanya tentangnya.`;
  }

  return prompt;
};

// Call Google Gemini API using @google/genai SDK with graceful fallback
async function callGemini({ apiKey, model, messages, systemInstruction, onChunk }) {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const formattedContents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const responseStream = await ai.models.generateContentStream({
      model: model || 'gemini-flash-lite-latest',
      contents: formattedContents,
      config: {
        systemInstruction,
      },
    });

    let fullText = '';
    for await (const chunk of responseStream) {
      const text = chunk.text || '';
      fullText += text;
      if (onChunk) onChunk(fullText);
    }
    return fullText;
  } catch (sdkError) {
    console.warn('@google/genai SDK call failed, falling back to direct REST API:', sdkError);

    // REST fallback
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-flash-lite-latest'}:generateContent?key=${apiKey}`;
    const payload = {
      contents: messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Gemini API error (${res.status})`);
    }

    const data = await res.json();
    const resultText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Maaf, tidak ada respon yang diterima dari Gemini.';
    if (onChunk) onChunk(resultText);
    return resultText;
  }
}

// Call OpenAI-compatible endpoints (OpenRouter, OpenAI, Grok)
async function callOpenAICompatible({ endpoint, apiKey, model, messages, systemInstruction, headers = {}, onChunk }) {
  const fullMessages = [
    { role: 'system', content: systemInstruction },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...headers,
    },
    body: JSON.stringify({
      model,
      messages: fullMessages,
      stream: false,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `API error (${res.status}): ${res.statusText}`);
  }

  const data = await res.json();
  const resultText = data.choices?.[0]?.message?.content || 'Tidak ada respon yang diterima.';
  if (onChunk) onChunk(resultText);
  return resultText;
}

export const sendChatMessage = async ({
  messages,
  materialContext = null,
  provider = null,
  model = null,
  onChunk = null,
}) => {
  const activeProvider = provider || getStoredProvider();
  const keys = getStoredKeys();
  const apiKey = keys[activeProvider];

  if (!apiKey) {
    throw new Error(`API Key untuk ${AI_PROVIDERS[activeProvider]?.name || activeProvider} belum diisi. Silakan masukkan API Key terlebih dahulu.`);
  }

  const activeModel = model || getStoredModel(activeProvider);
  const systemInstruction = getSystemPrompt(materialContext);

  if (activeProvider === 'gemini') {
    return await callGemini({
      apiKey,
      model: activeModel,
      messages,
      systemInstruction,
      onChunk,
    });
  }

  if (activeProvider === 'openrouter') {
    return await callOpenAICompatible({
      endpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey,
      model: activeModel,
      messages,
      systemInstruction,
      headers: {
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://trifectastudy.local',
        'X-Title': 'TrifectaStudy',
      },
      onChunk,
    });
  }

  if (activeProvider === 'openai') {
    return await callOpenAICompatible({
      endpoint: 'https://api.openai.com/v1/chat/completions',
      apiKey,
      model: activeModel,
      messages,
      systemInstruction,
      onChunk,
    });
  }

  if (activeProvider === 'grok') {
    return await callOpenAICompatible({
      endpoint: 'https://api.x.ai/v1/chat/completions',
      apiKey,
      model: activeModel,
      messages,
      systemInstruction,
      onChunk,
    });
  }

  throw new Error(`Provider "${activeProvider}" tidak didukung.`);
};
