
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await signOut();

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/");
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-600">
        Loading account...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-600">Please login to view your account.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 rounded-lg bg-emerald-800 px-6 py-2 text-white"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-emerald-900">
          My Account
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your JanSahayak account.
        </p>

        <div className="mt-8 rounded-xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Registered Email</p>
          <p className="mt-1 font-semibold text-slate-800">
            {user.email}
          </p>
        </div>

        <div className="mt-6">
          <p className="text-sm text-slate-500">Account ID</p>
          <p className="mt-1 break-all text-sm text-slate-700">
            {user.id}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
