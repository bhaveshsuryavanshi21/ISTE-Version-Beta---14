import { useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  Home,
  ChevronRight,
  Search,
  Landmark,
  ArrowRight,
  FileText,
  ClipboardList,
} from "lucide-react";

function readAssessmentHistory() {
  try {
    const stored = JSON.parse(
      window.localStorage.getItem("janSahayakResults") || "[]"
    );
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function getStatusText(status, isHindi) {
  const normalized = String(status || "").toLowerCase();

  if (["eligible", "potentially_eligible"].includes(normalized)) {
    return isHindi ? "संभावित रूप से पात्र" : "Potentially eligible";
  }

  if (normalized === "not_eligible") {
    return isHindi ? "पात्र नहीं" : "Not eligible";
  }

  return isHindi ? "सत्यापन आवश्यक" : "Needs verification";
}

function formatDate(value, isHindi) {
  if (!value) return isHindi ? "तारीख उपलब्ध नहीं" : "Date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat(isHindi ? "hi-IN" : "en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function Dashboard() {
  const outletContext = useOutletContext() || {};
  const language = outletContext.language || "en";
  const isHindi = language === "hi";

  const activities = useMemo(() => {
    return readAssessmentHistory()
      .flatMap((record) => {
        const results = Array.isArray(record?.results) ? record.results : [];

        return results.map((result, index) => ({
          id: `${record.id || record.savedAt || "assessment"}-${result.scheme_id ?? index}`,
          title: result.scheme_name || (isHindi ? "सरकारी योजना" : "Government scheme"),
          description: isHindi ? "पात्रता जाँच पूरी हुई" : "Eligibility assessment completed",
          date: formatDate(record.savedAt, isHindi),
          savedAt: record.savedAt,
          status: result.status,
        }));
      })
      .sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0))
      .slice(0, 3);
  }, [isHindi]);

  return (
    <div className="mx-auto max-w-[1500px]">
      {/* Breadcrumb */}
      <div className="mb-5 flex items-center gap-2 text-slate-500">
        <Home size={17} />
        {isHindi ? "होम" : "Home"}
        <ChevronRight size={17} />
        <span className="text-slate-900">
          {isHindi ? "डैशबोर्ड" : "Dashboard"}
        </span>
      </div>

      {/* Welcome */}
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-slate-900">
          {isHindi ? "स्वागत है!" : "Welcome!"}
        </h1>
        <p className="mt-2 text-lg text-slate-500">
          {isHindi
            ? "सरकारी योजनाएँ खोजें और अपनी पात्रता जाँचें।"
            : "Discover government schemes and check your eligibility."}
        </p>
      </div>

      {/* Action Cards */}
      <div className="mb-7 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Eligibility Card */}
        <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-50 transition-colors group-hover:bg-blue-100">
              <Search size={32} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isHindi ? "मेरे लिए योजनाएँ खोजें" : "Check schemes for me"}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {isHindi
                  ? "कुछ सवालों के जवाब दें और जानें कि आप किन योजनाओं के लिए पात्र हो सकते हैं।"
                  : "Answer a few questions to find schemes you may qualify for."}
              </p>
            </div>
          </div>
          <Link
            to="/eligibility"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700"
          >
            {isHindi ? "शुरू करें" : "Get Started"} <ArrowRight size={18} />
          </Link>
        </div>

        {/* Explore Card */}
        <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-50 transition-colors group-hover:bg-blue-100">
              <Landmark size={32} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isHindi ? "सभी योजनाएँ देखें" : "Explore all schemes"}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {isHindi
                  ? "केंद्र और राज्य सरकार की योजनाएँ देखें।"
                  : "Browse Central and State government schemes."}
              </p>
            </div>
          </div>
          <Link
            to="/schemes"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-600 bg-white py-3 text-sm font-semibold text-blue-600 transition-all duration-200 hover:bg-blue-50"
          >
            {isHindi ? "योजनाएँ ब्राउज़ करें" : "Browse Schemes"}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
          <h2 className="text-xl font-bold text-slate-900">
            {isHindi ? "हाल की गतिविधि" : "Recent Activity"}
          </h2>
          <Link to="/results" className="font-medium text-blue-600">
            {isHindi ? "सभी देखें" : "View all"}
          </Link>
        </div>

        {activities.length > 0 ? (
          <div className="px-5">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-wrap items-center gap-4 border-b border-slate-200 py-4 last:border-0"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <FileText size={27} className="text-blue-600" />
                </div>
                <div className="min-w-[180px] flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {activity.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {activity.description}
                  </p>
                </div>
                <span className="min-w-[120px] text-sm text-slate-500">
                  {activity.date}
                </span>
                <div className="min-w-[125px]">
                  <span
                    className={`inline-block rounded-xl px-4 py-2 text-sm font-medium ${
                      ["eligible", "potentially_eligible"].includes(
                        String(activity.status || "").toLowerCase()
                      )
                        ? "bg-green-50 text-green-700"
                        : String(activity.status || "").toLowerCase() === "not_eligible"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {getStatusText(activity.status, isHindi)}
                  </span>
                </div>
                <ChevronRight size={22} className="text-slate-500" />
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <ClipboardList size={34} className="mx-auto mb-3 text-slate-300" />
            <h3 className="font-semibold text-slate-800">
              {isHindi ? "अभी कोई गतिविधि नहीं है" : "No recent activity yet"}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {isHindi
                ? "आपकी पात्रता जाँच यहाँ दिखाई देगी।"
                : "Your eligibility assessments will appear here."}
            </p>
            <Link
              to="/eligibility"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
            >
              {isHindi ? "पात्रता जाँचें" : "Check eligibility"}
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
