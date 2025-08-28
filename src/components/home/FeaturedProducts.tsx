
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/components/products/ProductCard";

// Featured product data with correct images
const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Organic Tomatoes",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
    category: "Vegetables",
    description: "Fresh organic red tomatoes from our farm.",
    price: 150,
  },
  {
    id: 2,
    name: "Free-Range Chicken",
    image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=400",
    category: "Chicken",
    description: "Naturally raised free-range chicken without antibiotics.",
    price: 550,
  },
  {
    id: 3,
    name: "Premium Cattle Grass",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400",
    category: "Grass",
    description: "High-quality grass feed for healthy cattle growth.",
    price: 180,
  },
];

const FeaturedProducts = () => {
  console.log('FeaturedProducts component rendering');
  const { addToCart } = useCart();
  
  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Adding product to cart:', product.name);
    addToCart(product, 1);
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex flex-wrap justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-xl">Discover our most popular farm-fresh products, harvested with care and delivered directly to your doorstep.</p>
          </div>
          <Link to="/products" className="hidden md:flex items-center text-farm-green-dark font-semibold hover:underline mt-4 md:mt-0">
            View All Products
            <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-56 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <span className="inline-block bg-farm-cream text-farm-brown-dark rounded-full px-3 py-1 text-xs font-medium mb-3">
                  {product.category}
                </span>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-farm-green-dark font-semibold">NPR {product.price}</span>
                  <div className="flex gap-2">
                    <Link to={`/products/${product.id}`} className="text-farm-brown-dark font-medium hover:underline">
                      View Details
                    </Link>
                    <button 
                      className="bg-farm-green-dark text-white p-1.5 rounded-md hover:bg-farm-green-light transition-colors"
                      aria-label="Add to cart"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link to="/products" className="btn-outline">
            View All Products
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
