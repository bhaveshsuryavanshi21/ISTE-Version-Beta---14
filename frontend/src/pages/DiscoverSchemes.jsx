import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import {
  Search,
  Sprout,
  GraduationCap,
  HeartPulse,
  House,
  Users,
  ShieldCheck,
  BriefcaseBusiness,
  MoreHorizontal,
  Bookmark,
  ArrowRight,
  X,
  RefreshCw,
  ExternalLink,
  FileText,
  CheckCircle,
  LoaderCircle,
  Printer,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

const categories = [
  { name: "All", icon: null },
  { name: "Agriculture", icon: Sprout },
  { name: "Education", icon: GraduationCap },
  { name: "Healthcare", icon: HeartPulse },
  { name: "Housing", icon: House },
  { name: "Women & Child", icon: Users },
  { name: "Social Security", icon: ShieldCheck },
  { name: "Employment", icon: BriefcaseBusiness },
  { name: "Other", icon: MoreHorizontal },
];

const categoryVisuals = {
  Agriculture: { Icon: Sprout, iconColor: "text-emerald-700", iconBg: "bg-emerald-50" },
  Education: { Icon: GraduationCap, iconColor: "text-blue-600", iconBg: "bg-blue-50" },
  Healthcare: { Icon: HeartPulse, iconColor: "text-rose-600", iconBg: "bg-rose-50" },
  Housing: { Icon: House, iconColor: "text-orange-600", iconBg: "bg-orange-50" },
  "Women & Child": { Icon: Users, iconColor: "text-pink-600", iconBg: "bg-pink-50" },
  "Social Security": { Icon: ShieldCheck, iconColor: "text-indigo-600", iconBg: "bg-indigo-50" },
  Employment: { Icon: BriefcaseBusiness, iconColor: "text-teal-700", iconBg: "bg-teal-50" },
  Other: { Icon: MoreHorizontal, iconColor: "text-slate-600", iconBg: "bg-slate-100" },
};

// Hindi labels for the catalogue records currently seeded in the database.
// API-provided *_hi fields take priority whenever the backend returns them.
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
    printChecklist: "Print / Download Checklist",
    documentChecklist: "Document Checklist",
    mandatory: "Required",
    optional: "Optional",
    printPopupBlocked: "Please allow pop-ups to print or save this checklist.",
    checklistNote: "Please verify the latest document requirements on the official scheme website before applying.",
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
    printChecklist: "सूची प्रिंट / डाउनलोड करें",
    documentChecklist: "दस्तावेज़ों की सूची",
    mandatory: "अनिवार्य",
    optional: "वैकल्पिक",
    printPopupBlocked: "इस सूची को प्रिंट या सेव करने के लिए कृपया पॉप-अप की अनुमति दें।",
    checklistNote: "आवेदन करने से पहले आधिकारिक योजना वेबसाइट पर दस्तावेज़ों की नवीनतम आवश्यकताएँ जाँच लें।",
  },
};

const categoryHindi = {
  Agriculture: "कृषि",
  Education: "शिक्षा",
  Healthcare: "स्वास्थ्य सेवा",
  Housing: "आवास",
  "Women & Child": "महिला एवं बाल विकास",
  "Social Security": "सामाजिक सुरक्षा",
  Employment: "रोज़गार",
  Other: "अन्य",
};

function getCategoryVisual(category) {
  return (
    categoryVisuals[category] || {
      Icon: MoreHorizontal,
      iconColor: "text-slate-600",
      iconBg: "bg-slate-100",
    }
  );
}

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

function getSchemeField(scheme, englishKey, hindiKey, fallbackKey) {
  if (!scheme) return "";
  if (hindiKey && scheme[hindiKey]) return scheme[hindiKey];
  if (fallbackKey && schemeHindiFallback[scheme.id]?.[fallbackKey]) {
    return schemeHindiFallback[scheme.id][fallbackKey];
  }
  return scheme[englishKey] || "";
}

function getGovernmentLabel(value, language, labels) {
  if (language !== "hi") return value || "";
  if (value === "Central Government") return labels.centralGov;
  if (value === "Madhya Pradesh") return labels.mpGov;
  return value || "";
}

export default function DiscoverSchemes() {
  const { language = "en" } = useOutletContext();
  const isHindi = language === "hi";
  const t = text[isHindi ? "hi" : "en"];

  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState("");
  const [government, setGovernment] = useState("All");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [bookmarks, setBookmarks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [selectedScheme, setSelectedScheme] = useState(null);
  const [schemeDetails, setSchemeDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  // Fetch the catalogue from the existing FastAPI endpoint.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchSchemes() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/api/schemes`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load schemes. Server returned ${response.status}.`
          );
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid scheme data received from server.");
        }
        setSchemes(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchSchemes();
    return () => controller.abort();
  }, [reloadKey]);

  const filteredSchemes = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = schemes.filter((scheme) => {
      const displayName = getSchemeField(scheme, "name", "name_hi", "name");
      const displayMinistry = getSchemeField(scheme, "ministry", "ministry_hi", "ministry");
      const displayDescription = getSchemeField(
        scheme,
        "description",
        "description_hi",
        "description"
      );

      const matchesSearch = [
        scheme.name,
        scheme.name_hi,
        scheme.ministry,
        scheme.description,
        displayName,
        displayMinistry,
        displayDescription,
      ].some((value) => String(value || "").toLowerCase().includes(query));

      const matchesGovernment = government === "All" || scheme.government === government;
      const matchesCategory = category === "All" || scheme.category === category;
      return matchesSearch && matchesGovernment && matchesCategory;
    });

    if (sortBy === "az") {
      filtered.sort((a, b) => {
        const nameA = getSchemeField(a, "name", "name_hi", "name");
        const nameB = getSchemeField(b, "name", "name_hi", "name");
        return String(nameA).localeCompare(String(nameB), isHindi ? "hi" : "en");
      });
    }

    if (sortBy === "recent") {
      filtered.sort((a, b) => {
        const dateA = new Date(a.last_verified_at || 0).getTime();
        const dateB = new Date(b.last_verified_at || 0).getTime();
        return (Number.isNaN(dateB) ? 0 : dateB) - (Number.isNaN(dateA) ? 0 : dateA);
      });
    }

    return filtered;
  }, [schemes, search, government, category, sortBy, isHindi]);

  function toggleBookmark(id) {
    setBookmarks((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  function openSchemeDetails(scheme) {
    setSelectedScheme(scheme);
    setSchemeDetails(null);
    setDetailsError("");
  }

  // Fetch full scheme details without changing the backend API contract.
  useEffect(() => {
    if (!selectedScheme?.id) return undefined;
    const controller = new AbortController();

    async function fetchSchemeDetails() {
      try {
        setDetailsLoading(true);
        setDetailsError("");

        const response = await fetch(
          `${API_BASE_URL}/api/schemes/${encodeURIComponent(selectedScheme.id)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load scheme details. Server returned ${response.status}.`
          );
        }

        const data = await response.json();
        setSchemeDetails(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setDetailsError(err.message || "Unable to load scheme details.");
        }
      } finally {
        if (!controller.signal.aborted) setDetailsLoading(false);
      }
    }

    fetchSchemeDetails();
    return () => controller.abort();
  }, [selectedScheme?.id]);

  function closeDetails() {
    setSelectedScheme(null);
    setSchemeDetails(null);
    setDetailsError("");
  }

  function clearFilters() {
    setSearch("");
    setGovernment("All");
    setCategory("All");
    setSortBy("recent");
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]);
  }

  function printDocumentChecklist() {
    const documents = schemeDetails?.documents || [];
    if (!documents.length) return;

    const schemeName = getSchemeField(schemeDetails, "name", "name_hi", "name");
    const ministry = getSchemeField(schemeDetails, "ministry", "ministry_hi", "ministry");
    const generatedDate = new Intl.DateTimeFormat(isHindi ? "hi-IN" : "en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date());

    const documentRows = documents.map((document) => {
      const name = typeof document === "string"
        ? document
        : isHindi
          ? document.name_hi || document.name
          : document.name;
      const description = typeof document === "string"
        ? ""
        : isHindi
          ? document.description_hi || document.description
          : document.description;
      const requirement = typeof document === "string" || document.is_mandatory !== false
        ? t.mandatory
        : t.optional;

      return `
        <li class="document-item">
          <span class="checkbox" aria-hidden="true"></span>
          <div class="document-copy">
            <strong>${escapeHtml(name)}</strong>
            ${description ? `<p>${escapeHtml(description)}</p>` : ""}
          </div>
          <span class="requirement">${escapeHtml(requirement)}</span>
        </li>
      `;
    }).join("");

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.alert(t.printPopupBlocked);
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html lang="${isHindi ? "hi" : "en"}">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${escapeHtml(t.documentChecklist)} - ${escapeHtml(schemeName)}</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 36px; color: #172033; font-family: Arial, sans-serif; }
            .page { max-width: 760px; margin: 0 auto; }
            .brand { color: #047857; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
            h1 { margin: 12px 0 6px; font-size: 26px; }
            .scheme { margin: 0; color: #475569; font-size: 15px; }
            .meta { margin-top: 20px; padding: 14px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; line-height: 1.7; }
            h2 { margin: 28px 0 12px; font-size: 17px; }
            .documents { padding: 0; margin: 0; list-style: none; }
            .document-item { display: flex; align-items: flex-start; gap: 12px; padding: 14px 10px; border-bottom: 1px solid #e2e8f0; break-inside: avoid; }
            .checkbox { width: 17px; height: 17px; flex: 0 0 17px; border: 1.5px solid #475569; border-radius: 3px; margin-top: 2px; }
            .document-copy { flex: 1; min-width: 0; }
            .document-copy strong { font-size: 14px; }
            .document-copy p { margin: 5px 0 0; color: #64748b; font-size: 12px; line-height: 1.5; }
            .requirement { color: #475569; font-size: 11px; white-space: nowrap; }
            .note { margin-top: 24px; padding: 12px 14px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 7px; color: #92400e; font-size: 12px; line-height: 1.6; }
            .footer { margin-top: 28px; color: #94a3b8; font-size: 10px; text-align: center; }
            @media print { body { padding: 0; } .page { max-width: none; } }
          </style>
        </head>
        <body>
          <main class="page">
            <div class="brand">Jan Sahayak</div>
            <h1>${escapeHtml(t.documentChecklist)}</h1>
            <p class="scheme">${escapeHtml(schemeName)}</p>
            <div class="meta">
              ${ministry ? `<div><strong>${isHindi ? "मंत्रालय / विभाग" : "Ministry / Department"}:</strong> ${escapeHtml(ministry)}</div>` : ""}
              <div><strong>${isHindi ? "तैयार करने की तारीख" : "Prepared on"}:</strong> ${escapeHtml(generatedDate)}</div>
            </div>
            <h2>${isHindi ? "दस्तावेज़ जाँचें" : "Documents to prepare"}</h2>
            <ul class="documents">${documentRows}</ul>
            <div class="note">${escapeHtml(t.checklistNote)}</div>
            <div class="footer">${escapeHtml(schemeName)} · Jan Sahayak</div>
          </main>
          <script>window.onload = function () { window.focus(); window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  const details = schemeDetails || selectedScheme;
  const detailDescription = getSchemeField(
    schemeDetails,
    "description",
    "description_hi",
    "description"
  );
  const detailBenefits = getSchemeField(
    schemeDetails,
    "benefits",
    "benefits_hi",
    "benefits"
  );
  const detailHasEnglishOnlyContent =
    isHindi &&
    schemeDetails &&
    ((!schemeDetails.description_hi && schemeDetails.description) ||
      (!schemeDetails.benefits_hi && schemeDetails.benefits) ||
      schemeDetails.eligibility_conditions?.some(
        (item) => !item.explanation_hi && !item.description_hi
      ) ||
      schemeDetails.documents?.some((item) => !item.name_hi));

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-blue-600">
          {t.home}
        </Link>
        <span>›</span>
        <span className="font-medium text-slate-900">{t.breadcrumb}</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {t.title}
        </h1>
        <p className="mt-2 text-sm text-slate-500 md:text-base">{t.subtitle}</p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(250px,1fr)_170px_170px_170px]">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
          <Search size={20} className="shrink-0 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            aria-label={t.searchLabel}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          {search && (
            <button onClick={() => setSearch("")} aria-label={t.clearSearch}>
              <X size={17} className="text-slate-400" />
            </button>
          )}
        </div>

        <select
          value={government}
          onChange={(e) => setGovernment(e.target.value)}
          aria-label={t.government}
          className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-400"
        >
          <option value="All">{t.government}</option>
          <option value="Central Government">{t.central}</option>
          <option value="Madhya Pradesh">{t.state}</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label={t.category}
          className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-400"
        >
          <option value="All">{t.category}</option>
          {categories.slice(1).map((item) => (
            <option key={item.name} value={item.name}>
              {isHindi ? categoryHindi[item.name] || item.name : item.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label={t.sort}
          className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-400"
        >
          <option value="recent">{t.recent}</option>
          <option value="az">{t.az}</option>
        </select>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map((item) => {
          const Icon = item.icon;
          const active = category === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setCategory(item.name)}
              aria-pressed={active}
              className={`flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {Icon && <Icon size={17} />}
              {item.name === "All"
                ? isHindi ? "सभी" : "All"
                : isHindi ? categoryHindi[item.name] || item.name : item.name}
            </button>
          );
        })}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {t.showing} <span className="font-semibold text-slate-900">{filteredSchemes.length}</span> {t.schemes}
        </p>
        {(search || government !== "All" || category !== "All") && (
          <button onClick={clearFilters} className="text-sm font-medium text-blue-600 hover:underline">
            {t.clearFilters}
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-14 text-slate-500">
          <LoaderCircle size={20} className="animate-spin" />
          <span className="text-sm">{t.loading}</span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-white px-5 py-10 text-center">
          <p className="font-semibold text-slate-800">{t.unable}</p>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <button
            onClick={() => setReloadKey((previous) => previous + 1)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <RefreshCw size={16} /> {t.retry}
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-3">
          {filteredSchemes.map((scheme) => {
            const { Icon, iconColor, iconBg } = getCategoryVisual(scheme.category);
            const saved = bookmarks.includes(scheme.id);
            const displayName = getSchemeField(scheme, "name", "name_hi", "name");
            const displayMinistry = getSchemeField(scheme, "ministry", "ministry_hi", "ministry");
            const displayDescription = getSchemeField(
              scheme,
              "description",
              "description_hi",
              "description"
            );
            const displayBenefit = getSchemeField(
              scheme,
              "benefit_summary",
              "benefit_summary_hi",
              "benefit_summary"
            );

            return (
              <article
                key={scheme.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 md:p-5"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                    <Icon size={30} className={iconColor} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold text-slate-900 md:text-lg">{displayName}</h2>
                    <p className="mt-1 text-sm text-slate-500">{displayMinistry}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{displayDescription}</p>
                    {displayBenefit && (
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {t.benefit} {displayBenefit}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 xl:w-[210px] xl:shrink-0">
                    <span className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                      {getGovernmentLabel(scheme.government, language, t)}
                    </span>
                    <span className="rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                      {isHindi ? categoryHindi[scheme.category] || scheme.category : scheme.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 xl:shrink-0">
                    <button
                      onClick={() => toggleBookmark(scheme.id)}
                      title={saved ? t.remove : t.save}
                      aria-label={saved ? t.remove : t.save}
                      aria-pressed={saved}
                      className={`rounded-lg p-2 transition ${
                        saved
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                      }`}
                    >
                      <Bookmark size={19} fill={saved ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={() => openSchemeDetails(scheme)}
                      className="rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                      {t.view}
                    </button>
                    <Link
                      to={`/eligibility?scheme_id=${encodeURIComponent(scheme.id)}`}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      {t.check} <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}

          {filteredSchemes.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
              <Search size={35} className="mx-auto mb-3 text-slate-300" />
              <h3 className="font-semibold text-slate-800">
                {schemes.length === 0 ? t.noAvailable : t.noFound}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {schemes.length === 0 ? t.addLater : t.changeSearch}
              </p>
              {(search || government !== "All" || category !== "All") && (
                <button onClick={clearFilters} className="mt-4 text-sm font-semibold text-blue-600 hover:underline">
                  {t.clearAll}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {selectedScheme && details && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4"
          onClick={closeDetails}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="scheme-details-title"
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{t.details}</p>
                <h2 id="scheme-details-title" className="mt-1 text-xl font-bold text-slate-900">
                  {getSchemeField(details, "name", "name_hi", "name")}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {getGovernmentLabel(details.government, language, t)} · {isHindi ? categoryHindi[details.category] || details.category : details.category}
                </p>
              </div>
              <button onClick={closeDetails} aria-label={t.closePopup} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            {detailsLoading && (
              <div className="flex items-center gap-2 py-8 text-sm text-slate-500">
                <LoaderCircle size={18} className="animate-spin" /> {t.loadingDetails}
              </div>
            )}

            {detailsError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {detailsError}
              </div>
            )}

            {!detailsLoading && !detailsError && schemeDetails && (
              <div className="space-y-5">
                {detailDescription && (
                  <section>
                    <h3 className="mb-2 font-semibold text-slate-900">{t.about}</h3>
                    <p className="text-sm leading-6 text-slate-600">{detailDescription}</p>
                  </section>
                )}

                {detailBenefits && (
                  <section>
                    <h3 className="mb-2 font-semibold text-slate-900">{t.benefits}</h3>
                    <p className="text-sm leading-6 text-slate-600">{detailBenefits}</p>
                  </section>
                )}

                {schemeDetails.eligibility_conditions?.length > 0 && (
                  <section>
                    <h3 className="mb-2 font-semibold text-slate-900">{t.conditions}</h3>
                    <ul className="space-y-2">
                      {schemeDetails.eligibility_conditions.map((condition, index) => (
                        <li key={condition.rule_code ?? index} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                          {isHindi
                            ? condition.explanation_hi || condition.description_hi || condition.description || condition
                            : condition.description || condition}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {schemeDetails.documents?.length > 0 && (
                  <section>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-semibold text-slate-900">{t.documents}</h3>
                      <button
                        type="button"
                        onClick={printDocumentChecklist}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                      >
                        <Printer size={16} /> {t.printChecklist}
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {schemeDetails.documents.map((document, index) => (
                        <li key={document.id ?? index} className="flex items-start gap-2 text-sm text-slate-600">
                          <FileText size={17} className="mt-0.5 shrink-0 text-blue-600" />
                          <span>
                            {typeof document === "string"
                              ? document
                              : isHindi
                                ? document.name_hi || document.name
                                : document.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {isHindi && detailHasEnglishOnlyContent && (
                  <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                    {t.hindiDataNote}
                  </p>
                )}

                <section className="rounded-lg bg-slate-50 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">{t.officialInfo}</h3>
                  <p className="mb-3 text-xs text-slate-500">
                    {t.lastVerified} {formatDate(schemeDetails.last_verified_at, language)}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {schemeDetails.official_url && (
                      <a
                        href={schemeDetails.official_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                      >
                        {t.officialWebsite} <ExternalLink size={14} />
                      </a>
                    )}
                    {schemeDetails.guidelines_url && (
                      <a
                        href={schemeDetails.guidelines_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                      >
                        {t.guidelines} <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </section>
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
              <button onClick={closeDetails} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                {t.close}
              </button>
              <Link
                to={`/eligibility?scheme_id=${encodeURIComponent(selectedScheme.id)}`}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {t.check} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
