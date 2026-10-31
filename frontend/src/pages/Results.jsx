import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home, ChevronRight, Search, Bookmark, CheckCircle2, CircleAlert,
  CircleX, Leaf, Users, GraduationCap, House, HeartPulse, ArrowLeft,
  CalendarDays, ClipboardList, Printer, Download, ExternalLink
} from "lucide-react";

const demoSchemes = [
  {
    id: 1,
    name: "PM-KISAN",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description: "Income support to eligible farmer families under the scheme guidelines.",
    status: "eligible",
    icon: Leaf,
    tone: "bg-green-50 text-green-700",
    checked: "Not verified – update from official source",
    benefits: ["Financial support as per current scheme guidelines.", "Benefit is transferred to eligible beneficiaries through DBT."],
    criteria: ["Applicant must meet the current PM-KISAN beneficiary conditions.", "Land and exclusion criteria are subject to official verification."],
    documents: ["Aadhaar Card", "Bank account details", "Land records"],
    process: ["Visit the official PM-KISAN portal.", "Complete farmer registration or beneficiary verification.", "Follow the portal instructions and submit required details."],
    website: "https://pmkisan.gov.in/"
  },
  {
    id: 2,
    name: "Ladli Behna Yojana",
    ministry: "Government of Madhya Pradesh",
    description: "Financial assistance for women who meet the current Madhya Pradesh scheme conditions.",
    status: "eligible",
    icon: Users,
    tone: "bg-pink-50 text-pink-700",
    checked: "Not verified – update from official source",
    benefits: ["Financial assistance as per current scheme provisions.", "Payment is made through the prescribed benefit-transfer process."],
    criteria: ["Applicant must satisfy the current age and residence conditions.", "Income and other exclusions must be checked against official rules."],
    documents: ["Aadhaar Card", "Samagra ID", "Bank account details"],
    process: ["Check the official Madhya Pradesh scheme portal.", "Check whether registration is currently open.", "Apply through the notified process with required documents."],
    website: ""
  },
  {
    id: 3,
    name: "PM Vidya Lakshmi",
    ministry: "Ministry of Education",
    description: "Information and application access for education loan options.",
    status: "potential",
    icon: GraduationCap,
    tone: "bg-blue-50 text-blue-700",
    checked: "Not verified – update from official source",
    benefits: ["Access information about education loan options.", "Apply to participating lenders subject to their conditions."],
    criteria: ["Admission, course, institution and lender conditions may apply.", "Final approval is determined by the lender."],
    documents: ["Aadhaar Card", "Admission letter", "Academic records", "Income details"],
    process: ["Visit the official portal.", "Register and complete the student profile.", "Review lender options and submit an application."],
    website: ""
  },
  {
    id: 4,
    name: "PM Awas Yojana (Gramin)",
    ministry: "Ministry of Rural Development",
    description: "Housing assistance for rural households selected under applicable scheme guidelines.",
    status: "not_eligible",
    icon: House,
    tone: "bg-orange-50 text-orange-700",
    checked: "Not verified – update from official source",
    benefits: ["Housing assistance as per applicable government guidelines."],
    criteria: ["Rural residence and beneficiary selection rules apply.", "Final status depends on official beneficiary records."],
    documents: ["Aadhaar Card", "Bank account details", "Residence details"],
    process: ["Check the official PMAY-G portal.", "Verify beneficiary details with the relevant local authority.", "Follow the official instructions for further action."],
    website: ""
  },
  {
    id: 5,
    name: "Ayushman Bharat",
    ministry: "Ministry of Health & Family Welfare",
    description: "Health coverage for people who meet the applicable beneficiary conditions.",
    status: "eligible",
    icon: HeartPulse,
    tone: "bg-red-50 text-red-700",
    checked: "Not verified – update from official source",
    benefits: ["Cashless treatment at empanelled hospitals for eligible beneficiaries, subject to scheme rules."],
    criteria: ["Eligibility is based on applicable beneficiary criteria and official records."],
    documents: ["Aadhaar Card or accepted identity proof", "Family identification details"],
    process: ["Check eligibility through the official portal or authorised channel.", "Complete beneficiary verification.", "Follow instructions to obtain or use the beneficiary card."],
    website: ""
  }
];

const filters = [
  { id: "all", label: "All Results" },
  { id: "eligible", label: "Eligible" },
  { id: "potential", label: "May Be Eligible" },
  { id: "not_eligible", label: "Not Eligible" }
];

function StatusBadge({ status }) {
  const config = {
    eligible: { label: "Eligible", Icon: CheckCircle2, style: "bg-green-100 text-green-800" },
    potential: { label: "May Be Eligible", Icon: CircleAlert, style: "bg-amber-100 text-amber-800" },
    not_eligible: { label: "Not Eligible", Icon: CircleX, style: "bg-red-100 text-red-700" }
  };
  const { label, Icon, style } = config[status] || config.potential;
  return (
    <span className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${style}`}>
      <Icon size={17} /> {label}
    </span>
  );
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [checkedDocs, setCheckedDocs] = useState({});

  const eligibilityData = useMemo(() => {
    if (location.state?.eligibilityData) return location.state.eligibilityData;
    try {
      return JSON.parse(sessionStorage.getItem("janSahayakEligibility") || "null");
    } catch {
      return null;
    }
  }, [location.state]);

  const visibleSchemes = demoSchemes.filter(scheme => {
    const matchesFilter = filter === "all" || scheme.status === filter;
    const matchesSearch = scheme.name.toLowerCase().includes(search.toLowerCase());
    const matchesSaved = !showSaved || saved.includes(scheme.id);
    return matchesFilter && matchesSearch && matchesSaved;
  });

  const toggleSaved = id => {
    setSaved(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  };

  const toggleDocument = (schemeId, name) => {
    const key = `${schemeId}-${name}`;
    setCheckedDocs(current => ({ ...current, [key]: !current[key] }));
  };

  const printPage = () => window.print();

  return (
    <div className="mx-auto max-w-[1500px]">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-content { border: 0 !important; box-shadow: none !important; }
        }
      `}</style>

      <div className="no-print mb-5 flex items-center gap-2 text-sm text-slate-500">
        <Home size={17} /> Home <ChevronRight size={17} />
        <span className="font-medium text-slate-900">{selectedScheme ? "Scheme Details" : "My Results"}</span>
      </div>

      {selectedScheme ? (
        <div className="print-content">
          <div className="no-print mb-5">
            <button onClick={() => setSelectedScheme(null)} className="flex items-center gap-2 text-sm font-medium text-emerald-800 hover:underline">
              <ArrowLeft size={18} /> Back to Results
            </button>
          </div>

          <h1 className="mb-6 text-3xl font-bold text-slate-950">Scheme Details</h1>

          <section className="mb-5 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
            <div className={`flex h-20 w-20 items-center justify-center rounded-lg ${selectedScheme.tone}`}>
              <selectedScheme.icon size={36} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-slate-950">{selectedScheme.name}</h2>
              <p className="mt-1 text-sm text-slate-600">{selectedScheme.ministry}</p>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays size={17} /> Rules last checked: {selectedScheme.checked}
              </p>
            </div>
            <StatusBadge status={selectedScheme.status} />
          </section>

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="mb-3 text-lg font-bold text-slate-900">About the Scheme</h3>
                <p className="text-sm leading-7 text-slate-700">{selectedScheme.description}</p>
              </section>
              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="mb-3 text-lg font-bold text-slate-900">Key Benefits</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                  {selectedScheme.benefits.map(item => <li key={item}>{item}</li>)}
                </ul>
              </section>
              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="mb-3 text-lg font-bold text-slate-900">Eligibility Criteria</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                  {selectedScheme.criteria.map(item => <li key={item}>{item}</li>)}
                </ul>
              </section>
            </div>

            <div className="space-y-4">
              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <ClipboardList size={20} className="text-emerald-800" /> Documents Required
                </h3>
                <div className="space-y-4">
                  {selectedScheme.documents.map(name => {
                    const key = `${selectedScheme.id}-${name}`;
                    return (
                      <label key={name} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                        <input type="checkbox" checked={!!checkedDocs[key]} onChange={() => toggleDocument(selectedScheme.id, name)} className="h-4 w-4 accent-emerald-800" />
                        <span>{name}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="mt-4 text-xs text-slate-400">Tick the documents you have collected.</p>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="mb-5 text-lg font-bold text-slate-900">Application Process</h3>
                <ol className="space-y-4">
                  {selectedScheme.process.map((item, index) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 font-semibold text-emerald-800">{index + 1}</span>
                      {item}
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </div>

          <div className="no-print mt-7 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6">
            <button onClick={printPage} className="flex items-center gap-2 rounded-lg border border-emerald-800 px-5 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">
              <Printer size={18} /> Print
            </button>
            <button onClick={printPage} className="flex items-center gap-2 rounded-lg border border-emerald-800 px-5 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">
              <Download size={18} /> Download PDF
            </button>
            {selectedScheme.website ? (
              <a href={selectedScheme.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900">
                Official Website <ExternalLink size={17} />
              </a>
            ) : (
              <span className="rounded-lg border border-slate-200 px-4 py-3 text-xs text-slate-500">Official link not configured</span>
            )}
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-500">
            This is demonstration content. Confirm scheme rules, required documents, dates and application steps on the relevant official website before applying.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-7">
            <h1 className="text-3xl font-bold text-slate-950">My Results</h1>
            <p className="mt-2 text-base text-slate-500">Schemes that may match your information and eligibility.</p>
          </div>

          {!eligibilityData && (
            <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              No eligibility answers were found. You can still view the sample scheme list, or{" "}
              <button onClick={() => navigate("/eligibility")} className="font-semibold underline">start an eligibility check</button>.
            </div>
          )}

          <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {filters.map(item => (
                <button key={item.id} onClick={() => setFilter(item.id)}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-medium ${
                    filter === item.id ? "border-emerald-800 bg-emerald-800 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-600"
                  }`}>
                  {item.label} ({item.id === "all" ? demoSchemes.length : demoSchemes.filter(s => s.status === item.id).length})
                </button>
              ))}
            </div>
            <button onClick={() => setShowSaved(value => !value)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${showSaved ? "border-emerald-800 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-700"}`}>
              <Bookmark size={17} /> Saved ({saved.length})
            </button>
          </div>

          <div className="no-print relative mb-5 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search schemes..." className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-700" />
          </div>

          <div className="space-y-3">
            {visibleSchemes.map(scheme => (
              <article key={scheme.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${scheme.tone}`}>
                    <scheme.icon size={32} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-slate-900">{scheme.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{scheme.ministry}</p>
                    <p className="mt-1 text-sm text-slate-600">{scheme.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={scheme.status} />
                    <button onClick={() => setSelectedScheme(scheme)} className="rounded-lg border border-emerald-800 px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">
                      View Details
                    </button>
                    <button onClick={() => toggleSaved(scheme.id)} aria-label="Save scheme" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100">
                      <Bookmark size={20} fill={saved.includes(scheme.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {visibleSchemes.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">No schemes found.</div>
            )}
          </div>

          <div className="no-print mt-6 flex justify-between border-t border-slate-200 pt-5">
            <button onClick={() => navigate("/eligibility")} className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <span className="inline-flex items-center gap-2"><ArrowLeft size={17} /> Edit Answers</span>
            </button>
            <button onClick={() => navigate("/eligibility")} className="rounded-lg border border-emerald-800 px-5 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">
              Start Again
            </button>
          </div>
        </>
      )}
    </div>
  );
}
