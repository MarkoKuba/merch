import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";
import { NewsletterSignup } from "./NewsletterSignup";

interface StorefrontProps {
  sessionId: string;
}

export function Storefront({ sessionId }: StorefrontProps) {
  const products = useQuery(api.products.list);
  const initializeProducts = useMutation(api.products.initializeSampleProducts);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    // Initialize sample products on first load
    initializeProducts();
  }, [initializeProducts]);

  if (!products) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Premium T-Shirts Collection
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our carefully curated selection of high-quality t-shirts. 
          Comfortable, stylish, and perfect for every occasion.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onViewDetails={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          sessionId={sessionId}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
