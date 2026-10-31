
import { Mic, UserRound, Menu } from "lucide-react";

export default function TopNavbar({
  onMenuClick,
  language,
  onLanguageChange,
}) {
  return (
    <header className="sticky top-0 z-30 flex h-[73px] items-center justify-end gap-4 border-b border-slate-200 bg-white px-6">

      <button
        onClick={onMenuClick}
        className="mr-auto lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={25} />
      </button>

      <button className="flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50">
        <Mic size={19} />
        <span>Voice Assistant</span>
      </button>

      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        aria-label="Select language"
        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 outline-none"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
      </select>

      <button className="relative flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
        <UserRound size={25} />
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
      </button>

    </header>
  );
}
