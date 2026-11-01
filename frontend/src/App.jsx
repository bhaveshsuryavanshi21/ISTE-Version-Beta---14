import ForgotPassword from "./pages/ForgotPassword";
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import DiscoverSchemes from "./pages/DiscoverSchemes";
import Eligibility from "./pages/Eligibility";
import Results from "./pages/Results";
import Help from "./pages/Help";
import Assistant from "./pages/Assistant";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Account from "./pages/Account";

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

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account" element={<Account />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
