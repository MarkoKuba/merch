import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { X, Plus, Minus } from "lucide-react";

interface ProductModalProps {
  product: {
    _id: any;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
  };
  sessionId: string;
  onClose: () => void;
}

export function ProductModal({ product, sessionId, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useMutation(api.cart.addToCart);

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: product._id,
        quantity,
        sessionId,
      });
      toast.success(`Added ${quantity} ${product.name}(s) to cart`);
      onClose();
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="py-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            
            <div>
              <div className="mb-4">
                <span className="badge badge-secondary">
                  {product.category}
                </span>
              </div>
              
              <p className="text-base-content/70 mb-6">
                {product.description}
              </p>
              
              <div className="text-3xl font-bold text-primary mb-6">
                ${product.price.toFixed(2)}
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="join border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="btn btn-ghost join-item"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="join-item px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="btn btn-ghost join-item"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => { void handleAddToCart(); }}
                className="btn btn-primary btn-block btn-lg"
              >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
