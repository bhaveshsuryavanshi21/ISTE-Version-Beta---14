
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar
        isOpen={menuOpen}
        closeSidebar={() => setMenuOpen(false)}
      />

      {/* Mobile sidebar */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="lg:ml-[305px]">
        <TopNavbar onMenuClick={() => setMenuOpen(true)} />

        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
