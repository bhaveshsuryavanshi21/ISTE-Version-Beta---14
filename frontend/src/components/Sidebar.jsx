import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Compass,
  ClipboardList,
  ChartNoAxesCombined,
  CircleHelp,
  ChevronRight,
  UserRound,
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
    guest: "Guest User",
    prototype: "Jan Sahayak Prototype",
    preferredLanguage: "Preferred Language",
    logoAlt: "Jan Sahayak Government Schemes",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    schemes: "योजनाएँ देखें",
    eligibility: "पात्रता जाँचें",
    results: "मेरे परिणाम",
    help: "सहायता और गोपनीयता",
    profile: "प्रोफ़ाइल और भाषा",
    guest: "अतिथि उपयोगकर्ता",
    prototype: "जन सहायक प्रोटोटाइप",
    preferredLanguage: "पसंदीदा भाषा",
    logoAlt: "जन सहायक सरकारी योजनाएँ",
  },
};

export default function Sidebar({
  isOpen,
  closeSidebar,
  language = "en",
  onLanguageChange,
}) {
  const [profileOpen, setProfileOpen] = useState(false);

  const labels = translations[language] || translations.en;

  // Sidebar active item styling
  const sidebarLinkStyle = ({ isActive }) =>
    `flex items-center gap-5 rounded-lg px-6 py-4 font-medium transition-all duration-200 ${
      isActive
        ? "border-l-[3px] border-orange-500 bg-orange-50 text-orange-700"
        : "border-l-[3px] border-transparent text-slate-800 hover:bg-slate-50"
    }`;

  return (
    <aside
      className={`relative fixed left-0 top-0 z-50 flex h-screen w-[305px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* Logo Section */}
      <div className="flex h-[145px] items-center justify-center border-b border-slate-200 px-4">
        <img
          src="/jansahayak-logo.png"
          alt={labels.logoAlt}
          className="w-full max-h-[135px] object-contain"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5">
        <div className="space-y-2">
          {navigationLinks.map(({ key, path, icon: Icon }) => (
            <NavLink
              key={key}
              to={path}
              end={path === "/"}
              onClick={closeSidebar}
              className={sidebarLinkStyle}
            >
              <Icon size={25} />
              {labels[key]}
            </NavLink>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-7 border-t border-slate-200 pt-5">
          <NavLink
            to="/help"
            onClick={closeSidebar}
            className={sidebarLinkStyle}
          >
            <CircleHelp size={25} />
            {labels.help}
          </NavLink>
        </div>
      </nav>

      {/* Profile Menu */}
      {profileOpen && (
        <div className="absolute bottom-[115px] left-4 right-4 z-50 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-700">
              <UserRound size={23} />
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                {labels.guest}
              </p>
              <p className="text-xs text-slate-500">
                {labels.prototype}
              </p>
            </div>
          </div>

          <div className="pt-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {labels.preferredLanguage}
            </label>

            <select
              value={language}
              onChange={(e) => {
                onLanguageChange?.(e.target.value);
                setProfileOpen(false);
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
        </div>
      )}

      {/* Clickable Profile Footer */}
      <button
        type="button"
        onClick={() => setProfileOpen((previous) => !previous)}
        aria-expanded={profileOpen}
        className="flex h-[105px] shrink-0 items-center gap-4 border-t border-slate-200 px-7 text-left hover:bg-slate-50"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-700">
          <UserRound size={24} />
        </div>

        <span className="flex-1 font-medium text-slate-800">
          {labels.profile}
        </span>

        <ChevronRight
          size={22}
          className={`text-slate-500 transition-transform ${
            profileOpen ? "rotate-90" : ""
          }`}
        />
      </button>
    </aside>
  );
}