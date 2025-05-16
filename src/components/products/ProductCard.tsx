
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
  description: string;
  price: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-52 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <span className="inline-block bg-farm-cream text-farm-brown-dark rounded-full px-3 py-1 text-xs font-medium">
            {product.category}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-farm-green-dark font-semibold">NPR {product.price}</span>
          
          <div className="flex gap-2">
            <Link 
              to={`/products/${product.id}`}
              className="text-farm-brown-dark text-sm font-medium hover:underline"
            >
              Details
            </Link>
            <button 
              className="bg-farm-green-dark text-white p-1.5 rounded-md hover:bg-farm-green-light transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
