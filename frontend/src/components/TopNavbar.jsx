import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, UserRound, Menu, ChevronRight } from "lucide-react";

export default function TopNavbar({
  onMenuClick,
  language,
  onLanguageChange,
}) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-[73px] items-center justify-end gap-4 border-b border-slate-200 bg-white px-6">

      {/* Mobile Menu */}
      <button
        onClick={onMenuClick}
        className="mr-auto lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={25} />
      </button>

      {/* Voice Assistant */}
      <button
        onClick={() => navigate("/eligibility")}
        className="flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50"
      >
        <Mic size={19} />
        <span>Voice Assistant</span>
      </button>

      {/* Language Selector */}
      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        aria-label="Select language"
        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 outline-none"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
      </select>

      {/* Profile Menu */}
      <div className="relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          aria-label="Open profile menu"
          aria-expanded={profileOpen}
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
        >
          <UserRound size={25} />

          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-14 z-50 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-700">
                G
              </div>

              <div>
                <p className="font-semibold text-slate-800">
                  Guest User
                </p>
                <p className="text-xs text-slate-500">
                  Jan Sahayak Prototype
                </p>
              </div>
            </div>

            <div className="py-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Preferred Language
              </label>

              <select
                value={language}
                onChange={(e) => {
                  onLanguageChange(e.target.value);
                  setProfileOpen(false);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>

            <button
              onClick={() => {
                setProfileOpen(false);
                navigate("/help");
              }}
              className="flex w-full items-center justify-between border-t border-slate-100 pt-3 text-sm text-slate-600 hover:text-blue-600"
            >
              Help & Privacy
              <ChevronRight size={17} />
            </button>

          </div>
        )}
      </div>

    </header>
  );
}