import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle, ExternalLink, FileText, LoaderCircle } from "lucide-react";

const schemeHindiFallback = {
  1: {
    name: "पीएम-किसान",
    ministry: "कृषि एवं किसान कल्याण मंत्रालय",
    description: "देश के छोटे और सीमांत किसानों को आय सहायता प्रदान करने वाली योजना।",
  },
  2: {
    name: "मुख्यमंत्री लाड़ली बहना योजना",
    ministry: "मध्य प्रदेश सरकार",
    description: "मध्य प्रदेश की पात्र महिलाओं को आर्थिक सहायता प्रदान करने वाली योजना।",
  },
  3: {
    name: "पीएम विश्वकर्मा",
    ministry: "सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय",
  },
  4: {
    name: "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना",
    ministry: "स्वास्थ्य एवं परिवार कल्याण मंत्रालय",
    description: "पात्र परिवारों को स्वास्थ्य सुरक्षा प्रदान करने वाली योजना।",
  },
  5: {
    name: "पीएम-यूएसपी केंद्रीय क्षेत्र छात्रवृत्ति योजना",
    ministry: "शिक्षा मंत्रालय",
  },
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

const text = {
  en: {
    home: "Home",
    breadcrumb: "Discover Schemes",
    title: "Discover Government Schemes",
    subtitle: "Explore schemes and find benefits that match your needs.",
    search: "Search schemes...",
    searchLabel: "Search schemes",
    clearSearch: "Clear search",
    government: "All Governments",
    central: "Central Government",
    state: "Madhya Pradesh",
    category: "All Categories",
    sort: "Sort schemes",
    recent: "Recently Verified",
    az: "Name: A to Z",
    showing: "Showing",
    schemes: "schemes",
    clearFilters: "Clear filters",
    loading: "Loading government schemes...",
    unable: "Unable to load schemes",
    retry: "Try Again",
    save: "Save scheme",
    remove: "Remove bookmark",
    view: "View Details",
    check: "Check Eligibility",
    noAvailable: "No schemes available yet",
    noFound: "No schemes found",
    addLater: "Government schemes will appear here once they are added.",
    changeSearch: "Try changing your search or filters.",
    clearAll: "Clear all filters",
    details: "Scheme Details",
    closePopup: "Close popup",
    loadingDetails: "Loading scheme details...",
    about: "About the Scheme",
    benefits: "Benefits",
    conditions: "Eligibility Conditions",
    documents: "Required Documents",
    officialInfo: "Official Information",
    lastVerified: "Last verified:",
    officialWebsite: "Official Website",
    guidelines: "Official Guidelines",
    close: "Close",
    benefit: "Benefit:",
    centralGov: "Central Government",
    mpGov: "Madhya Pradesh Government",
    hindiDataNote: "Some detailed scheme rules or document descriptions are currently available only in English.",
    unavailable: "Not available",
  },
  hi: {
    home: "होम",
    breadcrumb: "योजनाएँ खोजें",
    title: "सरकारी योजनाएँ खोजें",
    subtitle: "अपनी ज़रूरत के अनुसार सरकारी योजनाएँ और उनके लाभ देखें।",
    search: "योजनाएँ खोजें...",
    searchLabel: "योजनाएँ खोजें",
    clearSearch: "खोज हटाएँ",
    government: "सभी सरकारें",
    central: "केंद्र सरकार",
    state: "मध्य प्रदेश",
    category: "सभी श्रेणियाँ",
    sort: "योजनाएँ क्रमबद्ध करें",
    recent: "हाल ही में सत्यापित",
    az: "नाम: अ से ज्ञ",
    showing: "दिखाई जा रही हैं",
    schemes: "योजनाएँ",
    clearFilters: "फ़िल्टर हटाएँ",
    loading: "सरकारी योजनाएँ लोड हो रही हैं...",
    unable: "योजनाएँ लोड नहीं हो सकीं",
    retry: "फिर से प्रयास करें",
    save: "योजना सहेजें",
    remove: "बुकमार्क हटाएँ",
    view: "विवरण देखें",
    check: "पात्रता जाँचें",
    noAvailable: "अभी कोई योजना उपलब्ध नहीं है",
    noFound: "कोई योजना नहीं मिली",
    addLater: "सरकारी योजनाएँ जोड़े जाने पर यहाँ दिखाई देंगी।",
    changeSearch: "अपनी खोज या फ़िल्टर बदलकर देखें।",
    clearAll: "सभी फ़िल्टर हटाएँ",
    details: "योजना का विवरण",
    closePopup: "विवरण बंद करें",
    loadingDetails: "योजना का विवरण लोड हो रहा है...",
    about: "योजना के बारे में",
    benefits: "लाभ",
    conditions: "पात्रता की शर्तें",
    documents: "आवश्यक दस्तावेज़",
    officialInfo: "आधिकारिक जानकारी",
    lastVerified: "अंतिम जाँच:",
    officialWebsite: "आधिकारिक वेबसाइट",
    guidelines: "आधिकारिक दिशानिर्देश",
    close: "बंद करें",
    benefit: "लाभ:",
    centralGov: "केंद्र सरकार",
    mpGov: "मध्य प्रदेश सरकार",
    hindiDataNote: "योजना के कुछ विस्तृत नियम या दस्तावेज़ों का विवरण अभी केवल अंग्रेज़ी में उपलब्ध है।",
    unavailable: "उपलब्ध नहीं",
  },
};

function formatDate(dateValue, language) {
  if (!dateValue) return language === "hi" ? "उपलब्ध नहीं" : "Not available";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue);
  return new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getSchemeField(scheme, englishKey, hindiKey, fallbackKey, language = "en") {
  if (!scheme) return "";

  if (language === "hi") {
    if (hindiKey && scheme[hindiKey]) return scheme[hindiKey];
    if (fallbackKey && schemeHindiFallback[scheme.id]?.[fallbackKey]) {
      return schemeHindiFallback[scheme.id][fallbackKey];
    }
  }

  return scheme[englishKey] || "";
}

function getGovernmentLabel(value, language, labels) {
  if (language !== "hi") return value || "";
  if (value === "Central Government") return labels.centralGov;
  if (value === "Madhya Pradesh") return labels.mpGov;
  return value || "";
}

export default function SchemeDetails() {
  const { schemeId } = useParams();
  const { language = "en" } = useOutletContext() || {};
  const isHindi = language === "hi";
  const t = text[isHindi ? "hi" : "en"];
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadScheme() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${API_BASE_URL}/api/schemes/${encodeURIComponent(schemeId)}`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Unable to load scheme details. Server returned ${response.status}.`);
        const data = await response.json();
        setScheme(data);
        try {
          const key = "janSahayakActivity";
          const previous = JSON.parse(localStorage.getItem(key) || "[]");
          const entry = {
            id: `scheme-${schemeId}-${Date.now()}`,
            type: "scheme_view",
            title: data.name || `Scheme ${schemeId}`,
            titleHi: data.name_hi || data.name || `योजना ${schemeId}`,
            schemeId: String(schemeId),
            description: "Opened scheme details",
            savedAt: new Date().toISOString(),
          };
          localStorage.setItem(key, JSON.stringify([entry, ...previous.filter(item => item.schemeId !== String(schemeId) || item.type !== "scheme_view")].slice(0, 30)));
        } catch { /* Activity history is optional; scheme details must still load. */ }
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Unable to load scheme details.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadScheme();
    return () => controller.abort();
  }, [schemeId]);

  const description = getSchemeField(scheme, "description", "description_hi", "description", language);
  const benefits = getSchemeField(scheme, "benefits", "benefits_hi", "benefits", language);
  const hasEnglishOnlyContent = isHindi && scheme && (
    (!scheme.description_hi && scheme.description) ||
    (!scheme.benefits_hi && scheme.benefits) ||
    scheme.eligibility_conditions?.some(item => !item.explanation_hi && !item.description_hi) ||
    scheme.documents?.some(item => typeof item !== "string" && !item.name_hi)
  );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-blue-600">{t.home}</Link><span>›</span>
        <Link to="/schemes" className="hover:text-blue-600">{t.breadcrumb}</Link><span>›</span>
        <span className="font-medium text-slate-900">{t.details}</span>
      </div>

      <Link to="/schemes" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
        <ArrowLeft size={16} /> {isHindi ? "योजनाओं पर वापस जाएँ" : "Back to schemes"}
      </Link>

      {loading && <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-8 text-slate-600"><LoaderCircle className="animate-spin" />{t.loadingDetails}</div>}
      {!loading && error && <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}<button onClick={() => window.location.reload()} className="ml-3 font-semibold underline">{t.retry}</button></div>}
      {!loading && !error && scheme && (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 bg-slate-50 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{t.details}</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{getSchemeField(scheme, "name", "name_hi", "name", language)}</h1>
            <p className="mt-2 text-sm text-slate-500">{getGovernmentLabel(scheme.government, language, t)} · {scheme.category || ""}</p>
          </header>
          <div className="space-y-7 p-6 sm:p-8">
            {description && <section><h2 className="mb-2 text-lg font-semibold text-slate-900">{t.about}</h2><p className="text-sm leading-7 text-slate-600">{description}</p></section>}
            {benefits && <section><h2 className="mb-2 text-lg font-semibold text-slate-900">{t.benefits}</h2><p className="text-sm leading-7 text-slate-600">{benefits}</p></section>}
            {scheme.eligibility_conditions?.length > 0 && <section><h2 className="mb-3 text-lg font-semibold text-slate-900">{t.conditions}</h2><ul className="space-y-3">{scheme.eligibility_conditions.map((condition, index) => <li key={condition.rule_code ?? index} className="flex items-start gap-2 text-sm leading-6 text-slate-600"><CheckCircle size={17} className="mt-1 shrink-0 text-emerald-600" />{isHindi ? condition.explanation_hi || condition.description_hi || condition.description || condition : condition.description || condition}</li>)}</ul></section>}
            {scheme.documents?.length > 0 && <section><h2 className="mb-3 text-lg font-semibold text-slate-900">{t.documents}</h2><ul className="space-y-3">{scheme.documents.map((document, index) => <li key={document.id ?? index} className="flex items-start gap-2 text-sm text-slate-600"><FileText size={17} className="mt-0.5 shrink-0 text-blue-600" /><span>{typeof document === "string" ? document : isHindi ? document.name_hi || document.name : document.name}</span></li>)}</ul></section>}
            {hasEnglishOnlyContent && <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">{t.hindiDataNote}</p>}
            <section className="rounded-xl bg-slate-50 p-5"><h2 className="mb-2 font-semibold text-slate-900">{t.officialInfo}</h2><p className="mb-3 text-xs text-slate-500">{t.lastVerified} {formatDate(scheme.last_verified_at, language)}</p><div className="flex flex-wrap gap-5">{scheme.official_url && <a href={scheme.official_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">{t.officialWebsite}<ExternalLink size={14} /></a>}{scheme.guidelines_url && <a href={scheme.guidelines_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">{t.guidelines}<ExternalLink size={14} /></a>}</div></section>
            <div className="flex justify-end border-t border-slate-100 pt-5"><Link to={`/eligibility?scheme_id=${encodeURIComponent(scheme.id)}`} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">{t.check}<ArrowRight size={16} /></Link></div>
          </div>
        </article>
      )}
    </div>
  );
}
