import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRound, LogOut, Package } from "lucide-react";
import { useStore } from "../context/Store";
export default function Profile() {
  const { user, updateProfile, logout, orders } = useStore();
  const [name, setName] = useState(user.name);
  const navigate = useNavigate();
  return (
    <div className="shell py-12 max-w-3xl">
      <h1 className="section-title mb-7">My profile</h1>
      <div className="panel p-7 sm:p-9">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-emerald-100 text-emerald-700 p-5 rounded-full">
            <UserRound size={32} />
          </div>
          <div>
            <h2 className="font-extrabold text-xl">{user.name}</h2>
            <p className="text-slate-500 text-sm">{user.email}</p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim().length >= 2) updateProfile(name.trim());
          }}
          className="space-y-4"
        >
          <label className="block text-sm font-bold">
            Display name
            <input
              required
              minLength={2}
              className="field mt-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="block text-sm font-bold">
            Email
            <input
              disabled
              className="field mt-2 bg-slate-50"
              value={user.email}
            />
          </label>
          <button className="btn-primary">Save changes</button>
        </form>
        <div className="border-t mt-8 pt-6 flex flex-wrap gap-3">
          <Link to="/orders" className="btn-outline">
            <Package size={17} /> My orders (
            {orders.filter((o) => o.userId === user.id).length})
          </Link>
          {user.role === "admin" && (
            <Link to="/admin" className="btn-outline">
              Admin dashboard
            </Link>
          )}
          <button
            className="btn-outline !text-red-600"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
