import { Link, useSearchParams } from "react-router-dom";
import { PackageCheck } from "lucide-react";
import { useStore } from "../context/Store";
import { money } from "../utils/storage";
export default function Orders() {
  const { orders, user } = useStore();
  const [params] = useSearchParams();
  const mine = orders.filter((o) => o.userId === user.id);
  return (
    <div className="shell py-12 max-w-5xl">
      <h1 className="section-title mb-7">My orders</h1>
      {params.get("placed") && (
        <div className="bg-emerald-100 border border-emerald-200 text-emerald-900 p-5 rounded-xl mb-6 flex items-center gap-3">
          <PackageCheck size={26} />
          <div>
            <b>Order placed successfully!</b>
            <p className="text-sm">Order reference: {params.get("placed")}</p>
          </div>
        </div>
      )}
      {!mine.length ? (
        <div className="panel text-center py-20">
          <PackageCheck className="mx-auto text-emerald-300 mb-4" size={55} />
          <h2 className="font-bold text-xl">No orders yet</h2>
          <p className="text-slate-500 mt-2 mb-6">
            Once you place an order, it will appear here.
          </p>
          <Link to="/products" className="btn-primary">
            Explore products
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {mine.map((o) => (
            <article key={o.id} className="panel overflow-hidden">
              <div className="bg-emerald-50 p-5 flex flex-wrap gap-3 justify-between">
                <div>
                  <b>{o.id}</b>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(o.date).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-right">
                  <span className="pill">{o.status}</span>
                  <p className="font-extrabold text-emerald-800 mt-1">
                    {money(o.total)}
                  </p>
                </div>
              </div>
              <div className="p-5 space-y-3">
                {o.items.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 text-sm font-semibold">
                      {item.name}
                      <p className="text-xs text-slate-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <b className="text-sm">
                      {money(item.price * item.quantity)}
                    </b>
                  </div>
                ))}
                <p className="text-xs text-slate-500 border-t pt-3">
                  Deliver to: {o.address.name}, {o.address.address},{" "}
                  {o.address.city}, {o.address.state} - {o.address.pincode}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
