
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Home,
  ChevronRight,
  ArrowRight,
  LoaderCircle,
  AlertCircle,
  Volume2,
  Mic,
  MicOff,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const TEXT = {
  en: {
    breadcrumb: "Home",
    title: "Check Your Eligibility",
    subtitle: "Answer a few questions to discover government schemes you may qualify for.",
    step: "Eligibility Questions",
    instructions: "Please answer the following questions as accurately as possible.",
    loading: "Loading questions...",
    noQuestions: "No active questions are currently available.",
    choose: "Enter your answer",
    notSure: "Not sure",
    previous: "Previous",
    submit: "Check My Eligibility",
    submitting: "Checking...",
    error: "Unable to load questions. Please check that the backend is running.",
    submitError: "Unable to check eligibility. Please try again.",
    voice: "Read question",
    mic: "Answer using voice",
    voiceUnsupported: "Voice input is not supported in this browser. Please use Google Chrome.",
    speechError: "Could not recognize your voice. Please try again.",
    noMatch: "Your spoken answer did not match an available option. Please try again or select manually.",
    missing: "Please answer all required questions.",
    privacy: "Your answers are used for this assessment and are not saved to a permanent profile.",
    questions: "questions",
  },
  hi: {
    breadcrumb: "होम",
    title: "अपनी पात्रता जाँचें",
    subtitle: "सरकारी योजनाओं की पात्रता जानने के लिए कुछ सवालों के जवाब दें।",
    step: "पात्रता संबंधी प्रश्न",
    instructions: "कृपया सभी प्रश्नों के सही उत्तर दें।",
    loading: "प्रश्न लोड हो रहे हैं...",
    noQuestions: "अभी कोई सक्रिय प्रश्न उपलब्ध नहीं हैं।",
    choose: "अपना उत्तर लिखें",
    notSure: "पता नहीं",
    previous: "पिछला",
    submit: "मेरी पात्रता जाँचें",
    submitting: "जाँच हो रही है...",
    error: "प्रश्न लोड नहीं हो सके। कृपया बैकएंड चालू होने की जाँच करें।",
    submitError: "पात्रता की जाँच नहीं हो सकी। कृपया फिर प्रयास करें।",
    voice: "प्रश्न सुनें",
    mic: "बोलकर उत्तर दें",
    voiceUnsupported: "इस ब्राउज़र में आवाज़ से उत्तर देने की सुविधा उपलब्ध नहीं है। कृपया Google Chrome का उपयोग करें।",
    speechError: "आपकी आवाज़ समझ नहीं आई। कृपया दोबारा प्रयास करें।",
    noMatch: "आपका बोला हुआ उत्तर उपलब्ध विकल्पों से मेल नहीं खाता। दोबारा बोलें या स्वयं विकल्प चुनें।",
    missing: "कृपया सभी अनिवार्य प्रश्नों के उत्तर दें।",
    privacy: "आपके उत्तर केवल इस जाँच के लिए उपयोग किए जाते हैं और स्थायी प्रोफ़ाइल में सेव नहीं होते।",
    questions: "प्रश्न",
  },
};

function getOptionValue(option) {
  if (typeof option === "string" || typeof option === "number") {
    return String(option);
  }

  if (option && typeof option === "object") {
    return String(
      option.value ?? option.id ?? option.label_en ?? option.label ?? ""
    );
  }

  return "";
}

function getOptionLabel(option, language) {
  if (typeof option === "string" || typeof option === "number") {
    return String(option);
  }

  if (option && typeof option === "object") {
    return (
      option[`label_${language}`] ??
      option[`name_${language}`] ??
      option.label ??
      option.value ??
      option.id ??
      ""
    );
  }

  return "";
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[.,!?।]/g, "")
    .trim();
}

export default function Eligibility() {
  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};

  const language = outletContext.language === "hi" ? "hi" : "en";
  const t = TEXT[language];

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [listeningQuestion, setListeningQuestion] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/eligibility/questions?language=${language}`
        );

        if (!response.ok) {
          throw new Error("Question request failed");
        }

        const data = await response.json();

        if (!cancelled) {
          setQuestions(data.questions || []);
        }
      } catch {
        if (!cancelled) {
          setError(t.error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, [language]);

  function updateAnswer(questionId, value) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  }

  function readQuestion(question) {
    if (!("speechSynthesis" in window)) {
      setVoiceError(t.voiceUnsupported);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      [question.label, question.help_text].filter(Boolean).join(". ")
    );

    utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.9;

    window.speechSynthesis.speak(utterance);
  }

  function startVoiceAnswer(question) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(t.voiceUnsupported);
      return;
    }

    setVoiceError("");

    const recognition = new SpeechRecognition();

    recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    setListeningQuestion(question.id);

    recognition.onresult = (event) => {
      const alternatives = Array.from(event.results[0]).map(
        (result) => result.transcript
      );

      const options = Array.isArray(question.options)
        ? question.options
        : [];

      if (options.length > 0) {
        let matchedOption = null;

        for (const transcript of alternatives) {
          const spoken = normalizeText(transcript);

          matchedOption = options.find((option) => {
            const value = normalizeText(getOptionValue(option));
            const label = normalizeText(getOptionLabel(option, language));

            return (
              spoken === value ||
              spoken === label ||
              (label.length > 2 && spoken.includes(label)) ||
              (spoken.length > 2 && label.includes(spoken))
            );
          });

          if (matchedOption) break;
        }

        if (matchedOption) {
          updateAnswer(
            question.id,
            getOptionValue(matchedOption)
          );
        } else {
          setVoiceError(t.noMatch);
        }
      } else {
        const transcript = alternatives[0] || "";

        if (question.type === "number") {
          const number = transcript.match(/[\d.]+/);

          if (number) {
            updateAnswer(question.id, number[0]);
          } else {
            setVoiceError(t.noMatch);
          }
        } else {
          updateAnswer(question.id, transcript);
        }
      }
    };

    recognition.onerror = () => {
      setVoiceError(t.speechError);
      setListeningQuestion(null);
    };

    recognition.onend = () => {
      setListeningQuestion(null);
    };

    try {
      recognition.start();
    } catch {
      setListeningQuestion(null);
      setVoiceError(t.speechError);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const unanswered = questions.filter(
      (question) =>
        question.required &&
        (answers[question.id] === undefined ||
          answers[question.id] === null ||
          answers[question.id] === "")
    );

    if (unanswered.length > 0) {
      setError(t.missing);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/eligibility/check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scheme_id: null,
            answers,
            language,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Eligibility request failed");
      }

      const result = await response.json();

      sessionStorage.setItem(
        "janSahayakEligibilityResult",
        JSON.stringify(result)
      );

      navigate("/results", {
        state: {
          eligibilityResult: result,
          language,
        },
      });
    } catch {
      setError(t.submitError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Home size={16} />
        <span>{t.breadcrumb}</span>
        <ChevronRight size={16} />
        <span className="font-medium text-slate-900">
          {t.title}
        </span>
      </div>

      <div className="mb-7">
        <h1 className="text-3xl font-bold text-slate-950">
          {t.title}
        </h1>
        <p className="mt-2 text-slate-600">{t.subtitle}</p>
      </div>

      <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
        <h2 className="font-semibold text-emerald-900">
          {t.step}
        </h2>
        <p className="mt-1 text-sm text-emerald-800">
          {t.instructions}
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-xl border bg-white p-12 text-slate-600">
          <LoaderCircle className="animate-spin" size={22} />
          {t.loading}
        </div>
      )}

      {!loading && error && questions.length === 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <AlertCircle size={21} />
          {error}
        </div>
      )}

      {!loading && !error && questions.length === 0 && (
        <div className="rounded-xl border bg-white p-8 text-center text-slate-600">
          {t.noQuestions}
        </div>
      )}

      {!loading && questions.length > 0 && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="mb-7 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">
              {t.instructions}
            </h2>
            <span className="whitespace-nowrap text-sm text-slate-500">
              {questions.length} {t.questions}
            </span>
          </div>

          <div className="space-y-8">
            {questions.map((question, index) => {
              const options = Array.isArray(question.options)
                ? question.options
                : [];

              const isListening =
                listeningQuestion === question.id;

              return (
                <section
                  key={question.id}
                  className="border-b border-slate-100 pb-7 last:border-0"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold leading-6 text-slate-900">
                        {index + 1}. {question.label}
                        {question.required && (
                          <span className="ml-1 text-red-500">*</span>
                        )}
                      </h3>

                      {question.help_text && (
                        <p className="mt-1 text-sm text-slate-500">
                          {question.help_text}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => readQuestion(question)}
                        title={t.voice}
                        className="rounded-lg border border-slate-200 p-2 text-emerald-800 hover:bg-emerald-50"
                      >
                        <Volume2 size={19} />
                      </button>

                      <button
                        type="button"
                        onClick={() => startVoiceAnswer(question)}
                        disabled={isListening}
                        title={t.mic}
                        className={`rounded-lg border p-2 ${
                          isListening
                            ? "border-red-300 bg-red-50 text-red-700"
                            : "border-slate-200 text-emerald-800 hover:bg-emerald-50"
                        }`}
                      >
                        {isListening ? (
                          <MicOff size={19} />
                        ) : (
                          <Mic size={19} />
                        )}
                      </button>
                    </div>
                  </div>

                  {options.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {options.map((option, optionIndex) => {
                        const value = getOptionValue(option);
                        const label = getOptionLabel(option, language);

                        const selected =
                          String(answers[question.id] ?? "") === value;

                        return (
                          <label
                            key={`${question.id}-${optionIndex}`}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm transition ${
                              selected
                                ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                                : "border-slate-200 text-slate-700 hover:border-emerald-500"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={value}
                              checked={selected}
                              onChange={() =>
                                updateAnswer(question.id, value)
                              }
                              className="h-4 w-4 accent-emerald-800"
                            />
                            {label}
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <input
                      type={question.type === "number" ? "number" : "text"}
                      value={answers[question.id] ?? ""}
                      onChange={(event) =>
                        updateAnswer(question.id, event.target.value)
                      }
                      placeholder={t.choose}
                      required={question.required}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                    />
                  )}

                  {!question.required && (
                    <button
                      type="button"
                      onClick={() =>
                        updateAnswer(question.id, "not_sure")
                      }
                      className={`mt-3 rounded-lg border px-4 py-2 text-sm ${
                        answers[question.id] === "not_sure"
                          ? "border-amber-500 bg-amber-50 text-amber-800"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      {t.notSure}
                    </button>
                  )}
                </section>
              );
            })}
          </div>

          {voiceError && (
            <div className="mt-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              {voiceError}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <p className="mt-6 text-xs leading-5 text-slate-500">
            {t.privacy}
          </p>

          <div className="mt-7 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              {t.previous}
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-7 py-3 font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? t.submitting : t.submit}
              {!submitting && <ArrowRight size={18} />}
              {submitting && (
                <LoaderCircle size={18} className="animate-spin" />
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
