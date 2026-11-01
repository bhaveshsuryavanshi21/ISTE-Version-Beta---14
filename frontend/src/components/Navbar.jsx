
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ language, onLanguageChange }) {
  const hindi = language === "hi";
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

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
    {
      path: "/assistant",
      label: hindi ? "सहायक" : "Assistant",
    },
    { path: "/help", label: hindi ? "सहायता" : "Help" },
  ];

  const handleLogout = async () => {
    const { error } = await signOut();

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/");
  };

  const linkStyle = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-emerald-800"
        : "text-slate-600 hover:text-emerald-800"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3">
        
<NavLink to="/" className="flex items-center">
  <img
    src="/jansahayak-logo.png"
    alt="JanSahayak"
    className="h-12 w-auto max-w-[240px] object-contain"
  />
</NavLink>


        <nav className="flex flex-wrap items-center gap-5">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={linkStyle}
            >
              {link.label}
            </NavLink>
          ))}

          {!loading && (
            user ? (
              <>
                <NavLink to="/account" className={linkStyle}>
                  {hindi ? "मेरा खाता" : "My Account"}
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-red-600 hover:text-red-800"
                >
                  {hindi ? "लॉग आउट" : "Logout"}
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkStyle}>
                  {hindi ? "लॉगिन" : "Login"}
                </NavLink>

                <NavLink
                  to="/signup"
                  className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
                >
                  {hindi ? "खाता बनाएँ" : "Create Account"}
                </NavLink>
              </>
            )
          )}

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
