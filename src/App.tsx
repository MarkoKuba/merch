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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-blue-600">T-Shirt Store</h1>
              <nav className="hidden md:flex space-x-6">
                <button
                  onClick={() => setCurrentView("home")}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === "home"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Home size={16} />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => setCurrentView("cart")}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                    currentView === "cart"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <ShoppingCart size={16} />
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
                {(isAdmin || !loggedInUser) && (
                  <button
                    onClick={() => setCurrentView("admin")}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <User size={16} />
                    <span>Admin</span>
                  </button>
                )}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Authenticated>
                <span className="text-sm text-gray-600">
                  {loggedInUser?.email}
                </span>
                <SignOutButton />
              </Authenticated>
            </div>
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
            <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
              <SignInForm />
            </div>
          </Unauthenticated>
        )}
      </main>

      <Toaster />
    </div>
  );
}
