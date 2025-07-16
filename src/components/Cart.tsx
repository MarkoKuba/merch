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

  const handleQuantityChange = async (itemId: any, newQuantity: number) => {
    try {
      await updateQuantity({ itemId, quantity: newQuantity });
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId: any) => {
    try {
      await removeFromCart({ itemId });
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  if (!cartItems) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
          <p className="text-gray-600 mb-8">Your cart is empty</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <div key={item._id} className="p-6 flex items-center space-x-4">
              <img
                src={item.product?.imageUrl}
                alt={item.product?.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.product?.name}
                </h3>
                <p className="text-gray-600">${item.product?.price.toFixed(2)} each</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Minus size={16} />
                </button>
                <span className="px-3 py-1 border rounded">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="text-lg font-semibold text-gray-900 w-20 text-right">
                ${((item.product?.price || 0) * item.quantity).toFixed(2)}
              </div>
              
              <button
                onClick={() => handleRemoveItem(item._id)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Subtotal:</span>
            <span className="text-2xl font-bold text-blue-600">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Proceed to Checkout
          </button>
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
