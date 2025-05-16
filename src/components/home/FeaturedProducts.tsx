
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Sample product data
const featuredProducts = [
  {
    id: 1,
    name: "Fresh Organic Vegetables",
    image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Vegetables",
    description: "Farm-fresh, pesticide-free vegetables harvested daily.",
    price: 250,
  },
  {
    id: 2,
    name: "Free-Range Chicken",
    image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    category: "Chicken",
    description: "Naturally raised free-range chicken without antibiotics.",
    price: 550,
  },
  {
    id: 3,
    name: "Premium Cattle Grass",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    category: "Grass",
    description: "High-quality grass feed for healthy cattle growth.",
    price: 180,
  },
];

const FeaturedProducts = () => {
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
                  <Link to={`/products/${product.id}`} className="text-farm-brown-dark font-medium hover:underline">
                    View Details
                  </Link>
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
