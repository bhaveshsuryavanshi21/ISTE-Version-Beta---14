
import { useEffect, useState } from "react";
import { Link, useLocation, useOutletContext, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  FileText,
  Printer,
  ArrowLeft,
  LoaderCircle,
  ShieldCheck,
  Volume2,
  Square,
  Trash2,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const TEXT = {
  en: {
    title: "Your Eligibility Results",
    subtitle: "Here is the preliminary assessment based on your answers.",
    loading: "Preparing your results...",
    error: "Unable to load your results.",
    noResults: "No assessment results are available. Please check your eligibility first.",
    eligible: "Potentially Eligible",
    verification: "Needs Verification",
    notEligible: "Conditions Not Met",
    eligibleDesc: "Your answers match the configured screening conditions.",
    verificationDesc: "Some details need confirmation before eligibility can be assessed.",
    notEligibleDesc: "At least one configured condition appears not to be satisfied.",
    conditions: "Eligibility Conditions",
    missing: "Information to Verify",
    documents: "Document Checklist",
    sources: "Official Sources",
    lastChecked: "Last checked",
    notAvailable: "Date not available",
    mandatory: "Mandatory",
    optional: "Optional",
    print: "Print Checklist",
    back: "Check Again",
    disclaimer: "This is a preliminary screening result, not official government approval or rejection. Final eligibility is decided by the relevant government authority.",
    noDocuments: "No document checklist is available for this scheme.",
    noSources: "No official source has been configured for this scheme.",
    passed: "Condition matched",
    notMet: "Condition not matched",
    pending: "Needs verification",
    listen: "Listen to result",
    stop: "Stop speaking",
    clear: "Clear My Data",
    clearConfirm: "Are you sure? This will clear your assessment data from this browser session.",
    cleared: "Your assessment data has been cleared.",
  },
  hi: {
    title: "आपकी पात्रता के परिणाम",
    subtitle: "आपके उत्तरों के आधार पर प्रारंभिक जाँच का परिणाम।",
    loading: "परिणाम तैयार हो रहे हैं...",
    error: "परिणाम लोड नहीं हो सके।",
    noResults: "जाँच का कोई परिणाम उपलब्ध नहीं है। कृपया पहले पात्रता जाँचें।",
    eligible: "संभावित रूप से पात्र",
    verification: "पुष्टि आवश्यक",
    notEligible: "शर्तें पूरी नहीं हुईं",
    eligibleDesc: "आपके उत्तर उपलब्ध पात्रता शर्तों से मेल खाते हैं।",
    verificationDesc: "पात्रता का आकलन करने से पहले कुछ जानकारी की पुष्टि आवश्यक है।",
    notEligibleDesc: "उपलब्ध जानकारी के अनुसार कम से कम एक शर्त पूरी नहीं होती।",
    conditions: "पात्रता की शर्तें",
    missing: "पुष्टि के लिए जानकारी",
    documents: "दस्तावेज़ों की सूची",
    sources: "आधिकारिक स्रोत",
    lastChecked: "अंतिम जाँच",
    notAvailable: "तारीख उपलब्ध नहीं",
    mandatory: "अनिवार्य",
    optional: "वैकल्पिक",
    print: "दस्तावेज़ सूची प्रिंट करें",
    back: "दोबारा जाँचें",
    disclaimer: "यह केवल प्रारंभिक जाँच है, सरकारी स्वीकृति या अस्वीकृति नहीं। अंतिम पात्रता का निर्णय संबंधित सरकारी विभाग करेगा।",
    noDocuments: "इस योजना के लिए दस्तावेज़ों की सूची उपलब्ध नहीं है।",
    noSources: "इस योजना के लिए कोई आधिकारिक स्रोत उपलब्ध नहीं है।",
    passed: "शर्त पूरी हुई",
    notMet: "शर्त पूरी नहीं हुई",
    pending: "पुष्टि आवश्यक",
    listen: "परिणाम सुनें",
    stop: "आवाज़ रोकें",
    clear: "मेरा डेटा मिटाएँ",
    clearConfirm: "क्या आप निश्चित हैं? इससे इस ब्राउज़र सत्र का जाँच डेटा मिट जाएगा।",
    cleared: "आपका जाँच डेटा मिटा दिया गया है।",
  },
};

function getStatusText(status, t) {
  if (status === "potentially_eligible") return t.eligible;
  if (status === "not_eligible") return t.notEligible;
  return t.verification;
}

function getStatusDescription(status, t) {
  if (status === "potentially_eligible") return t.eligibleDesc;
  if (status === "not_eligible") return t.notEligibleDesc;
  return t.verificationDesc;
}

function StatusIcon({ status }) {
  if (status === "potentially_eligible") {
    return <CheckCircle2 className="text-emerald-700" size={24} />;
  }

  if (status === "not_eligible") {
    return <XCircle className="text-red-600" size={24} />;
  }

  return <AlertCircle className="text-amber-600" size={24} />;
}

function ConditionStatus({ outcome, t }) {
  const label =
    outcome === "passed"
      ? t.passed
      : outcome === "not_met"
        ? t.notMet
        : t.pending;

  const color =
    outcome === "passed"
      ? "bg-emerald-50 text-emerald-800"
      : outcome === "not_met"
        ? "bg-red-50 text-red-700"
        : "bg-amber-50 text-amber-800";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
      {label}
    </span>
  );
}

function speakResults(scheme, language) {
  if (!("speechSynthesis" in window)) {
    window.alert(
      language === "hi"
        ? "इस ब्राउज़र में आवाज़ की सुविधा उपलब्ध नहीं है।"
        : "Voice output is not supported in this browser."
    );
    return;
  }

  window.speechSynthesis.cancel();

  const statusText =
    language === "hi"
      ? scheme.status === "potentially_eligible"
        ? "संभावित रूप से पात्र"
        : scheme.status === "not_eligible"
          ? "शर्तें पूरी नहीं हुईं"
          : "पुष्टि आवश्यक"
      : scheme.status === "potentially_eligible"
        ? "Potentially eligible"
        : scheme.status === "not_eligible"
          ? "Conditions not met"
          : "Needs verification";

  const textToSpeak = [
    scheme.scheme_name,
    statusText,
    scheme.explanation,
    ...(scheme.missing_information || []),
  ]
    .filter(Boolean)
    .join(". ");

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
  utterance.rate = 0.9;

  window.speechSynthesis.speak(utterance);
}

function printChecklist(scheme, t) {
  const documents = scheme.documents || [];

  const escapeHtml = (value) =>
    String(value || "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]);

  const documentRows = documents.length
    ? documents.map((document) => `
        <li>
          <label>
            <input type="checkbox" />
            ${escapeHtml(document.name)}
            (${document.is_mandatory ? t.mandatory : t.optional})
            ${document.description ? `<br/><small>${escapeHtml(document.description)}</small>` : ""}
          </label>
        </li>
      `).join("")
    : `<li>${t.noDocuments}</li>`;

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>${escapeHtml(scheme.scheme_name)} - Checklist</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #1f2937; }
        h1 { color: #065f46; }
        li { margin: 16px 0; line-height: 1.5; }
        small { color: #64748b; }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(scheme.scheme_name)}</h1>
      <h2>${t.documents}</h2>
      <ul>${documentRows}</ul>
      <p>${t.disclaimer}</p>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    window.alert(
      "Please allow pop-ups to print the checklist. / चेकलिस्ट प्रिंट करने के लिए पॉप-अप की अनुमति दें।"
    );
    return;
  }

  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};

  const language =
    location.state?.language ||
    outletContext.language ||
    "en";

  const lang = language === "hi" ? "hi" : "en";
  const t = TEXT[lang];

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [speakingScheme, setSpeakingScheme] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadResults() {
      setLoading(true);
      setError("");

      try {
        let savedResult = location.state?.eligibilityResult;

        if (!savedResult) {
          const stored = sessionStorage.getItem(
            "janSahayakEligibilityResult"
          );

          savedResult = stored ? JSON.parse(stored) : null;
        }

        if (!savedResult || !Array.isArray(savedResult.results)) {
          if (!cancelled) setResults([]);
          return;
        }

        const detailedResults = await Promise.all(
          savedResult.results.map(async (result) => {
            try {
              const response = await fetch(
                `${API_URL}/api/schemes/${result.scheme_id}?language=${lang}`
              );

              if (!response.ok) {
                return { ...result, documents: [], sources: [] };
              }

              const details = await response.json();

              return {
                ...result,
                documents: details.documents || [],
                sources: details.sources || [],
              };
            } catch {
              return { ...result, documents: [], sources: [] };
            }
          })
        );

        if (!cancelled) {
          setResults(detailedResults);
        }
      } catch {
        if (!cancelled) setError(t.error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadResults();

    return () => {
      cancelled = true;
    };
  }, [location.state, lang]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function handleSpeak(scheme) {
    if (speakingScheme === scheme.scheme_id) {
      window.speechSynthesis.cancel();
      setSpeakingScheme(null);
      return;
    }

    speakResults(scheme, lang);

    if ("speechSynthesis" in window) {
      setSpeakingScheme(scheme.scheme_id);
      window.speechSynthesis.onend = () => setSpeakingScheme(null);
    }
  }

  function clearData() {
    if (!window.confirm(t.clearConfirm)) return;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    sessionStorage.removeItem("janSahayakEligibilityResult");
    sessionStorage.removeItem("janSahayakEligibility");

    setResults([]);
    setSpeakingScheme(null);

    window.alert(t.cleared);
    navigate("/", { replace: true, state: null });
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-slate-950">
          {t.title}
        </h1>
        <p className="mt-2 text-slate-600">
          {t.subtitle}
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-xl border bg-white p-12 text-slate-600">
          <LoaderCircle className="animate-spin" size={22} />
          {t.loading}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="rounded-xl border bg-white p-8 text-center">
          <AlertCircle className="mx-auto mb-3 text-amber-600" size={32} />
          <p className="text-slate-700">{t.noResults}</p>
          <Link
            to="/eligibility"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white"
          >
            {t.back}
          </Link>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <>
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
            <ShieldCheck className="mt-1 shrink-0" size={20} />
            {t.disclaimer}
          </div>

          <div className="space-y-6">
            {results.map((scheme) => (
              <article
                key={scheme.scheme_id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="border-b border-slate-100 p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-bold text-slate-900">
                      {scheme.scheme_name}
                    </h2>

                    <div className="flex items-center gap-2">
                      <StatusIcon status={scheme.status} />
                      <span className="font-semibold text-slate-800">
                        {getStatusText(scheme.status, t)}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {getStatusDescription(scheme.status, t)}
                  </p>

                  {scheme.explanation && (
                    <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                      {scheme.explanation}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSpeak(scheme)}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                  >
                    {speakingScheme === scheme.scheme_id ? (
                      <Square size={16} />
                    ) : (
                      <Volume2 size={17} />
                    )}
                    {speakingScheme === scheme.scheme_id ? t.stop : t.listen}
                  </button>
                </div>

                {scheme.conditions?.length > 0 && (
                  <section className="border-b border-slate-100 p-5 sm:p-6">
                    <h3 className="mb-4 font-bold text-slate-900">
                      {t.conditions}
                    </h3>

                    <div className="space-y-4">
                      {scheme.conditions.map((condition, index) => (
                        <div
                          key={`${condition.id}-${index}`}
                          className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
                        >
                          <div>
                            <p className="font-medium text-slate-800">
                              {condition.label}
                            </p>
                            {condition.explanation && (
                              <p className="mt-1 text-sm text-slate-500">
                                {condition.explanation}
                              </p>
                            )}
                          </div>

                          <ConditionStatus
                            outcome={condition.outcome}
                            t={t}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {scheme.missing_information?.length > 0 && (
                  <section className="border-b border-slate-100 p-5 sm:p-6">
                    <h3 className="mb-3 font-bold text-slate-900">
                      {t.missing}
                    </h3>

                    <ul className="list-inside list-disc space-y-2 text-sm text-slate-600">
                      {scheme.missing_information.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </section>
                )}

                <section className="border-b border-slate-100 p-5 sm:p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-bold text-slate-900">
                      {t.documents}
                    </h3>

                    <button
                      type="button"
                      onClick={() => printChecklist(scheme, t)}
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                    >
                      <Printer size={16} />
                      {t.print}
                    </button>
                  </div>

                  {scheme.documents?.length ? (
                    <div className="space-y-3">
                      {scheme.documents.map((document) => (
                        <div
                          key={document.id}
                          className="flex items-start gap-3 text-sm"
                        >
                          <FileText
                            size={18}
                            className="mt-0.5 shrink-0 text-emerald-700"
                          />
                          <div>
                            <p className="font-medium text-slate-800">
                              {document.name}
                            </p>
                            {document.description && (
                              <p className="mt-1 text-slate-500">
                                {document.description}
                              </p>
                            )}
                            <span className="mt-1 inline-block text-xs text-slate-500">
                              {document.is_mandatory
                                ? t.mandatory
                                : t.optional}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      {t.noDocuments}
                    </p>
                  )}
                </section>

                <section className="p-5 sm:p-6">
                  <h3 className="mb-3 font-bold text-slate-900">
                    {t.sources}
                  </h3>

                  {scheme.sources?.length ? (
                    <div className="space-y-3">
                      {scheme.sources.map((source, index) => (
                        <div
                          key={`${source.url}-${index}`}
                          className="flex flex-wrap items-center justify-between gap-3"
                        >
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 underline"
                          >
                            {source.title}
                            <ExternalLink size={14} />
                          </a>

                          <span className="text-xs text-slate-500">
                            {t.lastChecked}:{" "}
                            {source.last_checked_at
                              ? new Date(source.last_checked_at).toLocaleDateString(
                                  lang === "hi" ? "hi-IN" : "en-IN"
                                )
                              : t.notAvailable}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      {t.noSources}
                    </p>
                  )}

                  {scheme.official_url && (
                    <a
                      href={scheme.official_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 underline"
                    >
                      {lang === "hi"
                        ? "योजना की आधिकारिक वेबसाइट"
                        : "Official scheme website"}
                      <ExternalLink size={14} />
                    </a>
                  )}

                  {scheme.last_verified_at && (
                    <p className="mt-3 text-xs text-slate-500">
                      {t.lastChecked}:{" "}
                      {new Date(scheme.last_verified_at).toLocaleDateString(
                        lang === "hi" ? "hi-IN" : "en-IN"
                      )}
                    </p>
                  )}
                </section>
              </article>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                window.speechSynthesis?.cancel();
                sessionStorage.removeItem("janSahayakEligibilityResult");
                sessionStorage.removeItem("janSahayakEligibility");
                navigate("/eligibility");
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
              {t.back}
            </button>

            <button
              type="button"
              onClick={clearData}
              className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-6 py-3 font-semibold text-red-700 hover:bg-red-50"
            >
              <Trash2 size={18} />
              {t.clear}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
