
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Password updated successfully!");
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-3xl font-bold text-emerald-900">
          Reset Password
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Enter your new password below.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
            {message}
          </p>
        )}

        <label className="mt-6 block text-sm font-medium text-slate-700">
          New Password
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
          placeholder="At least 6 characters"
        />

        <label className="mt-5 block text-sm font-medium text-slate-700">
          Confirm New Password
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
          placeholder="Enter password again"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-7 w-full rounded-lg bg-emerald-800 py-3 font-semibold text-white hover:bg-emerald-900 disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-600">
          <Link to="/login" className="font-semibold text-emerald-800">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}
