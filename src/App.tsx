import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import { Storefront } from "./components/Storefront";
import { AdminDashboard } from "./components/AdminDashboard";
import { Cart } from "./components/Cart";
import { ShoppingCart, User, Home } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "cart" | "admin">("home");
  const [sessionId, setSessionId] = useState<string>("");
  const cartItems = useQuery(api.cart.getCart, { sessionId });
  const isAdmin = useQuery(api.admin.isAdmin);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  useEffect(() => {
    // Generate session ID for anonymous users
    if (!sessionId) {
      setSessionId(Math.random().toString(36).substring(2, 15));
    }
  }, [sessionId]);

  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-base-100/95 backdrop-blur supports-[backdrop-filter]:bg-base-100/60 border-b border-base-300">
        <div className="navbar max-w-7xl mx-auto px-4">
          <div className="navbar-start">
            <h1 className="text-2xl font-bold text-primary">merchStore</h1>
          </div>
          <div className="navbar-center hidden md:flex">
            <div className="tabs tabs-boxed bg-base-200">
              <button
                onClick={() => setCurrentView("home")}
                className={`tab ${currentView === "home" ? "tab-active" : ""}`}
              >
                <Home size={16} className="mr-2" />
                Home
              </button>
              <button
                onClick={() => setCurrentView("cart")}
                className={`tab ${currentView === "cart" ? "tab-active" : ""} indicator`}
              >
                <ShoppingCart size={16} className="mr-2" />
                Cart
                {cartItemCount > 0 && (
                  <span className="indicator-item badge badge-secondary badge-sm">
                    {cartItemCount}
                  </span>
                )}
              </button>
              {(isAdmin || !loggedInUser) && (
                <button
                  onClick={() => setCurrentView("admin")}
                  className={`tab ${currentView === "admin" ? "tab-active" : ""}`}
                >
                  <User size={16} className="mr-2" />
                  Admin
                </button>
              )}
            </div>
          </div>
          <div className="navbar-end">
            <Authenticated>
              <div className="flex items-center gap-4">
                <span className="text-sm opacity-75">
                  {loggedInUser?.email}
                </span>
                <SignOutButton />
              </div>
            </Authenticated>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {currentView === "home" && <Storefront sessionId={sessionId} />}
        {currentView === "cart" && <Cart sessionId={sessionId} />}
        {currentView === "admin" && (
          <Authenticated>
            <AdminDashboard />
          </Authenticated>
        )}
        {currentView === "admin" && (
          <Unauthenticated>
            <div className="card max-w-md mx-auto mt-16 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title justify-center">Admin Login</h2>
                <SignInForm />
              </div>
            </div>
          </Unauthenticated>
        )}
      </main>

      <Toaster />
    </div>
  );
}
