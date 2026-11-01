
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const { error } = await resetPassword(email);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("If an account exists with this email, a password reset link will be sent.");
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-3xl font-bold text-emerald-900">
          Forgot Password?
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Enter your registered email address to receive a password reset link.
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
          Email Address
        </label>

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-7 w-full rounded-lg bg-emerald-800 py-3 font-semibold text-white hover:bg-emerald-900 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-600">
          Remember your password?{" "}
          <Link to="/login" className="font-semibold text-emerald-800">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
