import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./context/Store";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";

function Guard({ children, admin = false }) {
  const { user } = useStore();
  const loc = useLocation();

  if (!user)
    return (
      <Navigate
        to={"/login?next=" + encodeURIComponent(loc.pathname)}
        replace
      />
    );

  if (admin && user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  const location = useLocation();

  // Automatically scroll to top whenever the page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.18 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/checkout"
              element={
                <Guard>
                  <Checkout />
                </Guard>
              }
            />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth registerMode />} />
            <Route
              path="/profile"
              element={
                <Guard>
                  <Profile />
                </Guard>
              }
            />
            <Route
              path="/orders"
              element={
                <Guard>
                  <Orders />
                </Guard>
              }
            />
            <Route
              path="/admin"
              element={
                <Guard admin>
                  <Admin />
                </Guard>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
