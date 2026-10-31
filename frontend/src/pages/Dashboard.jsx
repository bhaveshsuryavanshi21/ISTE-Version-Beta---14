
import { Link, useOutletContext } from "react-router-dom";
import { ArrowRight, ShieldCheck, Languages, Landmark } from "lucide-react";

export default function Dashboard() {
  const { language = "en" } = useOutletContext() || {};
  const isHindi = language === "hi";

  return (
    <div className="mx-auto max-w-[1400px]">

      {/* Main Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 px-7 py-12 text-white shadow-sm sm:px-12 sm:py-16 lg:px-14 lg:py-20">

        <div className="relative z-10 max-w-3xl">

          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-700/60 px-4 py-2 text-sm font-medium text-emerald-100">
            <ShieldCheck size={17} />
            {isHindi
              ? "मध्य प्रदेश और केंद्र सरकार की योजनाएँ"
              : "Madhya Pradesh & Central Government Schemes"}
          </div>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {isHindi
              ? "अपने लिए सही सरकारी योजनाएँ खोजें"
              : "Find Government Schemes You Are Eligible For"}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-emerald-100 sm:text-lg">
            {isHindi
              ? "सरल भाषा में योजनाओं की जानकारी पाएँ, अपनी पात्रता जाँचें और आवश्यक दस्तावेज़ जानें।"
              : "Understand government schemes, check your eligibility, and discover the documents you need — all in simple language."}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">

            <Link
              to="/eligibility"
              className="inline-flex items-center justify-center gap-3 rounded-lg bg-yellow-400 px-6 py-4 font-bold text-emerald-950 shadow-sm transition hover:bg-yellow-300"
            >
              {isHindi ? "मेरी पात्रता जाँचें" : "Check My Eligibility"}
              <ArrowRight size={20} />
            </Link>

            <Link
              to="/schemes"
              className="inline-flex items-center justify-center gap-3 rounded-lg border border-emerald-300/60 bg-white/10 px-6 py-4 font-semibold text-white transition hover:bg-white/20"
            >
              {isHindi ? "सभी योजनाएँ देखें" : "Explore Schemes"}
              <ArrowRight size={20} />
            </Link>

          </div>

          {/* Highlights */}
          <div className="mt-14 grid max-w-2xl grid-cols-1 gap-8 border-t border-emerald-400/30 pt-8 sm:grid-cols-3">

            <div>
              <Landmark size={23} className="mb-3 text-yellow-400" />
              <h3 className="font-bold text-white">
                {isHindi ? "केंद्र + मध्य प्रदेश" : "Central + MP"}
              </h3>
              <p className="mt-1 text-sm text-emerald-200">
                {isHindi ? "सरकारी योजनाएँ" : "Government schemes"}
              </p>
            </div>

            <div>
              <Languages size={23} className="mb-3 text-yellow-400" />
              <h3 className="font-bold text-white">
                {isHindi ? "हिंदी और अंग्रेज़ी" : "Hindi & English"}
              </h3>
              <p className="mt-1 text-sm text-emerald-200">
                {isHindi ? "अपनी भाषा चुनें" : "Choose your language"}
              </p>
            </div>

            <div>
              <ShieldCheck size={23} className="mb-3 text-yellow-400" />
              <h3 className="font-bold text-white">
                {isHindi ? "निःशुल्क सहायता" : "Free Assistance"}
              </h3>
              <p className="mt-1 text-sm text-emerald-200">
                {isHindi ? "पात्रता की जानकारी" : "Eligibility guidance"}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {isHindi ? "जनसहायक कैसे काम करता है?" : "How JanSahayak Works"}
          </h2>

          <p className="mt-2 text-slate-600">
            {isHindi
              ? "तीन आसान चरणों में अपने लिए योजनाएँ खोजें।"
              : "Find relevant schemes in three simple steps."}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">

          {[
            {
              number: "01",
              title: isHindi ? "जानकारी दें" : "Share Your Details",
              description: isHindi
                ? "कुछ आसान सवालों के जवाब दें।"
                : "Answer a few simple questions about yourself.",
            },
            {
              number: "02",
              title: isHindi ? "पात्रता जाँचें" : "Check Eligibility",
              description: isHindi
                ? "योजनाओं के नियमों के आधार पर अपनी पात्रता जानें।"
                : "Your answers are checked against scheme rules.",
            },
            {
              number: "03",
              title: isHindi ? "परिणाम जानें" : "View Your Results",
              description: isHindi
                ? "पात्रता और आवश्यक दस्तावेज़ों की जानकारी पाएँ।"
                : "See eligibility explanations and required documents.",
            },
          ].map((step) => (
            <div
              key={step.number}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <span className="text-sm font-bold tracking-wider text-emerald-800">
                {step.number}
              </span>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}
