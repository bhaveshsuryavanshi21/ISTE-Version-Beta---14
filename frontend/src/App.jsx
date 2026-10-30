

import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import DiscoverSchemes from "./pages/DiscoverSchemes";
import Eligibility from "./pages/Eligibility";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />

        <Route path="/schemes" element={<DiscoverSchemes />} />

        <Route path="/eligibility" element={<Eligibility />} />

        <Route
          path="/results"
          element={<h1 className="text-2xl font-bold">My Results</h1>}
        />

        <Route
          path="/help"
          element={<h1 className="text-2xl font-bold">Help & Privacy</h1>}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
