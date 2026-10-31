
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  FileText,
  ExternalLink,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

const STEPS = ["Questions", "Review Answers", "Results"];

// Normalise option values received from the backend.
function getOptions(question) {
  if (question.options?.length) {
    return question.options.map((option) =>
      typeof option === "string"
        ? { label: option, value: option }
        : option
    );
  }

  if (question.type === "yes_no") {
    return [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
      { label: "Not sure", value: "not_sure" },
    ];
  }

  return [];
}

function getStatusDetails(status) {
  const normalised = String(status || "").toLowerCase();

  if (["eligible", "potentially_eligible"].includes(normalised)) {
    return {
      label: "Potentially eligible",
      className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    };
  }

  if (normalised === "not_eligible") {
    return {
      label: "Not eligible",
      className: "bg-rose-50 text-rose-800 border-rose-200",
    };
  }

  return {
    label: "Needs verification",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  };
}

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

// Three-step progress indicator
function StepIndicator({ step }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      {STEPS.map((label, index) => {
        const number = index + 1;
        const active = step === number;
        const completed = step > number;

        return (
          <div
            key={label}
            className="relative flex flex-1 flex-col items-center"
          >
            {index !== 0 && (
              <div
                className={`absolute right-1/2 top-5 h-[2px] w-full ${
                  completed || active
                    ? "bg-emerald-700"
                    : "bg-slate-200"
                }`}
              />
            )}

            <div
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                active || completed
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              {completed ? <CheckCircle2 size={19} /> : number}
            </div>

            <span
              className={`mt-2 text-center text-xs font-medium sm:text-sm ${
                active ? "text-emerald-800" : "text-slate-500"
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Reusable question input
function QuestionField({ question, value, onChange }) {
  const options = getOptions(question);
  const required = question.required !== false;

  return (
    <div className="min-w-0">
      <label className="block text-sm font-semibold text-slate-700">
        {question.label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      {question.help_text && (
        <p className="mt-1 text-xs text-slate-500">
          {question.help_text}
        </p>
      )}

      {options.length > 0 ? (
        <select
          required={required}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        >
          <option value="">Select an answer</option>

          {options.map((option) => (
            <option
              key={String(option.value)}
              value={String(option.value)}
            >
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          required={required}
          type={["number", "date"].includes(question.type)
            ? question.type
            : "text"}
          min={question.min_value ?? undefined}
          max={question.max_value ?? undefined}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || "Enter your answer"}
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      )}
    </div>
  );
}

// STEP 1: Dynamic Questions
function QuestionsStep({
  questions,
  answers,
  setAnswers,
  onNext,
  error,
}) {
  function updateAnswer(questionId, value) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">
          Answer a few questions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          We ask only the information needed to check applicable schemes.
        </p>
      </div>

      {questions.length === 0 ? (
        <div className="rounded-lg border border-slate-200 p-5 text-sm text-slate-600">
          No eligibility questions are currently available.
          Please contact an administrator or try again later.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
          {questions.map((question) => (
            <QuestionField
              key={question.id}
              question={question}
              value={answers[question.id] ?? ""}
              onChange={(value) => updateAnswer(question.id, value)}
            />
          ))}
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-rose-600" role="alert">
          {error}
        </p>
      )}

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={questions.length === 0}
          className="flex items-center gap-2 rounded-lg bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Review Answers <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}

// STEP 2: Review Answers
function ReviewStep({
  questions,
  answers,
  onBack,
  onSubmit,
  submitting,
  error,
}) {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">
          Review Your Answers
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Check your information before starting the eligibility assessment.
        </p>
      </div>

      <div className="space-y-3">
        {questions.map((question) => {
          const selected = answers[question.id];
          const option = getOptions(question).find(
            (item) => String(item.value) === String(selected)
          );

          return (
            <div
              key={question.id}
              className="rounded-lg border border-slate-200 p-4"
            >
              <p className="text-xs text-slate-500">
                {question.label}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {selected === undefined || selected === ""
                  ? "Not provided"
                  : option?.label ?? String(selected)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
        <CircleAlert size={19} className="mt-0.5 shrink-0" />

        <p>
          The system will evaluate your answers against the available
          official scheme rules. Missing or uncertain information may
          require verification.
        </p>
      </div>

      {error && (
        <p className="mt-4 text-sm text-rose-600" role="alert">
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <ArrowLeft size={18} /> Edit Answers
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="flex items-center gap-2 rounded-lg bg-emerald-800 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Checking...
            </>
          ) : (
            <>
              Check Eligibility <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// STEP 3: Actual Eligibility Results
function EligibilityResults({ results, assessmentId, onBack }) {
  if (!results.length) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
        No scheme results were returned. Please try again.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 size={30} className="text-emerald-700" />
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Eligibility Assessment Complete
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Here are the results based on your answers and the scheme rules
          available to us.
        </p>

        {assessmentId && (
          <p className="mt-2 text-xs text-slate-400">
            Assessment reference: {assessmentId}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {results.map((result, index) => {
          const status = getStatusDetails(result.status);

          return (
            <article
              key={result.scheme_id ?? index}
              className="rounded-xl border border-slate-200 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-base font-bold text-slate-900">
                  {result.scheme_name || "Government Scheme"}
                </h3>

                <span
                  className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${status.className}`}
                >
                  {status.label}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {result.explanation ||
                  result.reason_summary ||
                  "No detailed explanation was provided."}
              </p>

             
{result.conditions?.length > 0 && (
  <div className="mt-4">
    <h4 className="mb-2 text-sm font-semibold text-slate-800">
      Condition-wise explanation
    </h4>

    <div className="space-y-2">
      {result.conditions.map((condition, index) => (
        <div
          key={condition.id ?? index}
          className="rounded-lg bg-slate-50 p-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-slate-800">
              {condition.label || condition.description}
            </p>

            <span
              className={`rounded-md px-2 py-1 text-xs font-semibold ${
                condition.outcome === "passed"
                  ? "bg-emerald-50 text-emerald-700"
                  : condition.outcome === "not_met"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {condition.outcome === "passed"
                ? "Condition met"
                : condition.outcome === "not_met"
                ? "Not met"
                : "Needs verification"}
            </span>
          </div>

          {condition.explanation && (
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {condition.explanation}
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
)}

              {result.missing_information?.length > 0 && (
                <div className="mt-4 rounded-lg bg-amber-50 p-3">
                  <h4 className="text-sm font-semibold text-amber-900">
                    Information requiring verification
                  </h4>

                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800">
                    {result.missing_information.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
                {result.official_url && (
                  <a
                    href={result.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                  >
                    Official Website <ExternalLink size={14} />
                  </a>
                )}

                <span className="text-xs text-slate-500">
                  Rules last checked: {formatDate(result.last_verified_at)}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        These are preliminary results based on the information provided
        and the rules available in the system. They are not an official
        government approval or guarantee of benefits.
      </div>

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft size={18} /> Review Answers
        </button>

        <Link
          to="/schemes"
          className="flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
        >
          Explore Schemes <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

export default function Eligibility() {
  const [searchParams] = useSearchParams();
  const schemeId = searchParams.get("scheme_id");

  const [step, setStep] = useState(1);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const [results, setResults] = useState([]);
  const [assessmentId, setAssessmentId] = useState(null);

  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");

  // Load questions selected by the backend.
  useEffect(() => {
    const controller = new AbortController();

    async function loadQuestions() {
      try {
        setLoadingQuestions(true);
        setLoadError("");

        const params = new URLSearchParams({
          language: "en",
        });

        if (schemeId) {
          params.set("scheme_id", schemeId);
        }

        const response = await fetch(
          `${API_BASE_URL}/api/eligibility/questions?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load questions. Server returned ${response.status}.`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data.questions)) {
          throw new Error("Invalid question data received from server.");
        }

        setQuestions(data.questions);

        // Remove previous answers when loading a new questionnaire.
        setAnswers({});
        setStep(1);
        setResults([]);
      } catch (err) {
        if (err.name !== "AbortError") {
          setLoadError(err.message || "Unable to load questions.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingQuestions(false);
        }
      }
    }

    loadQuestions();

    return () => controller.abort();
  }, [schemeId]);

  // Validate required questions before review.
  function moveToReview() {
    const missing = questions.filter(
      (question) =>
        question.required !== false &&
        (answers[question.id] === undefined ||
          answers[question.id] === "")
    );

    if (missing.length > 0) {
      setFormError(
        `Please answer all required questions. ${missing.length} answer(s) missing.`
      );
      return;
    }

    setFormError("");
    setStep(2);
  }

  // Send answers to the backend eligibility engine.
  async function submitAssessment() {
    try {
      setSubmitting(true);
      setFormError("");

      const response = await fetch(
        `${API_BASE_URL}/api/eligibility/check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scheme_id: schemeId || null,
            answers,
            language: "en",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
          errorData.detail ||
          `Eligibility check failed. Server returned ${response.status}.`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data.results)) {
        throw new Error("Invalid eligibility result received from server.");
      }

      setResults(data.results);
      setAssessmentId(data.assessment_id || null);
      setStep(3);
    } catch (err) {
      setFormError(err.message || "Unable to complete eligibility check.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1050px]">
      {/* Breadcrumb */}
      <Link
        to="/"
        className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-800"
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>

      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Check Your Eligibility
        </h1>

        <p className="mt-2 text-sm text-slate-500 md:text-base">
          Answer a few relevant questions to discover government schemes
          you may qualify for.
        </p>

        {schemeId && (
          <p className="mt-2 text-sm font-medium text-emerald-800">
            Checking a selected scheme
          </p>
        )}

        {!schemeId && (
          <p className="mt-2 text-sm font-medium text-emerald-800">
            Discovering schemes across the available catalogue
          </p>
        )}
      </div>

      <StepIndicator step={step} />

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 md:p-8">
        {loadingQuestions ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
            <LoaderCircle size={20} className="animate-spin" />
            Loading relevant questions...
          </div>
        ) : loadError ? (
          <div className="py-10 text-center">
            <CircleAlert
              size={32}
              className="mx-auto mb-3 text-rose-600"
            />

            <h2 className="font-semibold text-slate-900">
              Unable to load eligibility questions
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {loadError}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white"
            >
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        ) : (
          <>
            {step === 1 && (
              <QuestionsStep
                questions={questions}
                answers={answers}
                setAnswers={setAnswers}
                onNext={moveToReview}
                error={formError}
              />
            )}

            {step === 2 && (
              <ReviewStep
                questions={questions}
                answers={answers}
                onBack={() => {
                  setFormError("");
                  setStep(1);
                }}
                onSubmit={submitAssessment}
                submitting={submitting}
                error={formError}
              />
            )}

            {step === 3 && (
              <EligibilityResults
                results={results}
                assessmentId={assessmentId}
                onBack={() => setStep(2)}
              />
            )}
          </>
        )}
      </section>

      <div className="mt-5 flex items-start justify-center gap-2 text-center text-xs text-slate-400">
        <ShieldCheck size={15} className="shrink-0" />
        <p>
          Only provide information needed for scheme assessment.
          Eligibility results are preliminary and are not official approval.
        </p>
      </div>
    </div>
  );
}
