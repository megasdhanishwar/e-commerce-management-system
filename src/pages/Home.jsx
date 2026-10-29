import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Headphones,
  ShoppingBag,
} from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "../context/Store";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
export default function Home() {
  const { products } = useStore();
  const categories = [
    ["Electronics", "🎧"],
    ["Fashion", "👟"],
    ["Home & Living", "🏡"],
    ["Beauty", "✨"],
    ["Sports", "🏋️"],
  ];
  return (
    <>
      <section className="shell pt-8">
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#34b36c] text-white min-h-[390px] sm:min-h-[450px] flex items-center shadow-[0_25px_70px_rgba(5,150,105,.22)]">
          <div className="absolute -right-20 -top-28 w-[380px] h-[380px] bg-lime-300/20 blur-3xl rounded-full" />
          <div className="absolute right-[6%] bottom-[-60px] w-64 h-64 bg-white/10 rounded-full blur-xl" />
          <div className="relative z-10 p-8 sm:p-14 lg:p-20 max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-2 text-xs font-bold"
            >
              <Sparkles size={14} /> THE FRESH FINDS EDIT
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] mt-6"
            >
              Everyday finds.
              <br />
              <span className="text-lime-200">Extraordinary joy.</span>
            </motion.h1>
            <p className="text-emerald-50/85 mt-5 text-base sm:text-lg max-w-md">
              Explore thoughtful essentials, trending picks and exclusive deals,
              all in one place.
            </p>
            <Link
              to="/products"
              className="inline-flex mt-8 items-center gap-3 rounded-xl bg-white px-6 py-3.5 text-emerald-900 font-extrabold hover:bg-lime-100 transition shadow-xl"
            >
              Shop the collection <ArrowRight size={18} />
            </Link>
          </div>
          <div className="hidden lg:block absolute right-[8%] top-[23%] text-[150px] drop-shadow-2xl rotate-[-12deg]">
            🛍️
          </div>
        </div>
      </section>
      <section className="shell py-9">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {[
            [Truck, "Free shipping", "Above ₹999"],
            [ShieldCheck, "Secure shopping", "Trusted experience"],
            [RotateCcw, "Easy ordering", "Simple checkout"],
            [Headphones, "Friendly support", "Here to help"],
          ].map(([Icon, t, s]) => (
            <div key={t} className="panel p-4 flex items-center gap-3">
              <div className="bg-emerald-50 p-3 rounded-xl text-emerald-700">
                <Icon size={22} />
              </div>
              <div>
                <div className="font-bold text-sm">{t}</div>
                <div className="text-xs text-slate-500 mt-1">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="shell py-10">
        <SectionHeader
          eyebrow="Browse by category"
          title="Something for everyone"
          subtitle="Find the perfect pick for every part of your day."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(([cat, emoji]) => (
            <Link
              to={"/products?category=" + encodeURIComponent(cat)}
              key={cat}
              className="panel p-6 text-center hover:border-emerald-300 hover:-translate-y-1 transition-all"
            >
              <div className="text-5xl mb-4">{emoji}</div>
              <div className="font-bold">{cat}</div>
              <div className="text-xs text-emerald-600 mt-2">Explore →</div>
            </Link>
          ))}
        </div>
      </section>
      <section className="shell py-12">
        <div className="flex flex-wrap justify-between gap-3 items-end">
          <SectionHeader
            eyebrow="Customer favourites"
            title="Featured products"
            subtitle="Our best-loved products, handpicked for you."
          />
          <Link
            to="/products"
            className="text-emerald-700 font-bold flex gap-2 items-center mb-7"
          >
            View all products <ArrowRight size={17} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="shell py-10">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-100 to-lime-100 border border-emerald-200 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="pill inline-block mb-3">LIMITED-TIME PICKS</div>
            <h2 className="text-3xl font-black text-emerald-950">
              A little more joy, for less.
            </h2>
            <p className="text-emerald-900/70 mt-2">
              Explore offers across your favourite categories.
            </p>
          </div>
          <Link className="btn-primary shrink-0" to="/products">
            Explore deals <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
