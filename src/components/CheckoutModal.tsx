import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

interface CheckoutModalProps {
  cartItems: any[];
  subtotal: number;
  sessionId: string;
  onClose: () => void;
}

export function CheckoutModal({ cartItems, subtotal, sessionId, onClose }: CheckoutModalProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createOrder = useMutation(api.orders.create);
  const clearCart = useMutation(api.cart.clearCart);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

      await createOrder({
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        items: orderItems,
        totalAmount: subtotal,
        sessionId,
      });

      await clearCart({ sessionId });
      
      toast.success("Order placed successfully! Check your email for confirmation.");
      onClose();
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span>{item.product.name} x{item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-semibold flex justify-between">
                <span>Total:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Delivery Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address *
              </label>
              <textarea
                required
                rows={3}
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your complete delivery address"
              />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Payment Method</h4>
            <p className="text-blue-800">Cash on Delivery (COD)</p>
            <p className="text-sm text-blue-600 mt-1">
              Payment will be collected when your order is delivered.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
