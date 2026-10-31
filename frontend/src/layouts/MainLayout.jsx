import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Bot, MessageCircle, Send, X, User, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function MainLayout() {
  const [language, setLanguage] = useState("en");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const hindi = language === "hi";

  const copy = {
    title: hindi ? "जनसहायक सहायक" : "JanSahayak Assistant",
    subtitle: hindi ? "सरकारी योजनाओं की जानकारी" : "Government scheme guidance",
    welcome: hindi
      ? "नमस्ते! मैं जनसहायक की पाँच योजनाओं के लाभ, पात्रता, दस्तावेज़ और आधिकारिक लिंक समझाने में मदद कर सकता हूँ।"
      : "Hello! I can help explain the benefits, eligibility, documents, and official links for the five schemes available on JanSahayak.",
    placeholder: hindi ? "अपना सवाल लिखें..." : "Type your question...",
    send: hindi ? "भेजें" : "Send",
    thinking: hindi ? "जानकारी देख रहा हूँ..." : "Checking information...",
    error: hindi
      ? "अभी उत्तर नहीं मिल सका। कृपया फिर से प्रयास करें।"
      : "I couldn't get an answer right now. Please try again.",
    source: hindi ? "आधिकारिक स्रोत" : "Official sources",
    open: hindi ? "खोलें" : "Open",
    disclaimer: hindi
      ? "यह सहायक उपलब्ध रिकॉर्ड के आधार पर जानकारी देता है। अंतिम पुष्टि आधिकारिक विभाग से करें।"
      : "This assistant uses available records. Confirm current requirements with the official department.",
  };

  async function sendMessage(text = message) {
    const question = text.trim();
    if (!question || isSending) return;

    setMessages((current) => [...current, { role: "user", text: question }]);
    setMessage("");
    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, language }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || copy.error);
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: data.reply || copy.error,
          sources: Array.isArray(data.sources) ? data.sources : [],
          suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: error.message || copy.error, sources: [] },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleLanguageChange(nextLanguage) {
    setLanguage(nextLanguage);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar language={language} onLanguageChange={handleLanguageChange} />

      <main className="mx-auto max-w-7xl px-5 py-8">
        <Outlet context={{ language }} />
      </main>

      {isChatOpen && (
        <section
          aria-label={copy.title}
          className="fixed bottom-24 right-5 z-[60] flex h-[min(620px,calc(100vh-130px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between bg-emerald-900 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/15 p-2">
                <Bot size={22} />
              </div>
              <div>
                <h2 className="font-semibold">{copy.title}</h2>
                <p className="text-xs text-emerald-100">{copy.subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              aria-label={hindi ? "चैट बंद करें" : "Close chat"}
              className="rounded-lg p-2 transition hover:bg-white/15"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
            {messages.length === 0 && (
              <div className="flex items-start gap-2">
                <div className="rounded-full bg-emerald-100 p-2 text-emerald-900">
                  <Bot size={18} />
                </div>
                <div className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm">
                  {copy.welcome}
                </div>
              </div>
            )}

            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`flex items-start gap-2 ${
                  item.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {item.role === "assistant" && (
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-900">
                    <Bot size={18} />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                    item.role === "user"
                      ? "rounded-tr-sm bg-emerald-800 text-white"
                      : "rounded-tl-sm whitespace-pre-line bg-white text-slate-700"
                  }`}
                >
                  {item.text}

                  {item.sources?.length > 0 && (
                    <div className="mt-3 border-t border-slate-200 pt-2">
                      <p className="mb-2 text-xs font-semibold text-slate-600">
                        {copy.source}
                      </p>
                      <div className="space-y-2">
                        {item.sources.map((source, sourceIndex) => (
                          <a
                            key={`${source.url}-${sourceIndex}`}
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 break-all text-xs text-emerald-800 underline"
                          >
                            {source.title || copy.open}
                            <ExternalLink size={12} className="shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.suggestions?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => sendMessage(suggestion)}
                          className="rounded-full border border-emerald-200 px-3 py-1 text-xs text-emerald-800 transition hover:bg-emerald-50"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {item.role === "user" && (
                  <div className="rounded-full bg-slate-200 p-2 text-slate-700">
                    <User size={18} />
                  </div>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Bot size={18} />
                {copy.thinking}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={copy.placeholder}
                aria-label={copy.placeholder}
                maxLength={1000}
                className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              />
              <button
                type="submit"
                disabled={!message.trim() || isSending}
                aria-label={copy.send}
                className="rounded-xl bg-emerald-800 p-3 text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </form>
            <p className="mt-2 text-center text-[10px] leading-4 text-slate-500">
              {copy.disclaimer}
            </p>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsChatOpen((open) => !open)}
        aria-label={isChatOpen ? (hindi ? "चैट बंद करें" : "Close assistant") : (hindi ? "सहायक से पूछें" : "Ask JanSahayak")}
        className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-emerald-900 px-5 py-4 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-1 hover:bg-emerald-800"
      >
        {isChatOpen ? <X size={20} /> : <MessageCircle size={20} />}
        <span>{hindi ? "सहायक से पूछें" : "Ask Assistant"}</span>
      </button>
    </div>
  );
}
