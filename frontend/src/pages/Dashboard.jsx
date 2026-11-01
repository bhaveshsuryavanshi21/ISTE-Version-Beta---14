import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Languages,
  Landmark,
  Clock3,
  History,
  Search,
  ClipboardCheck,
} from "lucide-react";

export default function Dashboard() {
  const { language = "en" } = useOutletContext() || {};
  const isHindi = language === "hi";
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    function loadActivities() {
      try {
        const saved = JSON.parse(localStorage.getItem("janSahayakActivity") || "[]");
        const recent = Array.isArray(saved)
          ? [...saved].sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()).slice(0, 3)
          : [];
        setActivities(recent);
      } catch {
        setActivities([]);
      }
    }
    loadActivities();
    window.addEventListener("focus", loadActivities);
    return () => window.removeEventListener("focus", loadActivities);
  }, []);

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* Main Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 px-7 py-7 text-white shadow-sm sm:px-10 sm:py-8 lg:px-12 lg:py-9">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-700/60 px-4 py-2 text-sm font-medium text-emerald-100">
            <ShieldCheck size={17} />
            {isHindi ? "मध्य प्रदेश और केंद्र सरकार की योजनाएँ" : "Madhya Pradesh & Central Government Schemes"}
          </div>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {isHindi ? "अपने लिए सही सरकारी योजनाएँ खोजें" : "Find Government Schemes You Are Eligible For"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-100 sm:text-base">
            {isHindi ? "सरल भाषा में योजनाओं की जानकारी पाएँ, अपनी पात्रता जाँचें और आवश्यक दस्तावेज़ जानें।" : "Understand government schemes, check your eligibility, and discover the documents you need — all in simple language."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/eligibility" className="inline-flex items-center justify-center gap-3 rounded-lg bg-yellow-400 px-6 py-3 font-bold text-emerald-950 shadow-sm transition hover:bg-yellow-300">
              {isHindi ? "मेरी पात्रता जाँचें" : "Check My Eligibility"}<ArrowRight size={20} />
            </Link>
            <Link to="/schemes" className="inline-flex items-center justify-center gap-3 rounded-lg border border-emerald-300/60 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20">
              {isHindi ? "सभी योजनाएँ देखें" : "Explore Schemes"}<ArrowRight size={20} />
            </Link>
          </div>
          <div className="mt-6 grid max-w-2xl grid-cols-1 gap-5 border-t border-emerald-400/30 pt-5 sm:grid-cols-3">
            <div><Landmark size={21} className="mb-2 text-yellow-400" /><h3 className="font-bold text-white">{isHindi ? "केंद्र + मध्य प्रदेश" : "Central + MP"}</h3><p className="mt-1 text-sm text-emerald-200">{isHindi ? "सरकारी योजनाएँ" : "Government schemes"}</p></div>
            <div><Languages size={21} className="mb-2 text-yellow-400" /><h3 className="font-bold text-white">{isHindi ? "हिंदी और अंग्रेज़ी" : "Hindi & English"}</h3><p className="mt-1 text-sm text-emerald-200">{isHindi ? "अपनी भाषा चुनें" : "Choose your language"}</p></div>
            <div><ShieldCheck size={21} className="mb-2 text-yellow-400" /><h3 className="font-bold text-white">{isHindi ? "निःशुल्क सहायता" : "Free Assistance"}</h3><p className="mt-1 text-sm text-emerald-200">{isHindi ? "पात्रता की जानकारी" : "Eligibility guidance"}</p></div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2"><History size={22} className="text-emerald-800" /><h2 className="text-2xl font-bold text-slate-900">{isHindi ? "हाल की गतिविधियाँ" : "Recent Activity"}</h2></div>
            <p className="mt-2 text-sm text-slate-600">{isHindi ? "आपकी हाल की योजना खोजें और पात्रता जाँच।" : "Your recently viewed schemes and eligibility checks."}</p>
          </div>
        </div>
        {activities.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {activities.map((activity, index) => (
              <div key={activity.id || `${activity.type}-${activity.savedAt}-${index}`} className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                  {activity.type === "eligibility_check" ? <ClipboardCheck size={19} className="text-emerald-800" /> : <Clock3 size={19} className="text-emerald-800" />}
                </div>
                <div className="min-w-0 flex-1"><h3 className="truncate text-sm font-semibold text-slate-900">{isHindi ? activity.titleHi || activity.title : activity.title}</h3><p className="mt-1 text-xs text-slate-500">{isHindi ? (activity.type === "eligibility_check" ? "पात्रता जाँच पूरी हुई" : "योजना का विवरण देखा") : activity.description}</p></div>
                <time className="shrink-0 text-xs text-slate-400">{new Date(activity.savedAt).toLocaleDateString(isHindi ? "hi-IN" : "en-IN", { day: "2-digit", month: "short" })}</time>
                {activity.schemeId && <Link to={`/schemes/${encodeURIComponent(activity.schemeId)}`} aria-label={isHindi ? "योजना खोलें" : "Open scheme"} className="text-emerald-700 hover:text-emerald-900"><ArrowRight size={18} /></Link>}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50"><History size={24} className="text-emerald-800" /></div>
            <h3 className="mt-3 text-base font-semibold text-slate-900">{isHindi ? "अभी कोई गतिविधि नहीं" : "No recent activity yet"}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{isHindi ? "जब आप किसी योजना का विवरण देखेंगे या पात्रता जाँचेंगे, तो आपकी गतिविधियाँ यहाँ दिखाई देंगी।" : "Schemes you view and eligibility checks you complete will appear here."}</p>
            <Link to="/schemes" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><Search size={16} />{isHindi ? "योजनाएँ देखें" : "Explore Schemes"}</Link>
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="pb-14">
        <div className="mb-8"><h2 className="text-2xl font-bold text-slate-900">{isHindi ? "जनसहायक कैसे काम करता है?" : "How JanSahayak Works"}</h2><p className="mt-2 text-slate-600">{isHindi ? "तीन आसान चरणों में अपने लिए योजनाएँ खोजें।" : "Find relevant schemes in three simple steps."}</p></div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { number: "01", title: isHindi ? "जानकारी दें" : "Share Your Details", description: isHindi ? "कुछ आसान सवालों के जवाब दें।" : "Answer a few simple questions about yourself." },
            { number: "02", title: isHindi ? "पात्रता जाँचें" : "Check Eligibility", description: isHindi ? "योजनाओं के नियमों के आधार पर अपनी पात्रता जानें।" : "Your answers are checked against scheme rules." },
            { number: "03", title: isHindi ? "परिणाम जानें" : "View Your Results", description: isHindi ? "पात्रता और आवश्यक दस्तावेज़ों की जानकारी पाएँ।" : "See eligibility explanations and required documents." },
          ].map(step => <div key={step.number} className="rounded-xl border border-slate-200 bg-white p-6"><span className="text-sm font-bold tracking-wider text-emerald-800">{step.number}</span><h3 className="mt-4 text-lg font-bold text-slate-900">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p></div>)}
        </div>
      </section>
    </div>
  );
}
