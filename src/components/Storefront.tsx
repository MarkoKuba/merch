import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useMemo, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { NewsletterSignup } from "./NewsletterSignup";
import { useSearchParams } from "react-router-dom";

export function Storefront() {
  const products = useQuery(api.products.list);
  const initializeProducts = useMutation(api.products.initializeSampleProducts);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    void initializeProducts();
  }, [initializeProducts]);

  const query = (searchParams.get("q") || "").toLowerCase();
  const filtered = useMemo(() => {
    const base = products ?? [];
    if (!query) return base;
    return base.filter((p) => {
      const haystack = [p.name, p.category, p.description]
        .map((v) => String(v ?? "").toLowerCase());
      return haystack.some((s) => s.includes(query));
    });
  }, [products, query]);

  if (!products) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12 bg-base-300 py-16 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold text-base-content mb-4">Premium T-Shirts Collection</h1>
        <p className="text-xl text-base-content/80 max-w-2xl mx-auto px-4">
          Discover our carefully curated selection of high-quality t-shirts. 
          Comfortable, stylish, and perfect for every occasion.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
        {filtered.map((p) => (
          <ProductCard
            key={String(p._id)}
            product={{
              _id: String(p._id),
              name: p.name,
              price: p.price,
              imageUrl: p.imageUrl,
              category: p.category,
            }}
          />
        ))}
      </div>

      <NewsletterSignup />
    </div>
  );
}
