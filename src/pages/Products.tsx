
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import ProductCard, { Product } from "@/components/products/ProductCard";
import CategoryFilter from "@/components/products/CategoryFilter";
import { Search } from "lucide-react";

// Sample product data
const productsList: Product[] = [
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
  {
    id: 4,
    name: "Organic Leafy Greens",
    image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    category: "Vegetables",
    description: "Fresh, organic leafy greens perfect for salads and cooking.",
    price: 180,
  },
  {
    id: 5,
    name: "Farm-Fresh Eggs",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    category: "Others",
    description: "Free-range chicken eggs with rich, golden yolks.",
    price: 200,
  },
  {
    id: 6,
    name: "Organic Root Vegetables",
    image: "https://images.unsplash.com/photo-1618507358569-a2966b490e5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1734&q=80",
    category: "Vegetables",
    description: "Fresh carrots, beets, and other root vegetables.",
    price: 220,
  },
  {
    id: 7,
    name: "Premium Broiler Chicken",
    image: "https://images.unsplash.com/photo-1587489809149-430fb1045bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    category: "Chicken",
    description: "High-quality broiler chicken raised in free-range conditions.",
    price: 650,
  },
  {
    id: 8,
    name: "Wild Native Grass Seeds",
    image: "https://images.unsplash.com/photo-1508105859382-b487af436eff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    category: "Grass",
    description: "Native grass seeds for sustainable pasture development.",
    price: 320,
  },
];

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique categories
  const categories = Array.from(
    new Set(productsList.map((product) => product.category))
  );

  // Filter products based on category and search query
  const filteredProducts = productsList.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <section className="bg-farm-cream py-16 md:py-20">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-gray-600 max-w-2xl mb-8">
            Explore our wide range of fresh, organic farm products. From vegetables to free-range
            chicken and quality grass feed, we've got everything you need.
          </p>
        </div>
      </section>

      <section className="container-custom py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg border border-gray-100 p-6 sticky top-24">
              <div className="mb-6">
                <label htmlFor="search" className="block text-sm font-medium mb-2">Search Products</label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-farm-green-dark focus:border-farm-green-dark"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>
              
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="md:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Products;
