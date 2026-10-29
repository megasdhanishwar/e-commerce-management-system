import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ShoppingCart,
  UserRound,
  Search,
  Menu,
  X,
  Leaf,
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  Instagram,
  Facebook,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "../context/Store";
export default function Layout({ children }) {
  const { cart, user, toast, logout } = useStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const nav = [
    ["/", "Home"],
    ["/products", "Shop All"],
    ["/orders", "My Orders"],
    ...(user?.role === "admin" ? [["/admin", "Admin"]] : []),
  ];
  const goSearch = (e) => {
    e.preventDefault();
    navigate("/products?q=" + encodeURIComponent(search));
    setOpen(false);
  };
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-emerald-950 text-white text-xs text-center py-2">
        ✨ Free delivery on orders over ₹999 · Discover your new favourites
      </div>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-emerald-100 shadow-sm">
        <div className="shell flex items-center gap-3 lg:gap-8 h-[76px]">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="bg-gradient-to-br from-emerald-500 to-green-700 p-2 rounded-xl text-white shadow-lg shadow-emerald-200">
              <Leaf size={24} />
            </span>
            <span className="text-xl font-black tracking-tight text-emerald-950">
              ever<span className="text-emerald-600">green.</span>
            </span>
          </Link>
          <nav className="hidden lg:flex gap-6 items-center text-sm font-semibold">
            {nav.map(([path, label]) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "text-emerald-700"
                    : "text-slate-600 hover:text-emerald-700"
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <form
            onSubmit={goSearch}
            className="hidden md:flex flex-1 max-w-md ml-auto relative"
          >
            <input
              className="field !py-2.5 !pl-11 bg-slate-50"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              size={18}
              className="absolute left-4 top-3 text-slate-400"
            />
          </form>
          <div className="ml-auto md:ml-0 flex items-center gap-1 sm:gap-3">
            <Link
              to={user ? "/profile" : "/login"}
              aria-label="Account"
              className="p-2.5 hover:bg-emerald-50 rounded-xl"
            >
              <UserRound size={22} />
            </Link>
            <Link
              to="/cart"
              aria-label="Shopping cart"
              className="relative p-2.5 hover:bg-emerald-50 rounded-xl"
            >
              <ShoppingCart size={23} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] min-w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((s, x) => s + x.quantity, 0)}
                </span>
              )}
            </Link>
            <button
              className="lg:hidden p-2.5 hover:bg-emerald-50 rounded-xl"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden shell pb-5 space-y-3">
            <form onSubmit={goSearch} className="flex gap-2">
              <input
                className="field"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn-primary" aria-label="Search">
                <Search size={19} />
              </button>
            </form>
            {nav.map(([path, label]) => (
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className="block py-2 font-semibold text-slate-700"
              >
                {label}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                  navigate("/");
                }}
                className="text-red-600 font-semibold"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-emerald-950 text-emerald-50 mt-20">
        <div className="shell py-12 grid gap-9 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="text-2xl font-black mb-3">🌿 evergreen.</div>
            <p className="text-emerald-100/70 max-w-sm leading-7">
              Discover products you love, curated for a better everyday shopping
              experience.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick links</h4>
            <div className="flex flex-col gap-3 text-emerald-100/70">
              <Link to="/products">Shop products</Link>
              <Link to="/cart">Shopping cart</Link>
              <Link to="/orders">My orders</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Why Evergreen?</h4>
            <p className="text-emerald-100/70 leading-8">
              Secure checkout
              <br />
              Fast delivery
              <br />
              Handpicked quality
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-emerald-100/60">
          © 2026 Evergreen. Frontend demo store · No real payments are
          processed.
        </div>
      </footer>
      {toast && (
        <div
          role="status"
          className="fixed z-50 bottom-6 right-4 left-4 sm:left-auto sm:min-w-72 bg-emerald-950 text-white px-5 py-4 rounded-xl shadow-2xl animate-[slideUp_.25s_ease-out]"
        >
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
