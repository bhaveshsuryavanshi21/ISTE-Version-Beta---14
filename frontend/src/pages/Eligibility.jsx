import { useEffect, useRef, useState } from "react";

import { Link, useOutletContext, useSearchParams } from "react-router-dom";

import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert, LoaderCircle, RefreshCw, ShieldCheck, FileText, ExternalLink, Mic, Volume2, VolumeX } from "lucide-react";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

const STEPS = ["Questions", "Review Answers", "Results"];



const COPY = {

    en: {

        steps: ["Questions", "Review Answers", "Results"],

        yes: "Yes", no: "No", notSure: "Not sure",

        selectAnswer: "Select an answer", enterAnswer: "Enter your answer",

        questionTitle: "Answer a few questions",

        questionIntro: "We ask only the information needed to check applicable schemes.",

        noQuestions: "No eligibility questions are currently available. Please contact an administrator or try again later.",

        reviewAnswers: "Review Answers", reviewTitle: "Review Your Answers",

        reviewIntro: "Check your information before starting the eligibility assessment.",

        notProvided: "Not provided",

        reviewNotice: "The system will evaluate your answers against the available official scheme rules. Missing or uncertain information may require verification.",

        editAnswers: "Edit Answers", checking: "Checking...", checkEligibility: "Check Eligibility",

        noResults: "No scheme results were returned. Please try again.",

        assessmentComplete: "Eligibility Assessment Complete",

        resultIntro: "Here are the results based on your answers and the scheme rules available to us.",

        assessmentReference: "Assessment reference:",

        governmentScheme: "Government Scheme", noExplanation: "No detailed explanation was provided.",

        conditionWise: "Condition-wise explanation", conditionMet: "Condition met",

        notMet: "Not met", needsVerification: "Needs verification",

        infoVerification: "Information requiring verification", officialWebsite: "Official Website",

        rulesLastChecked: "Rules last checked:", notAvailable: "Not available",

        preliminaryNotice: "These are preliminary results based on the information provided and the rules available in the system. They are not an official government approval or guarantee of benefits.",

        exploreSchemes: "Explore Schemes", backHome: "Back to Home",

        pageTitle: "Check Your Eligibility",

        pageIntro: "Answer a few relevant questions to discover government schemes you may qualify for.",

        selectedScheme: "Checking a selected scheme",

        allSchemes: "Discovering schemes across the available catalogue",

        loadingQuestions: "Loading relevant questions...",

        loadErrorTitle: "Unable to load eligibility questions",

        tryAgain: "Try Again",

        privacyNotice: "Only provide information needed for scheme assessment. Eligibility results are preliminary and are not official approval.",

        validation: "Please answer all required questions. {count} answer(s) missing.",

        requestError: "Unable to complete eligibility check.",
        voiceInput: "Answer by voice",
        stopListening: "Stop listening",
        speechUnsupported: "Voice input is not supported in this browser. Please type your answer instead.",
        speechPermission: "Microphone access was denied. Allow microphone access or type your answer.",
        speechFailed: "Speech could not be recognized. Please try again or type your answer.",
        voiceOptionNotMatched: "I could not match that speech to an available option. Please choose from the list.",
        voiceNumberOnly: "Please speak the number clearly, using digits.",
        listenResults: "Listen to results",
        stopSpeaking: "Stop speaking",
        speechPlaybackUnsupported: "Spoken playback is not supported in this browser.",
        speechPlaybackFailed: "The results could not be spoken. Please try again.",

    },

    hi: {

        steps: ["प्रश्न", "उत्तर जाँचें", "परिणाम"],

        yes: "हाँ", no: "नहीं", notSure: "पता नहीं",

        selectAnswer: "उत्तर चुनें", enterAnswer: "अपना उत्तर लिखें",

        questionTitle: "कुछ प्रश्नों के उत्तर दें",

        questionIntro: "हम केवल वही जानकारी पूछते हैं जो योजनाओं की पात्रता जाँचने के लिए आवश्यक है।",

        noQuestions: "फिलहाल पात्रता से जुड़े प्रश्न उपलब्ध नहीं हैं। कृपया व्यवस्थापक से संपर्क करें या बाद में पुनः प्रयास करें।",

        reviewAnswers: "उत्तर जाँचें", reviewTitle: "अपने उत्तर जाँचें",

        reviewIntro: "पात्रता जाँच शुरू करने से पहले अपनी जानकारी देख लें।",

        notProvided: "जानकारी नहीं दी गई",

        reviewNotice: "सिस्टम आपके उत्तरों की उपलब्ध आधिकारिक योजना नियमों से जाँच करेगा। अधूरी या अनिश्चित जानकारी के लिए सत्यापन आवश्यक हो सकता है।",

        editAnswers: "उत्तर बदलें", checking: "जाँच हो रही है...", checkEligibility: "पात्रता जाँचें",

        noResults: "किसी योजना का परिणाम नहीं मिला। कृपया दोबारा प्रयास करें।",

        assessmentComplete: "पात्रता जाँच पूरी हुई",

        resultIntro: "आपके उत्तरों और हमारे पास उपलब्ध योजना नियमों के आधार पर ये परिणाम हैं।",

        assessmentReference: "जाँच संदर्भ:",

        governmentScheme: "सरकारी योजना", noExplanation: "विस्तृत स्पष्टीकरण उपलब्ध नहीं है।",

        conditionWise: "शर्त के अनुसार विवरण", conditionMet: "शर्त पूरी हुई",

        notMet: "शर्त पूरी नहीं हुई", needsVerification: "सत्यापन आवश्यक",

        infoVerification: "सत्यापन के लिए आवश्यक जानकारी", officialWebsite: "आधिकारिक वेबसाइट",

        rulesLastChecked: "नियमों की अंतिम जाँच:", notAvailable: "उपलब्ध नहीं",

        preliminaryNotice: "ये परिणाम दी गई जानकारी और सिस्टम में उपलब्ध नियमों पर आधारित प्रारंभिक परिणाम हैं। ये सरकार की आधिकारिक मंज़ूरी या लाभ मिलने की गारंटी नहीं हैं।",

        exploreSchemes: "योजनाएँ देखें", backHome: "मुख्य पृष्ठ पर जाएँ",

        pageTitle: "अपनी पात्रता जाँचें",

        pageIntro: "जानें कि आप किन सरकारी योजनाओं के लिए पात्र हो सकते हैं।",

        selectedScheme: "चुनी गई योजना की पात्रता जाँची जा रही है",

        allSchemes: "उपलब्ध सभी योजनाओं की पात्रता जाँची जा रही है",

        loadingQuestions: "प्रासंगिक प्रश्न लोड हो रहे हैं...",

        loadErrorTitle: "पात्रता के प्रश्न लोड नहीं हो सके",

        tryAgain: "दोबारा प्रयास करें",

        privacyNotice: "योजना की पात्रता जाँचने के लिए केवल आवश्यक जानकारी दें। परिणाम प्रारंभिक हैं और सरकारी मंज़ूरी नहीं हैं।",

        validation: "कृपया सभी आवश्यक प्रश्नों के उत्तर दें। {count} उत्तर बाकी हैं।",

        requestError: "पात्रता जाँच पूरी नहीं हो सकी।",
        voiceInput: "बोलकर उत्तर दें",
        stopListening: "सुनना बंद करें",
        speechUnsupported: "इस ब्राउज़र में आवाज़ से उत्तर देना उपलब्ध नहीं है। कृपया उत्तर टाइप करें।",
        speechPermission: "माइक्रोफ़ोन की अनुमति नहीं मिली। माइक्रोफ़ोन की अनुमति दें या उत्तर टाइप करें।",
        speechFailed: "आवाज़ पहचान नहीं पाए। कृपया फिर से बोलें या उत्तर टाइप करें।",
        voiceOptionNotMatched: "आपकी आवाज़ उपलब्ध विकल्पों से मेल नहीं खाई। कृपया सूची से विकल्प चुनें।",
        voiceNumberOnly: "कृपया संख्या स्पष्ट रूप से अंकों में बोलें।",
        listenResults: "परिणाम सुनें",
        stopSpeaking: "बोलना बंद करें",
        speechPlaybackUnsupported: "इस ब्राउज़र में परिणाम सुनाने की सुविधा उपलब्ध नहीं है।",
        speechPlaybackFailed: "परिणाम सुनाए नहीं जा सके। कृपया फिर से प्रयास करें।",

    },

};



function getCopy(language) {

    return COPY[language] || COPY.en;

}


// Convert speech into a value for the existing question field.
function normaliseSpeechText(value) {
    return String(value || "")
        .toLocaleLowerCase()
        .replace(/[।,.!?]/g, "")
        .trim()
        .replace(/\s+/g, " ");
}

function findSpokenOption(transcript, options) {
    const spoken = normaliseSpeechText(transcript);

    const aliases = [
        { phrases: ["yes", "yeah", "yep", "haan", "हाँ", "हां", "जी हाँ", "जी"], values: ["yes", "true", "1"] },
        { phrases: ["no", "नहीं", "नही", "ना"], values: ["no", "false", "0"] },
        { phrases: ["not sure", "unsure", "पता नहीं", "मालूम नहीं", "निश्चित नहीं"], values: ["not_sure", "unknown"] },
    ];

    for (const group of aliases) {
        if (group.phrases.some((phrase) => normaliseSpeechText(phrase) === spoken)) {
            const match = options.find((option) => {
                const value = normaliseSpeechText(option.value);
                const label = normaliseSpeechText(option.label);
                return group.values.includes(value) ||
                    group.phrases.some((phrase) => normaliseSpeechText(phrase) === label);
            });
            if (match) return match;
        }
    }

    return options.find((option) => {
        const candidates = [
            option.value,
            option.label,
            option.label_hi,
            option.label_en,
            option.hi,
            option.en,
        ].filter(Boolean).map(normaliseSpeechText);

        return candidates.some((candidate) =>
            candidate === spoken || (candidate.length > 2 && spoken.includes(candidate))
        );
    });
}

// Browser speech-to-text button. Text entry remains available as a fallback.
function VoiceInput({
    language,
    onTranscript,
    label,
    stopLabel,
    unsupportedText,
    permissionText,
    failedText,
}) {
    const [listening, setListening] = useState(false);
    const [error, setError] = useState("");
    const recognitionRef = useRef(null);

    useEffect(() => {
        return () => {
            try {
                recognitionRef.current?.abort();
            } catch {
                // Recognition may already have stopped.
            }
        };
    }, []);

    function startListening() {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError(unsupportedText);
            return;
        }

        setError("");

        try {
            const recognition = new SpeechRecognition();
            recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.maxAlternatives = 3;

            recognition.onresult = (event) => {
                const transcript = event.results?.[0]?.[0]?.transcript?.trim();
                if (transcript) {
                    onTranscript(transcript);
                } else {
                    setError(failedText);
                }
            };

            recognition.onerror = (event) => {
                setListening(false);
                if (event.error === "not-allowed" || event.error === "service-not-allowed") {
                    setError(permissionText);
                } else if (event.error !== "aborted") {
                    setError(failedText);
                }
            };

            recognition.onend = () => {
                setListening(false);
                recognitionRef.current = null;
            };

            recognitionRef.current = recognition;
            recognition.start();
            setListening(true);
        } catch {
            setListening(false);
            setError(failedText);
        }
    }

    function stopListening() {
        try {
            recognitionRef.current?.stop();
        } catch {
            // Recognition may already have stopped.
        }
        setListening(false);
    }

    return (
        <div className="shrink-0">
            <button
                type="button"
                onClick={listening ? stopListening : startListening}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition sm:w-auto ${
                    listening
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
                aria-label={listening ? stopLabel : label}
            >
                <Mic size={17} />
                {listening ? stopLabel : label}
            </button>
            {error && (
                <p className="mt-1 max-w-xs text-xs leading-5 text-rose-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

// Normalise option values received from the backend.

function getOptions(question, language = "en") {

    const t = getCopy(language);

    if (question.options?.length) {

        return question.options.map((option) => {

            if (typeof option === "string") {

                return { label: option, value: option };

            }

            return {

                ...option,

                label: language === "hi"

                    ? (option.label_hi || option.hi || option.label)

                    : (option.label_en || option.en || option.label),

            };

        });

    }

    if (question.type === "yes_no") {

        return [

            { label: t.yes, value: "yes" },

            { label: t.no, value: "no" },

            { label: t.notSure, value: "not_sure" },

        ];

    }

    return [];

}

function getStatusDetails(status, language = "en") {

    const t = getCopy(language);

    const normalised = String(status || "").toLowerCase();

    if (["eligible", "potentially_eligible"].includes(normalised)) {

        return {

            label: language === "hi" ? "संभावित रूप से पात्र" : "Potentially eligible",

            className: "bg-emerald-50 text-emerald-800 border-emerald-200",

        };

    }

    if (normalised === "not_eligible") {

        return {

            label: language === "hi" ? "पात्र नहीं" : "Not eligible",

            className: "bg-rose-50 text-rose-800 border-rose-200",

        };

    }

    return {

        label: t.needsVerification,

        className: "bg-amber-50 text-amber-800 border-amber-200",

    };

}

function formatDate(value, language = "en") {

    if (!value)

        return language === "hi" ? "उपलब्ध नहीं" : "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime()))

        return String(value);

    return new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", {

        day: "2-digit",

        month: "short",

        year: "numeric",

    }).format(date);

}

// Three-step progress indicator

function StepIndicator({ step, language = "en" }) {

    const steps = getCopy(language).steps;

    return (<div className="mb-8 flex items-center justify-between">



      {steps.map((label, index) => {

            const number = index + 1;

            const active = step === number;

            const completed = step > number;

            return (<div key={label} className="relative flex flex-1 flex-col items-center">



            {index !== 0 && (<div className={`absolute right-1/2 top-5 h-[2px] w-full ${completed || active

                        ? "bg-emerald-700"

                        : "bg-slate-200"}`}/>)}



            <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${active || completed

                    ? "border-emerald-700 bg-emerald-700 text-white"

                    : "border-slate-200 bg-white text-slate-500"}`}>



              {completed ? <CheckCircle2 size={19}/> : number}



            </div>



            <span className={`mt-2 text-center text-xs font-medium sm:text-sm ${active ? "text-emerald-800" : "text-slate-500"}`}>



              {label}



            </span>



          </div>);

        })}



    </div>);

}

// Reusable question input

function QuestionField({ question, value, onChange, language = "en" }) {
    const t = getCopy(language);
    const options = getOptions(question, language);
    const required = question.required !== false;
    const [voiceMatchError, setVoiceMatchError] = useState("");

    function handleVoiceTranscript(transcript) {
        setVoiceMatchError("");

        if (options.length > 0) {
            const matchedOption = findSpokenOption(transcript, options);
            if (matchedOption) {
                onChange(String(matchedOption.value));
            } else {
                setVoiceMatchError(t.voiceOptionNotMatched);
            }
            return;
        }

        if (question.type === "number") {
            const hindiDigits = "०१२३४५६७८९";
            const numericTranscript = transcript
                .replace(/[०-९]/g, (digit) => String(hindiDigits.indexOf(digit)))
                .replace(/[^\d.-]/g, "");

            if (!numericTranscript) {
                setVoiceMatchError(t.voiceNumberOnly);
                return;
            }

            onChange(numericTranscript);
            return;
        }

        onChange(transcript);
    }

    return (
        <div className="min-w-0">
            <label className="block text-sm font-semibold text-slate-700">
                {question.label}
                {required && <span className="ml-1 text-rose-500">*</span>}
            </label>

            {question.help_text && (
                <p className="mt-1 text-xs text-slate-500">{question.help_text}</p>
            )}

            {options.length > 0 ? (
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <select
                        required={required}
                        value={value ?? ""}
                        onChange={(e) => {
                            setVoiceMatchError("");
                            onChange(e.target.value);
                        }}
                        className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    >
                        <option value="">{t.selectAnswer}</option>
                        {options.map((option) => (
                            <option key={String(option.value)} value={String(option.value)}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <VoiceInput
                        language={language}
                        onTranscript={handleVoiceTranscript}
                        label={t.voiceInput}
                        stopLabel={t.stopListening}
                        unsupportedText={t.speechUnsupported}
                        permissionText={t.speechPermission}
                        failedText={t.speechFailed}
                    />
                </div>
            ) : (
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <input
                        required={required}
                        type={["number", "date"].includes(question.type)
                            ? question.type
                            : "text"}
                        min={question.min_value ?? undefined}
                        max={question.max_value ?? undefined}
                        value={value ?? ""}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={question.placeholder || t.enterAnswer}
                        className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />

                    {question.type !== "date" && (
                        <VoiceInput
                            language={language}
                            onTranscript={handleVoiceTranscript}
                            label={t.voiceInput}
                            stopLabel={t.stopListening}
                            unsupportedText={t.speechUnsupported}
                            permissionText={t.speechPermission}
                            failedText={t.speechFailed}
                        />
                    )}
                </div>
            )}

            {voiceMatchError && (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                    {voiceMatchError}
                </p>
            )}
        </div>
    );
}

// STEP 1: Dynamic Questions

function QuestionsStep({ questions, answers, setAnswers, onNext, error, language = "en", }) {

    const t = getCopy(language);

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

    return (<form onSubmit={handleSubmit}>



      <div className="mb-5">



        <h2 className="text-lg font-bold text-slate-900">



          {t.questionTitle}



        </h2>



        <p className="mt-1 text-sm text-slate-500">



          {t.questionIntro}



        </p>



      </div>



      {questions.length === 0 ? (<div className="rounded-lg border border-slate-200 p-5 text-sm text-slate-600">



          {t.noQuestions}



        </div>) : (<div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">



          {questions.map((question) => (<QuestionField key={question.id} question={question} value={answers[question.id] ?? ""} onChange={(value) => updateAnswer(question.id, value)} language={language}/>))}



        </div>)}



      {error && (<p className="mt-4 text-sm text-rose-600" role="alert">



          {error}



        </p>)}



      <div className="mt-8 flex justify-end">



        <button type="submit" disabled={questions.length === 0} className="flex items-center gap-2 rounded-lg bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50">



          {t.reviewAnswers} <ArrowRight size={18}/>



        </button>



      </div>



    </form>);

}

// STEP 2: Review Answers

function ReviewStep({ questions, answers, onBack, onSubmit, submitting, error, language = "en", }) {

    const t = getCopy(language);

    return (<div>



      <div className="mb-5">



        <h2 className="text-lg font-bold text-slate-900">



          {t.reviewTitle}



        </h2>



        <p className="mt-1 text-sm text-slate-500">



          {t.reviewIntro}



        </p>



      </div>



      <div className="space-y-3">



        {questions.map((question) => {

            const selected = answers[question.id];

            const option = getOptions(question, language).find((item) => String(item.value) === String(selected));

            return (<div key={question.id} className="rounded-lg border border-slate-200 p-4">



              <p className="text-xs text-slate-500">



                {question.label}



              </p>



              <p className="mt-1 text-sm font-semibold text-slate-800">



                {selected === undefined || selected === ""

                    ? t.notProvided

                    : option?.label ?? String(selected)}



              </p>



            </div>);

        })}



      </div>



      <div className="mt-5 flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">



        <CircleAlert size={19} className="mt-0.5 shrink-0"/>



        <p>



          {t.reviewNotice}



        </p>



      </div>



      {error && (<p className="mt-4 text-sm text-rose-600" role="alert">



          {error}



        </p>)}



      <div className="mt-8 flex items-center justify-between">



        <button type="button" onClick={onBack} disabled={submitting} className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">



          <ArrowLeft size={18}/> {t.editAnswers}



        </button>



        <button type="button" onClick={onSubmit} disabled={submitting} className="flex items-center gap-2 rounded-lg bg-emerald-800 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60">



          {submitting ? (<>



              <LoaderCircle size={18} className="animate-spin"/>



              {t.checking}



            </>) : (<>



              {t.checkEligibility} <ArrowRight size={18}/>



            </>)}



        </button>



      </div>



    </div>);

}

// Text-to-speech playback for the completed assessment.
function SpeakResultsButton({ results, language }) {
    const t = getCopy(language);
    const [speaking, setSpeaking] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, [language]);

    function toggleSpeech() {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            setError(t.speechPlaybackUnsupported);
            return;
        }

        setError("");

        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            return;
        }

        const spokenText = results.map((result) => {
            const status = getStatusDetails(result.status, language).label;
            const parts = [
                result.scheme_name || t.governmentScheme,
                status,
                result.explanation || "",
            ];

            if (result.conditions?.length) {
                result.conditions.forEach((condition) => {
                    const outcome = condition.outcome === "passed"
                        ? t.conditionMet
                        : condition.outcome === "not_met"
                            ? t.notMet
                            : t.needsVerification;
                    parts.push(condition.explanation || condition.label || "");
                    parts.push(outcome);
                });
            }

            if (result.missing_information?.length) {
                parts.push(t.infoVerification);
                parts.push(...result.missing_information);
            }

            return parts.filter(Boolean).join(". ");
        }).join(". ");

        const utterance = new window.SpeechSynthesisUtterance(
            `${t.assessmentComplete}. ${spokenText}`
        );
        utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
        utterance.rate = 0.95;
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => {
            setSpeaking(false);
            setError(t.speechPlaybackFailed);
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
        setSpeaking(true);
    }

    return (
        <div className="mb-5 flex flex-col items-center gap-2">
            <button
                type="button"
                onClick={toggleSpeech}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
                {speaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                {speaking ? t.stopSpeaking : t.listenResults}
            </button>
            {error && (
                <p className="text-center text-xs text-rose-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

// STEP 3: Actual Eligibility Results

function EligibilityResults({ results, assessmentId, onBack, language = "en" }) {

    const t = getCopy(language);

    if (!results.length) {

        return (<div className="rounded-lg border border-amber-200 bg-amber-50 p-5">



        {t.noResults}



      </div>);

    }

    return (<div>



      <div className="mb-6 text-center">



        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">



          <CheckCircle2 size={30} className="text-emerald-700"/>



        </div>



        <h2 className="text-xl font-bold text-slate-900">



          {t.assessmentComplete}



        </h2>



        <p className="mt-2 text-sm text-slate-500">



          {t.resultIntro}



        </p>



        {assessmentId && (<p className="mt-2 text-xs text-slate-400">



            {t.assessmentReference} {assessmentId}



          </p>)}



      </div>

      <SpeakResultsButton results={results} language={language} />

      <div className="space-y-4">



        {results.map((result, index) => {

            const status = getStatusDetails(result.status, language);

            return (<article key={result.scheme_id ?? index} className="rounded-xl border border-slate-200 p-5">



              <div className="flex flex-wrap items-start justify-between gap-3">



                <h3 className="text-base font-bold text-slate-900">



                  {result.scheme_name || t.governmentScheme}



                </h3>



                <span className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${status.className}`}>



                  {status.label}



                </span>



              </div>



              <p className="mt-3 text-sm leading-6 text-slate-600">



                {result.explanation ||

                    result.reason_summary ||

                    t.noExplanation}



              </p>



                {result.conditions?.length > 0 && (<div className="mt-4">



    <h4 className="mb-2 text-sm font-semibold text-slate-800">



      {t.conditionWise}



    </h4>



    <div className="space-y-2">



      {result.conditions.map((condition, index) => (<div key={condition.id ?? index} className="rounded-lg bg-slate-50 p-3">



          <div className="flex flex-wrap items-center justify-between gap-2">



            <p className="text-sm font-medium text-slate-800">



              {condition.label || condition.description}



            </p>



            <span className={`rounded-md px-2 py-1 text-xs font-semibold ${condition.outcome === "passed"

                            ? "bg-emerald-50 text-emerald-700"

                            : condition.outcome === "not_met"

                                ? "bg-rose-50 text-rose-700"

                                : "bg-amber-50 text-amber-700"}`}>



              {condition.outcome === "passed"

                            ? t.conditionMet

                            : condition.outcome === "not_met"

                                ? t.notMet

                                : t.needsVerification}



            </span>



          </div>



          {condition.explanation && (<p className="mt-1 text-xs leading-5 text-slate-500">



              {condition.explanation}



            </p>)}



        </div>))}



    </div>



  </div>)}



              {result.missing_information?.length > 0 && (<div className="mt-4 rounded-lg bg-amber-50 p-3">



                  <h4 className="text-sm font-semibold text-amber-900">



                    {t.infoVerification}



                  </h4>



                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800">



                    {result.missing_information.map((item, i) => (<li key={i}>{item}</li>))}



                  </ul>



                </div>)}



              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">



                {result.official_url && (<a href={result.official_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">



                    {t.officialWebsite} <ExternalLink size={14}/>



                  </a>)}



                <span className="text-xs text-slate-500">



                  {t.rulesLastChecked} {formatDate(result.last_verified_at, language)}



                </span>



              </div>



            </article>);

        })}



      </div>



      <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">



        {t.preliminaryNotice}



      </div>



      <div className="mt-8 flex flex-wrap justify-between gap-3">



        <button onClick={onBack} className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">



          <ArrowLeft size={18}/> {t.reviewAnswers}



        </button>



        <Link to="/schemes" className="flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900">



          {t.exploreSchemes} <ArrowRight size={18}/>



        </Link>



      </div>



    </div>);

}

export default function Eligibility() {

    const [searchParams] = useSearchParams();

    const schemeId = searchParams.get("scheme_id");

    const { language } = useOutletContext();

    const t = getCopy(language);

    const previousSchemeId = useRef(schemeId);

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

                    language,

                });

                if (schemeId) {

                    params.set("scheme_id", schemeId);

                }

                const response = await fetch(`${API_BASE_URL}/api/eligibility/questions?${params.toString()}`, { signal: controller.signal });

                if (!response.ok) {

                    throw new Error(`Unable to load questions. Server returned ${response.status}.`);

                }

                const data = await response.json();

                if (!Array.isArray(data.questions)) {

                    throw new Error("Invalid question data received from server.");

                }

                setQuestions(data.questions);



                // Clear answers only when the selected scheme changes.

                // A language change should preserve the citizen's answers.

                if (previousSchemeId.current !== schemeId) {

                    setAnswers({});

                    setStep(1);

                    setResults([]);

                    setAssessmentId(null);

                    previousSchemeId.current = schemeId;

                }

            }

            catch (err) {

                if (err.name !== "AbortError") {

                    setLoadError(err.message || "Unable to load questions.");

                }

            }

            finally {

                if (!controller.signal.aborted) {

                    setLoadingQuestions(false);

                }

            }

        }

        loadQuestions();

        return () => controller.abort();

    }, [schemeId, language]);

    // Validate required questions before review.

    function moveToReview() {

        const missing = questions.filter((question) => question.required !== false &&

            (answers[question.id] === undefined ||

                answers[question.id] === ""));

        if (missing.length > 0) {

            setFormError(t.validation.replace("{count}", String(missing.length)));

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

            const response = await fetch(`${API_BASE_URL}/api/eligibility/check`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                },

                body: JSON.stringify({

                    scheme_id: schemeId || null,

                    answers,

                    language,

                }),

            });

            if (!response.ok) {

                const errorData = await response.json().catch(() => ({}));

                throw new Error(errorData.detail ||

                    `Eligibility check failed. Server returned ${response.status}.`);

            }

            const data = await response.json();

            if (!Array.isArray(data.results)) {

                throw new Error("Invalid eligibility result received from server.");

            }

            // Save result summaries in this browser without storing citizen answers.

            // Keep only the latest 20 assessments.

            try {

                const existingHistory = JSON.parse(localStorage.getItem("janSahayakResults") || "[]");

                const history = Array.isArray(existingHistory) ? existingHistory : [];

                const newRecord = {

                    id: `assessment-${Date.now()}`,

                    savedAt: new Date().toISOString(),

                    schemeId: schemeId || null,

                    results: data.results,

                };

                localStorage.setItem("janSahayakResults", JSON.stringify([newRecord, ...history].slice(0, 20)));

            }

            catch (storageError) {

                // Do not block the eligibility result if browser storage is unavailable.

                console.warn("Could not save assessment history:", storageError);

            }

            setResults(data.results);

            setAssessmentId(data.assessment_id || null);

            setStep(3);

        }

        catch (err) {

            setFormError(err.message || t.requestError);

        }

        finally {

            setSubmitting(false);

        }

    }

    return (<div className="mx-auto max-w-[1050px]">



      {/* Breadcrumb */}



      <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-800">



        <ArrowLeft size={16}/> {t.backHome}



      </Link>



      {/* Heading */}



      <div className="mb-7">



        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">



          {t.pageTitle}



        </h1>



        <p className="mt-2 text-sm text-slate-500 md:text-base">



          {t.pageIntro}



        </p>



        {schemeId && (<p className="mt-2 text-sm font-medium text-emerald-800">



            {t.selectedScheme}



          </p>)}



        {!schemeId && (<p className="mt-2 text-sm font-medium text-emerald-800">



            {t.allSchemes}



          </p>)}



      </div>



      <StepIndicator step={step} language={language}/>



      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 md:p-8">



        {loadingQuestions ? (<div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">



            <LoaderCircle size={20} className="animate-spin"/>



            {t.loadingQuestions}



          </div>) : loadError ? (<div className="py-10 text-center">



            <CircleAlert size={32} className="mx-auto mb-3 text-rose-600"/>



            <h2 className="font-semibold text-slate-900">



              {t.loadErrorTitle}



            </h2>



            <p className="mt-2 text-sm text-slate-500">



              {loadError}



            </p>



            <button onClick={() => window.location.reload()} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white">



              <RefreshCw size={16}/> {t.tryAgain}



            </button>



          </div>) : (<>



            {step === 1 && (<QuestionsStep questions={questions} answers={answers} setAnswers={setAnswers} onNext={moveToReview} error={formError} language={language}/>)}



            {step === 2 && (<ReviewStep questions={questions} answers={answers} onBack={() => {

                    setFormError("");

                    setStep(1);

                }} onSubmit={submitAssessment} submitting={submitting} error={formError} language={language}/>)}



            {step === 3 && (<EligibilityResults results={results} assessmentId={assessmentId} onBack={() => setStep(2)} language={language}/>)}



          </>)}



      </section>



      <div className="mt-5 flex items-start justify-center gap-2 text-center text-xs text-slate-400">



        <ShieldCheck size={15} className="shrink-0"/>



        <p>



          {t.privacyNotice}



        </p>



      </div>



    </div>);

}
