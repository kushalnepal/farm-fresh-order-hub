
import { Product } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface RecommendedProductsProps {
  products: Product[];
}

const RecommendedProducts = ({ products }: RecommendedProductsProps) => {
  const { addToCart } = useCart();

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="text-farm-green-dark" size={20} />
        <h3 className="text-lg font-semibold">Customers also bought</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Based on collaborative filtering from similar purchases
      </p>
      
      <div className="space-y-4">
        {products.map(product => (
          <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
            <div className="w-16 h-16 flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            
            <div className="flex-grow">
              <h4 className="font-medium text-sm mb-1">{product.name}</h4>
              <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
              <span className="text-farm-green-dark font-semibold text-sm">NPR {product.price}</span>
            </div>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => addToCart(product, 1)}
              className="flex-shrink-0"
            >
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
