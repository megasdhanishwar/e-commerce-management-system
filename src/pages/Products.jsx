import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useStore } from "../context/Store";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
export default function Products() {
  const { products } = useStore();
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState("featured");
  const [max, setMax] = useState(50000);
  const [mobileFilters, setMobileFilters] = useState(false);
  const query = params.get("q") || "";
  const category = params.get("category") || "All";
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const update = (key, value) => {
    const next = new URLSearchParams(params);
    value && value !== "All" ? next.set(key, value) : next.delete(key);
    setParams(next);
  };
  const filtered = useMemo(
    () =>
      products
        .filter(
          (p) =>
            (category === "All" || p.category === category) &&
            p.price <= max &&
            (p.name + " " + p.description + " " + p.category)
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "price-low"
            ? a.price - b.price
            : sort === "price-high"
              ? b.price - a.price
              : sort === "rating"
                ? b.rating - a.rating
                : 0,
        ),
    [products, category, max, query, sort],
  );
  return (
    <div className="shell py-10">
      <SectionHeader
        eyebrow="Explore the collection"
        title="Shop all products"
        subtitle="Discover quality essentials curated for everyday living."
      />
      <div className="flex flex-col lg:flex-row gap-7">
        <aside
          className={
            "lg:w-64 shrink-0 " + (mobileFilters ? "block" : "hidden lg:block")
          }
        >
          <div className="panel p-5 lg:sticky lg:top-28">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold flex gap-2 items-center">
                <SlidersHorizontal size={18} /> Filters
              </h3>
              <button
                className="lg:hidden"
                onClick={() => setMobileFilters(false)}
              >
                <X size={20} />
              </button>
            </div>
            <h4 className="font-bold text-sm mb-3">Category</h4>
            <div className="space-y-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => update("category", c)}
                  className={
                    "w-full text-left rounded-lg px-3 py-2.5 text-sm transition " +
                    (category === c
                      ? "bg-emerald-100 text-emerald-800 font-bold"
                      : "text-slate-600 hover:bg-slate-50")
                  }
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="border-t mt-6 pt-5">
              <label className="font-bold text-sm block mb-4">
                Maximum price: ₹{max.toLocaleString("en-IN")}
              </label>
              <input
                className="w-full accent-emerald-600"
                type="range"
                min="500"
                max="50000"
                step="500"
                value={max}
                onChange={(e) => setMax(+e.target.value)}
              />
            </div>
            <button
              className="text-sm text-emerald-700 font-bold mt-5"
              onClick={() => {
                setParams({});
                setMax(50000);
                setSort("featured");
              }}
            >
              Clear all filters
            </button>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
            <div className="relative flex-1 min-w-[180px] max-w-lg">
              <Search
                size={18}
                className="absolute left-4 top-3.5 text-slate-400"
              />
              <input
                className="field !pl-11"
                value={query}
                onChange={(e) => update("q", e.target.value)}
                placeholder="Search for anything..."
              />
            </div>
            <button
              onClick={() => setMobileFilters((x) => !x)}
              className="btn-outline lg:hidden !px-3"
            >
              <SlidersHorizontal size={18} />
            </button>
            <select
              className="field !w-auto max-w-full"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          <p className="text-slate-500 text-sm mb-5">
            Showing <b>{filtered.length}</b> products
          </p>
          {filtered.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="panel text-center py-20">
              <div className="text-5xl mb-4">🔎</div>
              <h3 className="font-bold text-xl">No products found</h3>
              <p className="text-slate-500 mt-2">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
