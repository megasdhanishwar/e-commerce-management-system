import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import {
  Star,
  ShoppingCart,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Minus,
  Plus,
} from "lucide-react";
import { useStore } from "../context/Store";
import { money } from "../utils/storage";
import ProductCard from "../components/ProductCard";
export default function ProductDetails() {
  const { id } = useParams();
  const { products, addCart } = useStore();
  const p = products.find((x) => String(x.id) === id);
  const [quantity, setQuantity] = useState(1);
  if (!p)
    return (
      <div className="shell py-24 text-center">
        <h1 className="section-title">Product not found</h1>
        <Link className="btn-primary mt-6" to="/products">
          Back to shop
        </Link>
      </div>
    );
  return (
    <div className="shell py-9">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-700 mb-6"
      >
        <ArrowLeft size={17} /> Back to products
      </Link>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
        <div className="panel overflow-hidden bg-emerald-50 aspect-square">
          <img
            className="w-full h-full object-cover"
            src={p.image}
            alt={p.name}
          />
        </div>
        <div className="py-3">
          <span className="pill">{p.category}</span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-5 leading-tight">
            {p.name}
          </h1>
          <div className="flex gap-2 items-center mt-4">
            <Star size={19} className="fill-amber-400 text-amber-400" />
            <b>{p.rating} / 5</b>
            <span className="text-slate-400">Customer favourite</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <strong className="text-4xl font-black text-emerald-800">
              {money(p.price)}
            </strong>
            <span className="line-through text-slate-400 text-lg">
              {money(p.oldPrice)}
            </span>
            <span className="pill">
              Save {Math.round((1 - p.price / p.oldPrice) * 100)}%
            </span>
          </div>
          <p className="mt-7 text-slate-600 leading-8">{p.description}</p>
          <div className="mt-7 font-semibold text-sm">
            {p.stock > 0 ? (
              <span className="text-emerald-700">
                ● In stock ({p.stock} available)
              </span>
            ) : (
              <span className="text-red-600">● Out of stock</span>
            )}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="inline-flex border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                className="p-3 hover:bg-emerald-50"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={19} />
              </button>
              <span className="px-5 py-3 font-bold">
                {Math.min(quantity, p.stock || 1)}
              </span>
              <button
                className="p-3 hover:bg-emerald-50"
                onClick={() => setQuantity((q) => Math.min(p.stock, q + 1))}
                aria-label="Increase quantity"
              >
                <Plus size={19} />
              </button>
            </div>
            <button
              disabled={!p.stock}
              className="btn-primary flex-1 min-w-[180px]"
              onClick={() => addCart(p, Math.min(quantity, p.stock))}
            >
              <ShoppingCart size={19} /> Add to cart
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-9">
            <div className="panel p-4 flex gap-3">
              <Truck className="text-emerald-700 shrink-0" />
              <div>
                <b className="text-sm">Fast delivery</b>
                <p className="text-xs text-slate-500 mt-1">Free over ₹999</p>
              </div>
            </div>
            <div className="panel p-4 flex gap-3">
              <ShieldCheck className="text-emerald-700 shrink-0" />
              <div>
                <b className="text-sm">Shop with confidence</b>
                <p className="text-xs text-slate-500 mt-1">
                  Secure demo checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <h2 className="section-title mb-7">You might also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products
            .filter((x) => x.id !== p.id)
            .slice(0, 4)
            .map((x) => (
              <ProductCard key={x.id} product={x} />
            ))}
        </div>
      </div>
    </div>
  );
}
