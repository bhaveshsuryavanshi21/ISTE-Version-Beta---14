
import { NavLink } from "react-router-dom";
import {
  Landmark, Home, Compass, ClipboardList,
  ChartNoAxesCombined, CircleHelp, ChevronRight
} from "lucide-react";

const links = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Discover Schemes", path: "/schemes", icon: Compass },
  { name: "Check Eligibility", path: "/eligibility", icon: ClipboardList },
  { name: "My Results", path: "/results", icon: ChartNoAxesCombined },
];

export default function Sidebar({ isOpen, closeSidebar }) {
  return (
   
<aside className={`fixed left-0 top-0 z-50 flex h-screen w-[305px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
  isOpen ? "translate-x-0" : "-translate-x-full"
} lg:translate-x-0`}>


      <div className="flex h-[145px] items-center justify-center border-b border-slate-200 px-4">
      <img
      src="/jansahayak-logo.png"
      alt="JanSahayak Government Schemes"
      className="w-full max-h-[135px] object-contain"
      />
     </div>

      <nav className="flex-1 px-3 py-5">
        <div className="space-y-2">
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-5 rounded-lg px-6 py-4 font-medium transition ${
                  isActive
                    ? "border-l-[3px] border-blue-600 bg-blue-50 text-blue-600"
                    : "text-slate-800 hover:bg-slate-50"
                }`
              }
            >
              <Icon size={25} />
              {name}
            </NavLink>
          ))}
        </div>

        <div className="mt-7 border-t border-slate-200 pt-5">
          <NavLink
            to="/help"
            className="flex items-center gap-5 rounded-lg px-6 py-4 font-medium text-slate-800 hover:bg-slate-50"
          >
            <CircleHelp size={25} />
            Help & Privacy
          </NavLink>
        </div>
      </nav>

      <div className="flex h-[105px] items-center gap-4 border-t border-slate-200 px-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">
          U
        </div>
        <span className="flex-1 font-medium">Profile & Language</span>
        <ChevronRight size={22} className="text-slate-500" />
      </div>
    </aside>
  );
}
