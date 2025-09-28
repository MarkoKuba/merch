import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Minus, Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getOrCreateSessionId } from "../lib/utils";

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = useQuery(api.products.get as any, { id: id as any });
  const addToCart = useMutation(api.cart.addToCart);
  const [quantity, setQuantity] = useState(1);
  const sessionId = getOrCreateSessionId();

  if (product === undefined) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link to="/" className="btn btn-ghost mb-6"><ArrowLeft size={16} className="mr-2" /> Back to Store</Link>
        <div className="alert alert-warning">Product not found.</div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId: product._id, quantity, sessionId });
      toast.success(`Added ${quantity} ${product.name}(s) to cart`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link to="/" className="btn btn-ghost mb-6"><ArrowLeft size={16} className="mr-2" /> Back to Store</Link>
      <div className="grid md:grid-cols-2 gap-8 bg-base-100 rounded-xl shadow-xl p-6">
        <div>
          <img src={product.imageUrl} alt={product.name} className="w-full h-96 object-cover rounded-lg" />
        </div>
        <div>
          <div className="mb-4">
            <span className="badge badge-secondary">{product.category}</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="opacity-80 mb-6">{product.description}</p>
          <div className="text-4xl font-bold text-primary mb-6">${product.price.toFixed(2)}</div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="join">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="join-item btn">
                <Minus size={16} />
              </button>
              <span className="join-item btn">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="join-item btn">
                <Plus size={16} />
              </button>
            </div>
          </div>

          <button onClick={() => { void handleAddToCart(); }} className="btn btn-primary btn-block btn-lg">
            Add to Cart - ${(product.price * quantity).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
} 