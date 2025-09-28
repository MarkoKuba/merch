import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus, Minus } from "lucide-react";
import { CheckoutModal } from "./CheckoutModal";

interface CartProps {
  sessionId: string;
}

export function Cart({ sessionId }: CartProps) {
  const cartItems = useQuery(api.cart.getCart, { sessionId });
  const updateQuantity = useMutation(api.cart.updateQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleQuantityChange = (itemId: any, newQuantity: number) => {
    updateQuantity({ itemId, quantity: newQuantity })
      .catch(() => toast.error("Failed to update quantity"));
  };

  const handleRemoveItem = (itemId: any) => {
    removeFromCart({ itemId })
      .then(() => toast.success("Item removed from cart"))
      .catch(() => toast.error("Failed to remove item"));
  };

  if (!cartItems) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
          <p className="text-base-content/70 mb-8">Your cart is empty</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary btn-wide"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <div className="divide-y divide-base-300">
            {cartItems.map((item) => (
              <div key={item._id} className="p-6 flex items-center gap-4">
                <img
                  src={item.product?.imageUrl}
                  alt={item.product?.name}
                  className="w-20 h-20 object-cover mask mask-squircle"
                />
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {item.product?.name}
                  </h3>
                  <p className="text-base-content/70">${item.product?.price.toFixed(2)} each</p>
                </div>
                
                <div className="join grid grid-cols-3">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="join-item btn btn-outline"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="join-item btn btn-outline">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="join-item btn btn-outline"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="text-lg font-semibold w-20 text-right">
                  ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                </div>
                
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="btn btn-ghost btn-circle text-error"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="bg-base-200 px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Subtotal:</span>
              <span className="text-2xl font-bold text-primary">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            
            <button
              onClick={() => setShowCheckout(true)}
              className="btn btn-primary btn-block btn-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          cartItems={cartItems}
          subtotal={subtotal}
          sessionId={sessionId}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}
