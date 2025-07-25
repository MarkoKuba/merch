interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
  };
  onViewDetails: () => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <figure>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-64 object-cover w-full"
        />
      </figure>
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h3 className="card-title">{product.name}</h3>
          <span className="badge badge-secondary">
            {product.category}
          </span>
        </div>
        <p className="text-2xl font-bold text-primary">
          ${product.price.toFixed(2)}
        </p>
        <div className="card-actions justify-end">
          <button
            onClick={onViewDetails}
            className="btn btn-primary btn-block"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
