import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  IndianRupee,
  Search,
  X,
} from "lucide-react";
import { useStore } from "../context/Store";
import { money, id } from "../utils/storage";
const blank = {
  name: "",
  category: "Electronics",
  price: "",
  oldPrice: "",
  rating: "4.5",
  stock: "",
  image: "",
  description: "",
};
export default function Admin() {
  const { products, orders, saveProduct, deleteProduct } = useStore();
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState(blank);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const open = (p) => {
    setEdit(p?.id || "new");
    setForm(p ? { ...p } : blank);
    setError("");
  };
  const submit = (e) => {
    e.preventDefault();
    const price = Number(form.price),
      oldPrice = Number(form.oldPrice),
      stock = Number(form.stock),
      rating = Number(form.rating);
    if (
      !form.name.trim() ||
      !form.category.trim() ||
      !form.description.trim() ||
      !form.image.trim()
    )
      return setError("Please complete all fields");
    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isFinite(oldPrice) ||
      oldPrice < price ||
      !Number.isInteger(stock) ||
      stock < 0 ||
      rating < 0 ||
      rating > 5
    )
      return setError("Check price, original price, stock and rating values");
    saveProduct({
      ...form,
      id: edit === "new" ? id() : form.id,
      price,
      oldPrice,
      stock,
      rating,
    });
    setEdit(null);
  };
  const visible = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="shell py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <span className="pill">STORE ADMINISTRATION</span>
          <h1 className="section-title mt-3">Product management</h1>
          <p className="text-slate-500 mt-2">
            Manage your inventory and store catalogue.
          </p>
        </div>
        <button className="btn-primary" onClick={() => open()}>
          <Plus size={19} /> Add product
        </button>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          [Package, "Total products", products.length],
          [
            IndianRupee,
            "Inventory value",
            money(products.reduce((s, p) => s + p.price * p.stock, 0)),
          ],
          [Package, "Orders placed", orders.length],
        ].map(([Icon, label, value]) => (
          <div key={label} className="panel p-6 flex gap-4 items-center">
            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl">
              <Icon />
            </div>
            <div>
              <p className="text-slate-500 text-sm">{label}</p>
              <p className="text-2xl font-black mt-1">{value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="panel overflow-hidden">
        <div className="p-5 border-b flex flex-wrap justify-between gap-4 items-center">
          <h2 className="font-extrabold text-lg">
            All products ({visible.length})
          </h2>
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-3 text-slate-400"
            />
            <input
              className="field !py-2 !pl-10"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover bg-emerald-50"
                      />
                      <span className="font-bold max-w-[230px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4 font-bold">{money(p.price)}</td>
                  <td className="p-4">
                    <span
                      className={
                        p.stock < 5
                          ? "text-red-600 font-bold"
                          : "text-emerald-700"
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        className="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50"
                        onClick={() => open(p)}
                        aria-label={"Edit " + p.name}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                        onClick={() => setDeleteId(p.id)}
                        aria-label={"Delete " + p.name}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && (
            <p className="text-center text-slate-500 p-12">
              No matching products.
            </p>
          )}
        </div>
      </div>
      {edit !== null && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 p-4 flex items-center justify-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEdit(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Product editor"
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-white border-b p-5 flex justify-between items-center z-10">
              <h2 className="text-xl font-extrabold">
                {edit === "new" ? "Add new product" : "Edit product"}
              </h2>
              <button onClick={() => setEdit(null)} aria-label="Close editor">
                <X />
              </button>
            </div>
            <form onSubmit={submit} className="p-6 grid sm:grid-cols-2 gap-4">
              {[
                ["name", "Product name"],
                ["category", "Category"],
                ["price", "Price (₹)"],
                ["oldPrice", "Original price (₹)"],
                ["rating", "Rating (0–5)"],
                ["stock", "Stock quantity"],
                ["image", "Image URL"],
                ["description", "Description"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className={
                    ["name", "image", "description"].includes(key)
                      ? "sm:col-span-2"
                      : ""
                  }
                >
                  <span className="text-sm font-bold block mb-2">{label}</span>
                  {key === "description" ? (
                    <textarea
                      required
                      className="field min-h-24"
                      value={form[key]}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [key]: e.target.value }))
                      }
                    />
                  ) : (
                    <input
                      required
                      type={
                        ["price", "oldPrice", "rating", "stock"].includes(key)
                          ? "number"
                          : key === "image"
                            ? "url"
                            : "text"
                      }
                      min={
                        ["price", "oldPrice", "stock", "rating"].includes(key)
                          ? 0
                          : undefined
                      }
                      max={key === "rating" ? 5 : undefined}
                      step={
                        key === "rating"
                          ? "0.1"
                          : ["price", "oldPrice"].includes(key)
                            ? "0.01"
                            : "1"
                      }
                      className="field"
                      value={form[key]}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [key]: e.target.value }))
                      }
                    />
                  )}
                </label>
              ))}
              {error && (
                <p className="text-red-600 text-sm sm:col-span-2">{error}</p>
              )}
              <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setEdit(null)}
                >
                  Cancel
                </button>
                <button className="btn-primary">Save product</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 p-4 flex items-center justify-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Confirm deletion"
            className="panel max-w-sm p-7"
          >
            <h2 className="text-xl font-extrabold">Delete this product?</h2>
            <p className="text-slate-500 mt-2 text-sm">
              This action removes it from the catalogue and any shopping carts.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button className="btn-outline" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button
                className="btn bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  deleteProduct(deleteId);
                  setDeleteId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
