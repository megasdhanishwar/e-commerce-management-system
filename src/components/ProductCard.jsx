import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "../context/Store";
import { money } from "../utils/storage";
export default function ProductCard({ product }) {
  const { addCart } = useStore();
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="panel group overflow-hidden flex flex-col"
    >
      <Link
        to={"/products/" + product.id}
        className="relative bg-[#f1f7f3] aspect-[1.12] overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.style.fontSize = "5rem";
            e.currentTarget.parentElement.append(product.emoji || "🛍️");
          }}
        />
        <span className="absolute top-3 left-3 pill bg-white shadow-sm">
          {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
        </span>
      </Link>
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <span className="text-xs text-emerald-700 font-bold">
          {product.category}
        </span>
        <Link
          to={"/products/" + product.id}
          className="mt-2 font-bold text-slate-900 line-clamp-2 min-h-12 hover:text-emerald-700"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-1 mt-2 text-sm">
          <Star size={15} className="fill-amber-400 text-amber-400" />
          <b>{product.rating}</b>
          <span className="text-slate-400">· In stock: {product.stock}</span>
        </div>
        <div className="mt-auto pt-4 flex items-end justify-between gap-2">
          <div>
            <strong className="text-lg text-emerald-800">
              {money(product.price)}
            </strong>
            <div className="text-xs text-slate-400 line-through">
              {money(product.oldPrice)}
            </div>
          </div>
          <button
            disabled={!product.stock}
            onClick={() => addCart(product)}
            aria-label={"Add " + product.name + " to cart"}
            className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 disabled:opacity-40 shadow-lg shadow-emerald-100"
          >
            <ShoppingCart size={19} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
