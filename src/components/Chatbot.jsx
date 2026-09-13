import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, X, Settings, Send, Bot, User,
  Key, ExternalLink, RefreshCw, Trash2, Check,
  Eye, EyeOff, BookOpen, AlertCircle, Loader2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import {
  AI_PROVIDERS,
  getStoredKeys,
  setStoredKey,
  getStoredProvider,
  setStoredProvider,
  getStoredModel,
  setStoredModel,
  sendChatMessage,
} from '../services/aiService';

export default function Chatbot({ isOpen, onClose, materialContext = null }) {
  const [provider, setProvider] = useState(() => getStoredProvider());
  const [model, setModel] = useState(() => getStoredModel(getStoredProvider()));
  const [keys, setKeys] = useState(() => getStoredKeys());
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [keySavedNotification, setKeySavedNotification] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: materialContext
        ? `Halo! Saya asisten AI TrifectaStudy. Saya siap membantu kamu memahami materi **${materialContext.title}** (${materialContext.subject}). Mau tanya tentang rumus, konsep, atau latihan soal?`
        : 'Halo! Saya asisten AI belajar TrifectaStudy. Ada materi pelajaran atau soal yang ingin kamu diskusikan hari ini?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check if current provider has a key
  const hasKeyForCurrentProvider = !!keys[provider];

  useEffect(() => {
    if (isOpen) {
      const currentKeys = getStoredKeys();
      const currentProv = getStoredProvider();
      setKeys(currentKeys);
      setProvider(currentProv);
      setModel(getStoredModel(currentProv));
      setInputKey(currentKeys[currentProv] || '');

      if (!currentKeys[currentProv]) {
        setIsConfiguring(true);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleProviderSelect = (provId) => {
    setProvider(provId);
    setStoredProvider(provId);
    const m = getStoredModel(provId);
    setModel(m);
    setInputKey(keys[provId] || '');
    setErrorMsg(null);
  };

  const handleModelSelect = (mId) => {
    setModel(mId);
    setStoredModel(provider, mId);
  };

  const handleSaveKey = (e) => {
    e?.preventDefault();
    if (!inputKey.trim()) return;
    setStoredKey(provider, inputKey.trim());
    const updatedKeys = getStoredKeys();
    setKeys(updatedKeys);
    setKeySavedNotification(true);
    setTimeout(() => setKeySavedNotification(false), 2000);
    setIsConfiguring(false);
    setErrorMsg(null);
  };

  const handleSendMessage = async (customText = null) => {
    const text = (customText || inputValue).trim();
    if (!text || isLoading) return;

    if (!keys[provider]) {
      setIsConfiguring(true);
      return;
    }

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    if (!customText) setInputValue('');
    setIsLoading(true);
    setErrorMsg(null);

    // Placeholder message for streaming response
    const assistantIndex = newMessages.length;
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      await sendChatMessage({
        messages: newMessages,
        materialContext,
        provider,
        model,
        onChunk: (streamedText) => {
          setMessages((prev) => {
            const copy = [...prev];
            copy[assistantIndex] = { role: 'assistant', content: streamedText };
            return copy;
          });
        },
      });
    } catch (err) {
      console.error('Chat error:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses jawaban.');
      setMessages((prev) => {
        const copy = [...prev];
        copy[assistantIndex] = {
          role: 'assistant',
          content: `⚠️ Maaf, terjadi kesalahan: ${err.message || 'Koneksi gagal'}. Periksa API Key atau pengaturan provider.`,
        };
        return copy;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content: materialContext
          ? `Riwayat obrolan dibersihkan. Ada yang ingin kamu tanyakan tentang **${materialContext.title}**?`
          : 'Riwayat obrolan dibersihkan. Ada materi apa yang ingin kita bahas?',
      },
    ]);
  };

  const quickPrompts = materialContext
    ? [
        `Rangkum poin terpenting materi ${materialContext.title} dalam 3 butir ringkas`,
        `Buatkan 2 contoh soal latihan dan pembahasannya tentang ${materialContext.title}`,
        `Jelaskan rumus atau konsep inti materi ini dengan analogi sederhana`,
      ]
    : [
        'Jelaskan konsep stoikiometri dan mol kimia dengan mudah',
        'Bagaimana cara cepat menghafal rumus trigonometri dasar?',
        'Apa saja faktor penyebab perubahan sosial dalam sosiologi?',
      ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl h-[86vh] max-h-[720px] flex flex-col rounded-2xl border shadow-2xl overflow-hidden"
          style={{
            background: 'var(--app-canvas, #ffffff)',
            borderColor: 'var(--app-hairline, #e6e6e6)',
            color: 'var(--app-text, #1a1a1a)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b flex-shrink-0"
            style={{
              borderColor: 'var(--app-hairline, #e6e6e6)',
              background: 'var(--app-surface, #fbfbfb)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                style={{
                  background: 'linear-gradient(135deg, #0075de 0%, #2a9d99 100%)',
                }}
              >
                <Sparkles size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight">Tanya AI</h3>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{
                      background: 'rgba(0,117,222,0.1)',
                      color: '#0075de',
                    }}
                  >
                    {AI_PROVIDERS[provider]?.name || provider}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 font-mono">
                  {model}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsConfiguring(!isConfiguring)}
                className="p-2 rounded-lg text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                style={{
                  background: isConfiguring ? 'rgba(0,117,222,0.1)' : 'transparent',
                  color: isConfiguring ? '#0075de' : undefined,
                }}
                title="Pengaturan API & Model"
              >
                <Settings size={16} />
              </button>

              <button
                onClick={handleClearHistory}
                className="p-2 rounded-lg text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Bersihkan obrolan"
              >
                <Trash2 size={16} />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                title="Tutup"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          {materialContext && (
            <div
              className="px-4 py-2 text-xs flex items-center gap-2 border-b flex-shrink-0"
              style={{
                borderColor: 'var(--app-hairline, #e6e6e6)',
                background: 'rgba(42,157,153,0.06)',
                color: 'var(--app-text-muted, #2a9d99)',
              }}
            >
              <BookOpen size={13} className="text-[#2a9d99] flex-shrink-0" />
              <span className="truncate">
                Konteks Aktif: <strong className="font-semibold text-stone-800">{materialContext.title}</strong> ({materialContext.subject})
              </span>
            </div>
          )}

          {/* Configuration View */}
          {isConfiguring ? (
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-5">
              <div>
                <h4 className="text-sm font-bold mb-1">Pengaturan Model & API Key</h4>
                <p className="text-xs text-stone-500">
                  Pilih provider AI dan masukkan API Key Anda. Kunci disimpan secara privat di browser (localStorage).
                </p>
              </div>

              {/* Provider Selection */}
              <div>
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2 block">
                  Pilih Provider
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.values(AI_PROVIDERS).map((p) => {
                    const isSelected = provider === p.id;
                    const hasKey = !!keys[p.id];
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleProviderSelect(p.id)}
                        className="p-3 text-left rounded-xl border transition-all cursor-pointer relative"
                        style={{
                          borderColor: isSelected ? '#0075de' : 'var(--app-hairline, #e6e6e6)',
                          background: isSelected ? 'rgba(0,117,222,0.06)' : 'var(--app-surface, #fbfbfb)',
                        }}
                      >
                        <div className="font-bold text-xs mb-1">{p.name}</div>
                        <div className="text-[10px] text-stone-400">
                          {hasKey ? (
                            <span className="text-emerald-600 font-medium flex items-center gap-1">
                              <Check size={10} /> Key Tersimpan
                            </span>
                          ) : (
                            <span className="text-amber-600">Belum ada key</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2 block">
                  Model {AI_PROVIDERS[provider]?.name}
                </label>
                <select
                  value={model}
                  onChange={(e) => handleModelSelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border outline-none font-medium"
                  style={{
                    borderColor: 'var(--app-hairline, #e6e6e6)',
                    background: 'var(--app-canvas, #ffffff)',
                    color: 'var(--app-text, #1a1a1a)',
                  }}
                >
                  {AI_PROVIDERS[provider]?.availableModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* API Key Form */}
              <form onSubmit={handleSaveKey} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    API Key untuk {AI_PROVIDERS[provider]?.name}
                  </label>
                  <a
                    href={AI_PROVIDERS[provider]?.keyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0075de] hover:underline"
                  >
                    <span>Dapatkan API Key</span>
                    <ExternalLink size={10} />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder={AI_PROVIDERS[provider]?.placeholder || 'Masukkan API Key...'}
                    className="w-full pl-9 pr-10 py-2.5 text-xs rounded-lg border font-mono outline-none focus:border-[#0075de]"
                    style={{
                      borderColor: 'var(--app-hairline, #e6e6e6)',
                      background: 'var(--app-canvas, #ffffff)',
                      color: 'var(--app-text, #1a1a1a)',
                    }}
                  />
                  <Key
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-stone-400">
                    {keySavedNotification && (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <Check size={12} /> API Key berhasil disimpan!
                      </span>
                    )}
                  </span>
                  <div className="flex gap-2">
                    {hasKeyForCurrentProvider && (
                      <button
                        type="button"
                        onClick={() => setIsConfiguring(false)}
                        className="px-4 py-2 text-xs font-semibold rounded-lg border cursor-pointer"
                        style={{
                          borderColor: 'var(--app-hairline, #e6e6e6)',
                          background: 'var(--app-surface, #f6f5f4)',
                        }}
                      >
                        Batal
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!inputKey.trim()}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0075de] text-white hover:bg-[#005bab] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Simpan & Lanjutkan
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            /* Chat View */
            <>
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
                {/* Notice if API key missing */}
                {!hasKeyForCurrentProvider && (
                  <div
                    className="p-3 rounded-xl border flex items-center justify-between gap-3 text-xs"
                    style={{
                      borderColor: 'rgba(221,91,0,0.2)',
                      background: 'rgba(221,91,0,0.06)',
                      color: '#dd5b00',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle size={15} className="flex-shrink-0" />
                      <span>
                        API Key untuk <strong>{AI_PROVIDERS[provider]?.name}</strong> belum diisi.
                      </span>
                    </div>
                    <button
                      onClick={() => setIsConfiguring(true)}
                      className="px-3 py-1 rounded-md text-xs font-bold bg-[#dd5b00] text-white hover:bg-[#b84d00] cursor-pointer flex-shrink-0"
                    >
                      Isi Sekarang
                    </button>
                  </div>
                )}

                {/* Messages */}
                {messages.map((m, idx) => {
                  const isUser = m.role === 'user';
                  return (
                    <div
                      key={idx}
                      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-0.5"
                          style={{
                            background: 'linear-gradient(135deg, #0075de 0%, #2a9d99 100%)',
                          }}
                        >
                          <Bot size={14} />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                          isUser
                            ? 'bg-[#0075de] text-white rounded-tr-xs'
                            : 'rounded-tl-xs border'
                        }`}
                        style={
                          isUser
                            ? {}
                            : {
                                background: 'var(--app-surface, #f9f9f9)',
                                borderColor: 'var(--app-hairline, #e6e6e6)',
                                color: 'var(--app-text, #1a1a1a)',
                              }
                        }
                      >
                        {isUser ? (
                          <div className="whitespace-pre-wrap">{m.content}</div>
                        ) : (
                          <div className="prose prose-sm dark:prose-invert max-w-none text-xs space-y-2">
                            {m.content ? (
                              <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                              >
                                {m.content}
                              </ReactMarkdown>
                            ) : (
                              <div className="flex items-center gap-2 text-stone-400 py-1">
                                <Loader2 size={13} className="animate-spin text-[#0075de]" />
                                <span>Sedang berpikir...</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border"
                          style={{
                            background: 'var(--app-surface, #f6f5f4)',
                            borderColor: 'var(--app-hairline, #e6e6e6)',
                            color: 'var(--app-text-secondary, #31302e)',
                          }}
                        >
                          <User size={14} />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Quick prompts if chat is short */}
                {messages.length <= 2 && !isLoading && (
                  <div className="pt-2">
                    <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                      Saran Pertanyaan Cepat:
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {quickPrompts.map((qp, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(qp)}
                          className="text-left px-3 py-2 text-xs rounded-xl border transition-all cursor-pointer hover:border-[#0075de] hover:bg-blue-50/40"
                          style={{
                            borderColor: 'var(--app-hairline, #e6e6e6)',
                            background: 'var(--app-canvas, #ffffff)',
                            color: 'var(--app-text-secondary, #31302e)',
                          }}
                        >
                          💡 {qp}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <div
                className="p-3 sm:p-4 border-t flex flex-col gap-2 flex-shrink-0"
                style={{
                  borderColor: 'var(--app-hairline, #e6e6e6)',
                  background: 'var(--app-surface, #fbfbfb)',
                }}
              >
                {errorMsg && (
                  <div className="text-[11px] text-red-500 font-medium px-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      materialContext
                        ? `Tanyakan sesuatu tentang ${materialContext.title}...`
                        : 'Tanyakan materi belajar atau soal...'
                    }
                    disabled={isLoading}
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border outline-none font-sans transition-all focus:border-[#0075de]"
                    style={{
                      borderColor: 'var(--app-hairline, #e6e6e6)',
                      background: 'var(--app-canvas, #ffffff)',
                      color: 'var(--app-text, #1a1a1a)',
                    }}
                  />

                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-[#0075de] hover:bg-[#005bab] transition-colors cursor-pointer disabled:opacity-40 flex-shrink-0"
                    title="Kirim pesan"
                  >
                    {isLoading ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Send size={15} />
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
