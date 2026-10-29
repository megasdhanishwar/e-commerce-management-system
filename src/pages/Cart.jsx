import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowRight, ShoppingCart } from "lucide-react";
import { useStore } from "../context/Store";
import { money } from "../utils/storage";
export default function Cart() {
  const {
    cartItems,
    subtotal,
    shipping,
    total,
    updateQuantity,
    removeCart,
    user,
  } = useStore();
  const navigate = useNavigate();
  return (
    <div className="shell py-12">
      <h1 className="section-title mb-8">
        Your shopping cart{" "}
        <span className="text-emerald-600">({cartItems.length})</span>
      </h1>
      {!cartItems.length ? (
        <div className="panel text-center py-20">
          <ShoppingCart size={56} className="mx-auto text-emerald-300 mb-4" />
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-slate-500 mt-2 mb-6">
            Your next favourite is waiting for you.
          </p>
          <Link to="/products" className="btn-primary">
            Start shopping <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_350px] gap-7 items-start">
          <div className="space-y-4">
            {cartItems.map(({ id, quantity, product: p }) => (
              <div key={id} className="panel p-4 flex gap-4 sm:gap-6">
                <Link
                  to={"/products/" + id}
                  className="w-24 h-28 sm:w-36 sm:h-36 shrink-0 bg-emerald-50 rounded-xl overflow-hidden"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={"/products/" + id}
                    className="font-bold text-slate-900 hover:text-emerald-700 line-clamp-2"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-slate-500 mt-2">{p.category}</p>
                  <p className="font-black text-emerald-800 mt-2">
                    {money(p.price)}
                  </p>
                  <div className="flex items-center justify-between mt-3 gap-2">
                    <div className="flex items-center border rounded-lg">
                      <button
                        className="p-2"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          quantity === 1
                            ? removeCart(id)
                            : updateQuantity(id, quantity - 1)
                        }
                      >
                        <Minus size={15} />
                      </button>
                      <span className="px-2 text-sm font-bold">{quantity}</span>
                      <button
                        className="p-2"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(id, quantity + 1)}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                    <button
                      className="text-red-500 p-2 hover:bg-red-50 rounded-lg"
                      onClick={() => removeCart(id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="panel p-6 lg:sticky lg:top-28">
            <h2 className="text-xl font-extrabold mb-6">Order summary</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <b>{money(subtotal)}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shipping</span>
                <b className="text-emerald-700">
                  {shipping ? money(shipping) : "FREE"}
                </b>
              </div>
              <div className="border-t pt-4 flex justify-between text-lg">
                <b>Total</b>
                <b className="text-emerald-800">{money(total)}</b>
              </div>
            </div>
            <button
              className="btn-primary w-full mt-7"
              onClick={() =>
                navigate(user ? "/checkout" : "/login?next=/checkout")
              }
            >
              Proceed to checkout <ArrowRight size={18} />
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">
              Demo checkout · No real payment
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
