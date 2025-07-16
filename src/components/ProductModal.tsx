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
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
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
                <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>
              
              <div className="text-3xl font-bold text-blue-600 mb-6">
                ${product.price.toFixed(2)}
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
