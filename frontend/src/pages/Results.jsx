import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  ExternalLink,
  FileText,
  ShieldCheck,
  Trash2,
} from "lucide-react";

const STORAGE_KEY = "janSahayakResults";

const translations = {
  en: {
    history: "Assessment history",
    title: "My Results",
    intro: "View the eligibility assessments saved in this browser. Your answers are not stored here; only the assessment results and date are saved.",
    clearHistory: "Clear history",
    emptyTitle: "No saved assessments yet",
    emptyText: "Complete an eligibility check and its results will appear here automatically.",
    checkEligibility: "Check eligibility",
    assessment: "Assessment",
    delete: "Delete",
    noResults: "No scheme results were saved for this assessment.",
    governmentScheme: "Government scheme",
    potentiallyEligible: "Potentially eligible",
    notEligible: "Not eligible",
    needsVerification: "Needs verification",
    noExplanation: "No explanation was provided.",
    conditionsChecked: "Conditions checked",
    conditionMet: "Condition met",
    notMet: "Not met",
    verifyInfo: "Information requiring verification",
    officialWebsite: "Official website",
    disclaimer: "Results are preliminary and are not official government approval. They are stored only in this browser on this device. Clearing browser data may remove them.",
    dateUnavailable: "Date not available",
  },
  hi: {
    history: "मूल्यांकन इतिहास",
    title: "मेरे परिणाम",
    intro: "इस ब्राउज़र में सहेजे गए पात्रता मूल्यांकन देखें। आपके उत्तर यहाँ सहेजे नहीं जाते; केवल मूल्यांकन के परिणाम और तारीख सहेजी जाती है।",
    clearHistory: "इतिहास हटाएँ",
    emptyTitle: "अभी कोई मूल्यांकन सहेजा नहीं गया है",
    emptyText: "पात्रता जाँच पूरी करें। उसके परिणाम यहाँ अपने आप दिखाई देंगे।",
    checkEligibility: "पात्रता जाँचें",
    assessment: "मूल्यांकन",
    delete: "हटाएँ",
    noResults: "इस मूल्यांकन के लिए कोई योजना परिणाम सहेजा नहीं गया।",
    governmentScheme: "सरकारी योजना",
    potentiallyEligible: "संभावित रूप से पात्र",
    notEligible: "पात्र नहीं",
    needsVerification: "सत्यापन आवश्यक",
    noExplanation: "कोई विवरण उपलब्ध नहीं है।",
    conditionsChecked: "जाँची गई शर्तें",
    conditionMet: "शर्त पूरी हुई",
    notMet: "पूरी नहीं हुई",
    verifyInfo: "सत्यापन के लिए आवश्यक जानकारी",
    officialWebsite: "आधिकारिक वेबसाइट",
    disclaimer: "ये प्रारंभिक परिणाम हैं, सरकारी स्वीकृति नहीं। ये केवल इस डिवाइस के इस ब्राउज़र में सहेजे जाते हैं। ब्राउज़र डेटा साफ़ करने पर ये हट सकते हैं।",
    dateUnavailable: "तारीख उपलब्ध नहीं",
  },
};

function formatDate(value, language) {
  if (!value) return translations[language].dateUnavailable;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return translations[language].dateUnavailable;

  return new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatus(status, t) {
  const value = String(status || "").toLowerCase();

  if (["eligible", "potentially_eligible"].includes(value)) {
    return {
      label: t.potentiallyEligible,
      className: "border-emerald-200 bg-emerald-50 text-emerald-800",
      Icon: CheckCircle2,
    };
  }

  if (value === "not_eligible") {
    return {
      label: t.notEligible,
      className: "border-rose-200 bg-rose-50 text-rose-800",
      Icon: CircleAlert,
    };
  }

  return {
    label: t.needsVerification,
    className: "border-amber-200 bg-amber-50 text-amber-800",
    Icon: Clock3,
  };
}

export default function Results() {
  const { language = "en" } = useOutletContext() || {};
  const t = translations[language] || translations.en;
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setHistory(Array.isArray(saved) ? saved : []);
    } catch (error) {
      console.error("Could not read saved assessment history:", error);
      setHistory([]);
    }
  }, []);

  function removeAssessment(indexToRemove) {
    const updated = history.filter((_, index) => index !== indexToRemove);
    setHistory(updated);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Could not update saved assessment history:", error);
    }
  }

  function clearHistory() {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Could not clear saved assessment history:", error);
    }
  }

  return (
    <div className="mx-auto max-w-[1050px]">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-800">
            <FileText size={17} /> {t.history}
          </p>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            {t.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {t.intro}
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
          >
            <Trash2 size={16} /> {t.clearHistory}
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <section className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <FileText size={26} className="text-slate-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            {t.emptyTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {t.emptyText}
          </p>
          <Link
            to="/eligibility"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
          >
            {t.checkEligibility} <ArrowRight size={17} />
          </Link>
        </section>
      ) : (
        <div className="space-y-5">
          {history.map((assessment, assessmentIndex) => {
            const results = Array.isArray(assessment.results)
              ? assessment.results
              : [];

            return (
              <section
                key={assessment.id || assessmentIndex}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {t.assessment} {history.length - assessmentIndex}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays size={14} />
                      {formatDate(assessment.savedAt, language)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAssessment(assessmentIndex)}
                    className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 sm:self-center"
                    aria-label={t.delete}
                  >
                    <Trash2 size={14} /> {t.delete}
                  </button>
                </div>

                <div className="space-y-4 p-4 sm:p-5">
                  {results.length === 0 ? (
                    <p className="text-sm text-slate-500">{t.noResults}</p>
                  ) : (
                    results.map((result, resultIndex) => {
                      const status = getStatus(result.status, t);
                      const StatusIcon = status.Icon;

                      return (
                        <article
                          key={`${result.scheme_id ?? "scheme"}-${resultIndex}`}
                          className="rounded-lg border border-slate-200 p-4"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <h3 className="font-semibold text-slate-900">
                              {result.scheme_name || t.governmentScheme}
                            </h3>
                            <span
                              className={`inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold ${status.className}`}
                            >
                              <StatusIcon size={14} /> {status.label}
                            </span>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {result.explanation ||
                              result.reason_summary ||
                              t.noExplanation}
                          </p>

                          {result.conditions?.length > 0 && (
                            <div className="mt-4">
                              <h4 className="mb-2 text-sm font-semibold text-slate-800">
                                {t.conditionsChecked}
                              </h4>
                              <div className="space-y-2">
                                {result.conditions.map((condition, index) => {
                                  const conditionStatus = getStatus(
                                    condition.outcome === "passed"
                                      ? "potentially_eligible"
                                      : condition.outcome === "not_met"
                                      ? "not_eligible"
                                      : "needs_verification",
                                    t
                                  );

                                  return (
                                    <div
                                      key={condition.id || index}
                                      className="rounded-lg bg-slate-50 p-3"
                                    >
                                      <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="text-sm font-medium text-slate-800">
                                          {condition.label || condition.description}
                                        </p>
                                        <span
                                          className={`rounded-md px-2 py-1 text-xs font-semibold ${conditionStatus.className}`}
                                        >
                                          {condition.outcome === "passed"
                                            ? t.conditionMet
                                            : condition.outcome === "not_met"
                                            ? t.notMet
                                            : t.needsVerification}
                                        </span>
                                      </div>
                                      {condition.explanation && (
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                          {condition.explanation}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {result.missing_information?.length > 0 && (
                            <div className="mt-4 rounded-lg bg-amber-50 p-3">
                              <h4 className="text-sm font-semibold text-amber-900">
                                {t.verifyInfo}
                              </h4>
                              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800">
                                {result.missing_information.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {result.official_url && (
                            <a
                              href={result.official_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                            >
                              {t.officialWebsite} <ExternalLink size={14} />
                            </a>
                          )}
                        </article>
                      );
                    })
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex items-start gap-2 rounded-lg bg-slate-50 p-4 text-xs leading-5 text-slate-500">
        <ShieldCheck size={15} className="mt-0.5 shrink-0" />
        <p>{t.disclaimer}</p>
      </div>
    </div>
  );
}
