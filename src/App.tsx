import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Storefront } from "./components/Storefront";
import { AdminDashboard } from "./components/AdminDashboard";
import { Cart } from "./components/Cart";
import { ShoppingCart, User, Home } from "lucide-react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ProductPage } from "./components/ProductPage";
import { getOrCreateSessionId } from "./lib/utils";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderLayout />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/cart" element={<CartRoute />} />
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="/product/:id" element={<ProductRoute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

function HeaderLayout() {
  const sessionId = getOrCreateSessionId();
  const cartItems = useQuery(api.cart.getCart, { sessionId });
  const isAdmin = useQuery(api.admin.isAdmin);
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const searchQuery = searchParams.get("q") || "";

  const onSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    setSearchParams(params, { replace: location.pathname !== "/" });
    if (location.pathname !== "/") navigate({ pathname: "/", search: params.toString() });
  };

  return (
    <header className="sticky top-0 z-10 bg-base-100/95 backdrop-blur supports-[backdrop-filter]:bg-base-100/60 border-b border-base-300">
      <div className="navbar max-w-7xl mx-auto px-4">
        <div className="navbar-start">
          <Link to="/" className="text-2xl font-bold text-primary">merchStore</Link>
        </div>
        <div className="navbar-center hidden md:flex">
          <div className="tabs tabs-boxed bg-base-200">
            <NavLink to="/" className={({ isActive }) => `tab ${isActive ? "tab-active" : ""}`} end>
              <Home size={16} className="mr-2" />
              Home
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => `tab ${isActive ? "tab-active" : ""} indicator`}>
              <ShoppingCart size={16} className="mr-2" />
              Cart
              {cartItemCount > 0 && (
                <span className="indicator-item badge badge-secondary badge-sm">{cartItemCount}</span>
              )}
            </NavLink>
            {(isAdmin || !loggedInUser) && (
              <NavLink to="/admin" className={({ isActive }) => `tab ${isActive ? "tab-active" : ""}`}>
                <User size={16} className="mr-2" />
                Admin
              </NavLink>
            )}
          </div>
        </div>
        <div className="navbar-end gap-3 items-center">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search products..."
              className="input input-bordered w-40 md:w-64"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Authenticated>
            <div className="flex items-center gap-4">
              <span className="text-sm opacity-75">{loggedInUser?.email}</span>
              <SignOutButton />
            </div>
          </Authenticated>
        </div>
      </div>
    </header>
  );
}

function HomeRoute() {
  return <Storefront />;
}

function CartRoute() {
  const sessionId = getOrCreateSessionId();
  return <Cart sessionId={sessionId} />;
}

function AdminRoute() {
  return (
    <>
      <Authenticated>
        <AdminDashboard />
      </Authenticated>
      <Unauthenticated>
        <div className="card max-w-md mx-auto mt-16 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center">Admin Login</h2>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </>
  );
}

function ProductRoute() {
  return <ProductPage />;
}

function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-2">Page not found</h2>
      <p className="opacity-70">The page you are looking for does not exist.</p>
    </div>
  );
}
