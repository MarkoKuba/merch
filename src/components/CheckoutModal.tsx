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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderItems = cartItems.map(item => ({
      productId: item.productId,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    createOrder({
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address,
      items: orderItems,
      totalAmount: subtotal,
      sessionId,
    })
      .then(() => clearCart({ sessionId }))
      .then(() => {
        toast.success("Order placed successfully! Check your email for confirmation.");
        onClose();
      })
      .catch(() => toast.error("Failed to place order. Please try again."))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="py-4">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="bg-base-200 rounded-lg p-4 space-y-2">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span>{item.product.name} x{item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="divider my-2"></div>
              <div className="font-semibold flex justify-between">
                <span>Total:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Delivery Information</h3>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="input input-bordered w-full"
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email Address *</span>
              </label>
              <input
                type="email"
                required
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="input input-bordered w-full"
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone Number *</span>
              </label>
              <input
                type="tel"
                required
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="input input-bordered w-full"
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Delivery Address *</span>
              </label>
              <textarea
                required
                rows={3}
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                className="textarea textarea-bordered w-full"
                placeholder="Enter your complete delivery address"
              />
            </div>
          </div>

          <div className="alert alert-info mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
              <h4 className="font-semibold">Payment Method</h4>
              <p>Cash on Delivery (COD)</p>
              <p className="text-sm mt-1">
                Payment will be collected when your order is delivered.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-success btn-block btn-lg"
          >
            {isSubmitting ? 
              <><span className="loading loading-spinner"></span>Placing Order...</> : 
              "Place Order"
            }
          </button>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
