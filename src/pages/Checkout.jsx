import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../context/Store";
import { money } from "../utils/storage";
export default function Checkout() {
  const { cartItems, subtotal, shipping, total, user, placeOrder } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  if (!cartItems.length)
    return (
      <div className="shell py-20 text-center">
        <h1 className="section-title">Your cart is empty</h1>
        <Link to="/products" className="btn-primary mt-6">
          Shop now
        </Link>
      </div>
    );
  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Enter a valid 6-digit PIN code");
      return;
    }
    try {
      const orderId = placeOrder(form);
      navigate("/orders?placed=" + orderId);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="shell py-12">
      <h1 className="section-title mb-8">Secure checkout</h1>
      <div className="grid lg:grid-cols-[1fr_370px] gap-7 items-start">
        <form onSubmit={submit} className="panel p-6 sm:p-8">
          <h2 className="text-xl font-extrabold mb-6">Delivery information</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              ["name", "Full name"],
              ["email", "Email address"],
              ["phone", "Mobile number"],
              ["address", "Street address"],
              ["city", "City"],
              ["state", "State"],
              ["pincode", "PIN code"],
            ].map(([key, label]) => (
              <label
                key={key}
                className={key === "address" ? "sm:col-span-2" : ""}
              >
                <span className="block text-sm font-bold mb-2">{label}</span>
                <input
                  required
                  className="field"
                  type={key === "email" ? "email" : "text"}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [key]: e.target.value }))
                  }
                  placeholder={label}
                  minLength={key === "address" ? 8 : undefined}
                />
              </label>
            ))}
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 mt-6 text-sm text-emerald-900">
            <b>Payment method:</b> Cash on Delivery (demo only)
          </div>
          {error && (
            <p role="alert" className="text-red-600 mt-4 text-sm">
              {error}
            </p>
          )}
          <button className="btn-primary mt-6 w-full">
            Place order · {money(total)}
          </button>
        </form>
        <div className="panel p-6 lg:sticky lg:top-28">
          <h2 className="text-xl font-extrabold mb-5">Your order</h2>
          <div className="space-y-4">
            {cartItems.map((x) => (
              <div key={x.id} className="flex gap-3 items-center">
                <img
                  src={x.product.image}
                  alt=""
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold line-clamp-1">
                    {x.product.name}
                  </p>
                  <p className="text-xs text-slate-500">Qty {x.quantity}</p>
                </div>
                <b className="text-sm">{money(x.product.price * x.quantity)}</b>
              </div>
            ))}
          </div>
          <div className="border-t mt-5 pt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <b>{money(subtotal)}</b>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <b>{shipping ? money(shipping) : "FREE"}</b>
            </div>
            <div className="flex justify-between border-t pt-4 text-lg">
              <b>Total</b>
              <b className="text-emerald-800">{money(total)}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
