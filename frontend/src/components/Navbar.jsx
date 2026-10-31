
import { NavLink } from "react-router-dom";

export default function Navbar({ language, onLanguageChange }) {
  const hindi = language === "hi";

  const links = [
    { path: "/", label: hindi ? "होम" : "Home" },
    {
      path: "/eligibility",
      label: hindi ? "पात्रता जाँचें" : "Check Eligibility",
    },
    {
      path: "/schemes",
      label: hindi ? "सभी योजनाएँ" : "All Schemes",
    },
    { path: "/help", label: hindi ? "सहायता" : "Help" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3">
        <NavLink to="/" className="text-2xl font-bold tracking-tight text-emerald-900">
          JanSahayak
        </NavLink>

        <nav className="flex flex-wrap items-center gap-5">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-emerald-800"
                    : "text-slate-600 hover:text-emerald-800"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <select
            value={language}
            onChange={(event) => onLanguageChange(event.target.value)}
            aria-label="Select language"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-700"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </nav>
      </div>
    </header>
  );
}
