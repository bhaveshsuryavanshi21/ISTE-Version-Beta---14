
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  const [language, setLanguage] = useState("en");

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
      />

      <main className="mx-auto max-w-7xl px-5 py-8">
        <Outlet context={{ language }} />
      </main>
    </div>
  );
}
