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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        <p className="text-2xl font-bold text-blue-600 mb-4">
          ${product.price.toFixed(2)}
        </p>
        <button
          onClick={onViewDetails}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
