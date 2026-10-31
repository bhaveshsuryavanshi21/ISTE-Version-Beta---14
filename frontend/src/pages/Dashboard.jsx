
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
  Folder,
} from "lucide-react";

// Read saved eligibility history
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

// Get eligibility status
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

// Format date
function formatDate(value, isHindi) {
  if (!value) {
    return isHindi ? "तारीख उपलब्ध नहीं" : "Date unavailable";
  }

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

  // Recent activity
  const activities = useMemo(() => {
    return readAssessmentHistory()
      .flatMap((record) => {
        const results = Array.isArray(record?.results)
          ? record.results
          : [];

        return results.map((result, index) => ({
          id: `${record.id || record.savedAt || "assessment"}-${result.scheme_id ?? index}`,
          title:
            result.scheme_name ||
            (isHindi ? "सरकारी योजना" : "Government Scheme"),
          description: isHindi
            ? "पात्रता जाँच पूरी हुई"
            : "Eligibility assessment completed",
          date: formatDate(record.savedAt, isHindi),
          savedAt: record.savedAt,
          status: result.status,
        }));
      })
      .sort(
        (a, b) =>
          new Date(b.savedAt || 0) - new Date(a.savedAt || 0)
      )
      .slice(0, 3);
  }, [isHindi]);

  // Status badge colors
  const getStatusStyle = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (["eligible", "potentially_eligible"].includes(normalized)) {
      return "bg-green-100 text-green-800";
    }

    if (normalized === "not_eligible") {
      return "bg-rose-100 text-rose-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="mx-auto max-w-[1500px]">

      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Home size={18} />
        <span>{isHindi ? "होम" : "Home"}</span>
        <ChevronRight size={17} />
        <span className="font-medium text-slate-900">
          {isHindi ? "डैशबोर्ड" : "Dashboard"}
        </span>
      </div>

      {/* Welcome Section */}
      <div className="mb-7">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          {isHindi ? "स्वागत है!" : "Welcome!"}
        </h1>

        <p className="mt-2 text-lg text-slate-600">
          {isHindi
            ? "सरकारी योजनाएँ खोजें और अपनी पात्रता जाँचें।"
            : "Discover government schemes and check your eligibility."}
        </p>
      </div>

      {/* Action Cards */}
      <div className="mb-7 grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* Eligibility Card */}
        <div className="group rounded-xl border border-emerald-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">

          <div className="mb-5 flex items-center gap-5">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 transition-colors group-hover:bg-emerald-100">
              <Search
                size={42}
                strokeWidth={1.8}
                className="text-emerald-800"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-950">
                {isHindi
                  ? "मेरे लिए योजनाएँ खोजें"
                  : "Check schemes for me"}
              </h2>

              <p className="mt-2 text-base leading-6 text-slate-600">
                {isHindi
                  ? "कुछ सवालों के जवाब दें और जानें कि आप किन योजनाओं के लिए पात्र हो सकते हैं।"
                  : "Answer a few questions to find schemes you may qualify for."}
              </p>
            </div>

          </div>

          <Link
            to="/eligibility"
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-emerald-800 py-4 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-900"
          >
            {isHindi ? "शुरू करें" : "Get Started"}
            <ArrowRight size={20} />
          </Link>

        </div>

        {/* Explore Schemes Card */}
        <div className="group rounded-xl border border-emerald-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">

          <div className="mb-5 flex items-center gap-5">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 transition-colors group-hover:bg-emerald-100">
              <Landmark
                size={42}
                strokeWidth={1.8}
                className="text-emerald-800"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-950">
                {isHindi ? "सभी योजनाएँ देखें" : "Explore all schemes"}
              </h2>

              <p className="mt-2 text-base leading-6 text-slate-600">
                {isHindi
                  ? "केंद्र और राज्य सरकार की योजनाएँ देखें।"
                  : "Browse Central and Madhya Pradesh government schemes."}
              </p>
            </div>

          </div>

          <Link
            to="/schemes"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-emerald-800 bg-white py-4 text-base font-semibold text-emerald-800 transition-all duration-200 hover:bg-emerald-50"
          >
            {isHindi ? "योजनाएँ ब्राउज़ करें" : "Browse Schemes"}
            <ArrowRight size={20} />
          </Link>

        </div>
      </div>

      {/* Recent Activity Section */}
      <section className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-100 px-6 py-5">

          <h2 className="text-xl font-bold text-slate-950">
            {isHindi ? "हाल की गतिविधि" : "Recent Activity"}
          </h2>

          <Link
            to="/results"
            className="font-semibold text-emerald-800 transition-colors hover:text-emerald-950"
          >
            {isHindi ? "सभी देखें" : "View all"}
          </Link>

        </div>

        {/* Activity List */}
        {activities.length > 0 ? (

          <div className="px-5">

            {activities.map((activity) => (

              <Link
                to="/results"
                key={activity.id}
                className="group flex flex-wrap items-center gap-4 border-b border-slate-100 py-4 last:border-0 transition-colors hover:bg-emerald-50/40"
              >

                {/* Icon */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                  <FileText
                    size={27}
                    className="text-emerald-800"
                  />
                </div>

                {/* Details */}
                <div className="min-w-[180px] flex-1">
                  <h3 className="font-semibold text-slate-950">
                    {activity.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {activity.description}
                  </p>
                </div>

                {/* Date */}
                <span className="min-w-[120px] text-sm text-slate-500">
                  {activity.date}
                </span>

                {/* Status */}
                <div className="min-w-[150px]">
                  <span
                    className={`inline-block rounded-xl px-4 py-2 text-sm font-medium ${getStatusStyle(
                      activity.status
                    )}`}
                  >
                    {getStatusText(activity.status, isHindi)}
                  </span>
                </div>

                {/* Arrow */}
                <ChevronRight
                  size={23}
                  className="text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-emerald-800"
                />

              </Link>

            ))}

          </div>

        ) : (

          /* Empty State */
          <div className="px-5 py-14 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
              <ClipboardList
                size={34}
                className="text-emerald-700"
              />
            </div>

            <h3 className="font-semibold text-slate-900">
              {isHindi
                ? "अभी कोई गतिविधि नहीं है"
                : "No recent activity yet"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {isHindi
                ? "आपकी पात्रता जाँच यहाँ दिखाई देगी।"
                : "Your eligibility assessments will appear here."}
            </p>

            <Link
              to="/eligibility"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950 hover:underline"
            >
              {isHindi ? "पात्रता जाँचें" : "Check eligibility"}
              <ArrowRight size={17} />
            </Link>

          </div>

        )}

      </section>

    </div>
  );
}
