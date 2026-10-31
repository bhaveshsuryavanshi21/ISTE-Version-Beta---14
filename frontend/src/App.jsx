import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import DiscoverSchemes from "./pages/DiscoverSchemes";
import Eligibility from "./pages/Eligibility";
import Results from "./pages/Results";
import Help from "./pages/Help";
import Assistant from "./pages/Assistant";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/schemes" element={<DiscoverSchemes />} />
        <Route path="/eligibility" element={<Eligibility />} />
        <Route path="/results" element={<Results />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
