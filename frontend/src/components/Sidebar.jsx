import { NavLink } from "react-router-dom";
import {
  Home,
  Compass,
  ClipboardList,
  ChartNoAxesCombined,
  CircleHelp,
  ChevronRight,
} from "lucide-react";

const navigationLinks = [
  { key: "dashboard", path: "/", icon: Home },
  { key: "schemes", path: "/schemes", icon: Compass },
  { key: "eligibility", path: "/eligibility", icon: ClipboardList },
  { key: "results", path: "/results", icon: ChartNoAxesCombined },
];

const translations = {
  en: {
    dashboard: "Dashboard",
    schemes: "Discover Schemes",
    eligibility: "Check Eligibility",
    results: "My Results",
    help: "Help & Privacy",
    profile: "Profile & Language",
    logoAlt: "Jan Sahayak Government Schemes",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    schemes: "योजनाएँ देखें",
    eligibility: "पात्रता जाँचें",
    results: "मेरे परिणाम",
    help: "सहायता और गोपनीयता",
    profile: "प्रोफ़ाइल और भाषा",
    logoAlt: "जन सहायक सरकारी योजनाएँ",
  },
};

export default function Sidebar({
  isOpen,
  closeSidebar,
  language = "en",
}) {
  const labels = translations[language] || translations.en;

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen w-[305px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="flex h-[145px] items-center justify-center border-b border-slate-200 px-4">
        <img
          src="/jansahayak-logo.png"
          alt={labels.logoAlt}
          className="w-full max-h-[135px] object-contain"
        />
      </div>

      <nav className="flex-1 px-3 py-5">
        <div className="space-y-2">
          {navigationLinks.map(({ key, path, icon: Icon }) => (
            <NavLink
              key={key}
              to={path}
              end={path === "/"}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-5 rounded-lg px-6 py-4 font-medium transition ${
                  isActive
                    ? "border-l-[3px] border-blue-600 bg-blue-50 text-blue-600"
                    : "text-slate-800 hover:bg-slate-50"
                }`
              }
            >
              <Icon size={25} />
              {labels[key]}
            </NavLink>
          ))}
        </div>

        <div className="mt-7 border-t border-slate-200 pt-5">
          <NavLink
            to="/help"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-5 rounded-lg px-6 py-4 font-medium transition ${
                isActive
                  ? "border-l-[3px] border-blue-600 bg-blue-50 text-blue-600"
                  : "text-slate-800 hover:bg-slate-50"
              }`
            }
          >
            <CircleHelp size={25} />
            {labels.help}
          </NavLink>
        </div>
      </nav>

      <div className="flex h-[105px] items-center gap-4 border-t border-slate-200 px-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">
          U
        </div>
        <span className="flex-1 font-medium">{labels.profile}</span>
        <ChevronRight size={22} className="text-slate-500" />
      </div>
    </aside>
  );
}
