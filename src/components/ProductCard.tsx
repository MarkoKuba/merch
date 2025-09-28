import { Link } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getOrCreateSessionId } from "../lib/utils";
import { toast } from "sonner";
//import { Maximize2 } from "lucide-react";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useMutation(api.cart.addToCart);
  const sessionId = getOrCreateSessionId();

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId: product._id as any, quantity: 1, sessionId });
      toast.success(`Added ${product.name} to cart`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <figure>
        <Link to={`/product/${product._id}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-64 object-cover w-full"
          />
        </Link>
      </figure>
      <div className="card-body">
        <Link to={`/product/${product._id}`}>
          <div className="flex justify-between items-start">
            <h3 className="card-title">
              {product.name}
              <span className="badge badge-secondary">
                {product.category}
              </span>
            </h3>

          </div>
          <p className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </p>
        </Link>
        <div className="card-actions justify-end">
          <button
            onClick={() => { void handleAddToCart(); }}
            className="btn btn-primary"
          >
            Add to Cart
          </button>
          {/* <Link
            to={`/product/${product._id}`}
            className="btn btn-ghost btn-circle"
            aria-label="View Details"
            title="View Details"
          >
            <Maximize2 size={16} />
          </Link> */}

        </div>
      </div>
    </div>
  );
}
