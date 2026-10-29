import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { useStore } from "../context/Store";
export default function Auth({ registerMode = false }) {
  const { login, register } = useStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (registerMode && form.name.trim().length < 2)
      return setError("Name must be at least 2 characters");
    if (registerMode && form.password !== form.confirm)
      return setError("Passwords do not match");
    if (form.password.length < 8)
      return setError("Password must be at least 8 characters");
    try {
      registerMode
        ? register(form.name.trim(), form.email.trim(), form.password)
        : login(form.email.trim(), form.password);
      navigate(
        params.get("next")?.startsWith("/") &&
          !params.get("next")?.startsWith("//")
          ? params.get("next")
          : "/",
      );
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="shell py-14 max-w-xl">
      <div className="panel p-7 sm:p-10">
        <div className="flex justify-center mb-5">
          <div className="bg-emerald-600 rounded-2xl p-4 text-white">
            <Leaf size={29} />
          </div>
        </div>
        <h1 className="text-3xl font-black text-center">
          {registerMode ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-slate-500 text-center mt-2 mb-8">
          {registerMode
            ? "Join Evergreen and start shopping"
            : "Sign in to continue your shopping journey"}
        </p>
        <form onSubmit={submit} className="space-y-5">
          {registerMode && (
            <label className="block">
              <span className="text-sm font-bold block mb-2">Full name</span>
              <input
                required
                className="field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
              />
            </label>
          )}
          <label className="block">
            <span className="text-sm font-bold block mb-2">Email address</span>
            <input
              required
              type="email"
              className="field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold block mb-2">Password</span>
            <div className="relative">
              <input
                required
                minLength={8}
                type={show ? "text" : "password"}
                className="field !pr-12"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                onClick={() => setShow((v) => !v)}
                className="absolute right-4 top-3.5 text-slate-400"
              >
                {show ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </label>
          {registerMode && (
            <label className="block">
              <span className="text-sm font-bold block mb-2">
                Confirm password
              </span>
              <input
                required
                type={show ? "text" : "password"}
                className="field"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Confirm password"
              />
            </label>
          )}
          {error && (
            <p
              role="alert"
              className="text-sm text-red-600 bg-red-50 p-3 rounded-xl"
            >
              {error}
            </p>
          )}
          <button className="btn-primary w-full">
            {registerMode ? "Create account" : "Sign in"}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">
          {registerMode ? "Already have an account?" : "New to Evergreen?"}{" "}
          <Link
            className="font-bold text-emerald-700"
            to={registerMode ? "/login" : "/register"}
          >
            {registerMode ? "Sign in" : "Create an account"}
          </Link>
        </p>
        {!registerMode && (
          <div className="bg-emerald-50 rounded-xl p-4 mt-7 text-xs text-emerald-900">
            <b>Admin demo:</b> admin@evergreen.in / Admin@123
            <br />
            Customer accounts can be created via registration.
          </div>
        )}
      </div>
    </div>
  );
}
