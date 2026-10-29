import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { seedProducts } from "../data/products";
import { load, id } from "../utils/storage";
const Context = createContext(null);
export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() =>
    load("ev_products", seedProducts),
  );
  const [cart, setCart] = useState(() => load("ev_cart", []));
  const [users, setUsers] = useState(() => load("ev_users", []));
  const [user, setUser] = useState(() => load("ev_session", null));
  const [orders, setOrders] = useState(() => load("ev_orders", []));
  const [toast, setToast] = useState("");
  useEffect(() => {
    localStorage.setItem("ev_products", JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem("ev_cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("ev_users", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("ev_session", JSON.stringify(user));
  }, [user]);
  useEffect(() => {
    localStorage.setItem("ev_orders", JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);
  const notify = (msg) => setToast(msg);
  const addCart = (product, quantity = 1) => {
    if (product.stock < 1) return notify("Product is out of stock");
    setCart((prev) => {
      const existing = prev.find((x) => x.id === product.id);
      return existing
        ? prev.map((x) =>
            x.id === product.id
              ? {
                  ...x,
                  quantity: Math.min(product.stock, x.quantity + quantity),
                }
              : x,
          )
        : [
            ...prev,
            { id: product.id, quantity: Math.min(product.stock, quantity) },
          ];
    });
    notify("Added to your cart");
  };
  const updateQuantity = (productId, quantity) =>
    setCart((prev) =>
      prev.map((x) =>
        x.id === productId
          ? {
              ...x,
              quantity: Math.max(
                1,
                Math.min(
                  products.find((p) => p.id === productId)?.stock || 1,
                  quantity,
                ),
              ),
            }
          : x,
      ),
    );
  const removeCart = (productId) => {
    setCart((prev) => prev.filter((x) => x.id !== productId));
    notify("Item removed");
  };
  const cartItems = cart
    .map((x) => ({ ...x, product: products.find((p) => p.id === x.id) }))
    .filter((x) => x.product);
  const subtotal = cartItems.reduce(
    (s, x) => s + x.product.price * x.quantity,
    0,
  );
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const total = subtotal + shipping;
  const register = (name, email, password) => {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
      throw Error("Email already registered");
    const newUser = { id: id(), name, email, password, role: "customer" };
    setUsers((p) => [...p, newUser]);
    setUser({ id: newUser.id, name, email, role: "customer" });
    notify("Account created successfully");
  };
  const login = (email, password) => {
    if (email === "admin@evergreen.in" && password === "Admin@123") {
      setUser({ id: "admin", name: "Store Admin", email, role: "admin" });
      return;
    }
    const match = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );
    if (!match) throw Error("Invalid email or password");
    setUser({
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
    });
    notify("Welcome back!");
  };
  const logout = () => {
    setUser(null);
    notify("Logged out successfully");
  };
  const updateProfile = (name) => {
    setUser((p) => ({ ...p, name }));
    setUsers((p) => p.map((u) => (u.id === user.id ? { ...u, name } : u)));
    notify("Profile updated");
  };
  const placeOrder = (address) => {
    if (!user) throw Error("Please login first");
    if (!cartItems.length) throw Error("Your cart is empty");
    for (const x of cartItems) {
      if (x.quantity > x.product.stock)
        throw Error(`${x.product.name} has insufficient stock`);
    }
    const order = {
      id: "EV-" + Date.now().toString().slice(-8),
      userId: user.id,
      items: cartItems.map((x) => ({
        id: x.id,
        name: x.product.name,
        image: x.product.image,
        price: x.product.price,
        quantity: x.quantity,
      })),
      subtotal,
      shipping,
      total,
      address,
      date: new Date().toISOString(),
      status: "Confirmed",
    };
    setOrders((p) => [order, ...p]);
    setProducts((p) =>
      p.map((item) => ({
        ...item,
        stock: Math.max(
          0,
          item.stock - (cart.find((x) => x.id === item.id)?.quantity || 0),
        ),
      })),
    );
    setCart([]);
    notify("Order placed successfully!");
    return order.id;
  };
  const saveProduct = (product) => {
    setProducts((p) =>
      p.some((x) => x.id === product.id)
        ? p.map((x) => (x.id === product.id ? product : x))
        : [product, ...p],
    );
    notify("Product saved");
  };
  const deleteProduct = (productId) => {
    setProducts((p) => p.filter((x) => x.id !== productId));
    setCart((p) => p.filter((x) => x.id !== productId));
    notify("Product deleted");
  };
  const value = useMemo(
    () => ({
      products,
      cart,
      cartItems,
      subtotal,
      shipping,
      total,
      user,
      orders,
      toast,
      notify,
      addCart,
      updateQuantity,
      removeCart,
      register,
      login,
      logout,
      updateProfile,
      placeOrder,
      saveProduct,
      deleteProduct,
    }),
    [products, cart, user, orders, toast],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useStore = () => useContext(Context);
