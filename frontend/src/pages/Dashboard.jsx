
import {
  Home, ChevronRight, Search, Landmark,
  ArrowRight, FileText, Folder
} from "lucide-react";
import { Link } from "react-router-dom";

const activities = [
  {
    title: "PM-KISAN – Eligibility Check",
    description: "Checked eligibility",
    date: "28 Oct 2026",
    status: "Completed",
    icon: FileText,
  },
  {
    title: "Document Checklist – PM-KISAN",
    description: "2 of 4 documents marked",
    date: "25 Oct 2026",
    status: "In progress",
    icon: Folder,
  },
  {
    title: "Ladli Behna Yojana – Viewed Details",
    description: "Viewed scheme details",
    date: "22 Oct 2026",
    status: "",
    icon: FileText,
  },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-[1500px]">

      {/* Breadcrumb */}
      <div className="mb-5 flex items-center gap-2 text-slate-500">
        <Home size={17} />
        Home
        <ChevronRight size={17} />
        <span className="text-slate-900">Dashboard</span>
      </div>

      {/* Welcome */}
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome!
        </h1>
        <p className="mt-2 text-lg text-slate-500">
          Discover government schemes and check your eligibility.
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
                Check schemes for me
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Answer a few questions to find schemes
                you may qualify for.
              </p>
            </div>
          </div>

          <Link
            to="/eligibility"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700"
          >
            Get Started <ArrowRight size={18} />
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
                Explore all schemes
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Browse Central and State government
                schemes.
              </p>
            </div>
          </div>

          <Link
            to="/schemes"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-600 bg-white py-3 text-sm font-semibold text-blue-600 transition-all duration-200 hover:bg-blue-50"
          >
            Browse Schemes <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
          <h2 className="text-xl font-bold text-slate-900">
            Recent Activity
          </h2>
          <Link to="/results" className="font-medium text-blue-600">
            View all
          </Link>
        </div>

        <div className="px-5">
          {activities.map((activity, index) => {
            const Icon = activity.icon;

            return (
              <div
                key={index}
                className="flex flex-wrap items-center gap-4 border-b border-slate-200 py-4 last:border-0"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <Icon size={27} className="text-blue-600" />
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
                  {activity.status && (
                    <span className={`inline-block rounded-xl px-4 py-2 text-sm font-medium ${
                      activity.status === "Completed"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {activity.status}
                    </span>
                  )}
                </div>

                <ChevronRight size={22} className="text-slate-500" />
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
