import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Bot, Send, User, ExternalLink, MessageCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Assistant() {
  const { language } = useOutletContext();
  const hindi = language === "hi";

  const text = {
    title: hindi ? "जनसहायक सहायक" : "JanSahayak Assistant",
    subtitle: hindi
      ? "सरकारी योजनाओं को सरल भाषा में समझें"
      : "Understand government schemes in simple language",
    intro: hindi
      ? "नमस्ते! मैं जनसहायक पर उपलब्ध पाँच सरकारी योजनाओं के बारे में जानकारी दे सकता हूँ। नीचे दिए गए सुझाव चुनें या अपना प्रश्न लिखें।"
      : "Hello! I can answer questions about the five government schemes available on JanSahayak. Choose a suggestion below or type your own question.",
    placeholder: hindi ? "अपना सवाल लिखें..." : "Ask about a government scheme...",
    send: hindi ? "भेजें" : "Send",
    thinking: hindi ? "जानकारी देख रहा हूँ..." : "Checking scheme information...",
    error: hindi ? "अभी उत्तर नहीं मिल सका। कृपया फिर प्रयास करें।" : "I couldn't get an answer. Please try again.",
    source: hindi ? "आधिकारिक स्रोत" : "Official sources",
    disclaimer: hindi
      ? "उत्तर जनसहायक में उपलब्ध रिकॉर्ड पर आधारित हैं। अंतिम और नवीनतम जानकारी के लिए आधिकारिक विभाग से पुष्टि करें।"
      : "Answers are based on records available in JanSahayak. Confirm current requirements with the official department.",
    suggestions: hindi
      ? [
          "सभी योजनाएँ दिखाएँ",
          "पीएम-किसान के क्या लाभ हैं?",
          "लाड़ली बहना के लिए कौन से दस्तावेज़ चाहिए?",
          "पीएम विश्वकर्मा की पात्रता समझाएँ",
        ]
      : [
          "List all schemes",
          "What are the benefits of PM-KISAN?",
          "Which documents are needed for Ladli Behna?",
          "Explain PM Vishwakarma eligibility",
        ],
  };

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function sendMessage(value = message) {
    const question = value.trim();
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
      if (!response.ok) throw new Error(data.detail || text.error);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: data.reply || text.error,
          sources: Array.isArray(data.sources) ? data.sources : [],
          suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: error.message || text.error, sources: [] },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-900">
            <Bot size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{text.title}</h1>
            <p className="mt-1 text-sm text-slate-600">{text.subtitle}</p>
          </div>
        </div>
      </div>

      <section className="flex min-h-[620px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 bg-emerald-900 px-5 py-4 text-white">
          <MessageCircle size={21} />
          <div>
            <h2 className="font-semibold">{text.title}</h2>
            <p className="text-xs text-emerald-100">
              {hindi ? "उपलब्ध योजना रिकॉर्ड पर आधारित" : "Based on available scheme records"}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50 p-5">
          {messages.length === 0 && (
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-emerald-100 p-2 text-emerald-900">
                <Bot size={20} />
              </div>
              <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm">
                {text.intro}
              </div>
            </div>
          )}

          {messages.map((item, index) => (
            <div
              key={`${item.role}-${index}`}
              className={`flex items-start gap-3 ${item.role === "user" ? "justify-end" : ""}`}
            >
              {item.role === "assistant" && (
                <div className="rounded-full bg-emerald-100 p-2 text-emerald-900">
                  <Bot size={20} />
                </div>
              )}
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                  item.role === "user"
                    ? "rounded-tr-sm bg-emerald-800 text-white"
                    : "rounded-tl-sm whitespace-pre-line bg-white text-slate-700"
                }`}
              >
                {item.text}

                {item.sources?.length > 0 && (
                  <div className="mt-3 border-t border-slate-200 pt-3">
                    <p className="mb-2 text-xs font-semibold text-slate-600">{text.source}</p>
                    <div className="space-y-2">
                      {item.sources.map((source, sourceIndex) => (
                        <a
                          key={`${source.url}-${sourceIndex}`}
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 break-all text-xs text-emerald-800 underline"
                        >
                          {source.title || source.url}
                          <ExternalLink size={13} className="shrink-0" />
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
                        className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs text-emerald-800 hover:bg-emerald-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {item.role === "user" && (
                <div className="rounded-full bg-slate-200 p-2 text-slate-700">
                  <User size={20} />
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Bot size={18} />
              {text.thinking}
            </div>
          )}
        </div>

        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-5 py-4">
            {text.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendMessage(suggestion)}
                className="rounded-full border border-emerald-200 px-3 py-2 text-xs text-emerald-800 transition hover:bg-emerald-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-3 border-t border-slate-200 bg-white p-4"
        >
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={text.placeholder}
            aria-label={text.placeholder}
            maxLength={1000}
            className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          />
          <button
            type="submit"
            disabled={!message.trim() || isSending}
            className="flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={17} />
            <span>{text.send}</span>
          </button>
        </form>
      </section>

      <p className="mt-3 text-center text-xs leading-5 text-slate-500">{text.disclaimer}</p>
    </div>
  );
}
