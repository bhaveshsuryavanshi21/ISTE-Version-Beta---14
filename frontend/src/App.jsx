
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import DiscoverSchemes from "./pages/DiscoverSchemes";
import SchemeDetails from "./pages/SchemeDetails";
import Eligibility from "./pages/Eligibility";
import Results from "./pages/Results";
import Help from "./pages/Help";
import Assistant from "./pages/Assistant";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/schemes" element={<DiscoverSchemes />} />
        <Route path="/schemes/:schemeId" element={<SchemeDetails />} />
        <Route path="/eligibility" element={<Eligibility />} />
        <Route path="/results" element={<Results />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/help" element={<Help />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
