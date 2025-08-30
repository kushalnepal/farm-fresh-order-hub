import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import ProductCard, { Product } from "@/components/products/ProductCard";
import CategoryFilter from "@/components/products/CategoryFilter";
import { Search, Loader2 } from "lucide-react";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { api, ApiError } from "@/lib/api";
import { toast } from "sonner";

// Product name to image mapping for proper image assignment
const getProductImage = (productName: string) => {
  const imageMap: { [key: string]: string } = {
    'Organic Tomatoes': 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400',
    'Bell Peppers': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400',
    'Fresh Radish': 'https://images.unsplash.com/photo-1588781292665-c3db922633b1?w=400',
    'Free-Range Chicken': 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400',
    'Premium Cattle Grass': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
    'Fresh Carrots': 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400',
    'Organic Potatoes': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
    'Green Spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
    'Farm Fresh Eggs': 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=400',
    'Organic Broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400',
    'Sweet Corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400',
    'Fresh Cucumbers': 'https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400',
    'Red Onions': 'https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=400',
    'Green Lettuce': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400',
    'Fresh Cabbage': 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400',
    'Garden Peas': 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400',
    'Fresh Cauliflower': 'https://images.unsplash.com/photo-1510627489930-0c1b0e63aa14?w=400',
    'Organic Beetroot': 'https://images.unsplash.com/photo-1515543904379-3d0e229be1f7?w=400',
    'Fresh Ginger': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    'Green Beans': 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=400'
  };
  
  return imageMap[productName] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400';
};

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products from backend API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const backendProducts = await api.getProducts() as any[];
      console.log('Backend products:', backendProducts);
      
      // Convert backend products to display products with proper image mapping
      const displayProducts: Product[] = backendProducts
        .map((product: any) => {
          const mappedImage = getProductImage(product.name);
          console.log(`Product: ${product.name}, Mapped image: ${mappedImage}`);
          return {
            id: parseInt(product.id),
            name: product.name,
            image: product.image ? `data:image/jpeg;base64,${product.image}` : mappedImage,
            category: product.tags || 'General',
            description: product.description,
            price: product.price,
          };
        });
      
      console.log('Final display products:', displayProducts);
      setProductsList(displayProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      if (error instanceof ApiError) {
        toast.error(`Failed to load products: ${error.message}`);
      } else {
        toast.error('Failed to load products');
      }
      
      // Fallback to default products if API fails
      const defaultProducts: Product[] = [
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
      setProductsList(defaultProducts);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories
  const categories = Array.from(
    new Set(productsList.map((product) => product.category))
  );

  // Filter by category first
  const categoryFilteredProducts = productsList.filter((product) => {
    return activeCategory === "All" || product.category === activeCategory;
  });

  // Apply fuzzy search to category-filtered products with improved settings
  const { results: searchResults } = useFuzzySearch(categoryFilteredProducts, searchQuery, {
    threshold: 0.4, // More lenient threshold
    keys: ['name', 'description', 'category']
  });

  const filteredProducts = searchResults;

  console.log('Search query:', searchQuery);
  console.log('Category filtered products:', categoryFilteredProducts.length);
  console.log('Final filtered products:', filteredProducts.length);

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
                <label htmlFor="search" className="block text-sm font-medium mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    placeholder="Try 'tomato', 'chicken', 'grass'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-farm-green-dark focus:border-farm-green-dark"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Smart search - finds products even with typos and partial matches!
                </p>
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
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="animate-spin" size={32} />
                <span className="ml-2">Loading products...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-600">Try a different search term or browse all categories.</p>
                {searchQuery && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-500">
                      Searched for: "{searchQuery}" in {categoryFilteredProducts.length} products
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-farm-green-dark hover:underline text-sm"
                    >
                      Clear search
                    </button>
                  </div>
                )}
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
