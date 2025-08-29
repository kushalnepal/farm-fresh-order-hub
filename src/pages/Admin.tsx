
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Package, ShoppingBag, Tag, LogOut, Upload, Image, Users, Loader2 } from "lucide-react";
import { api, type Product, type User, ApiError } from "@/lib/api";

interface Order {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  orderDetails: string;
  preferredContact: string;
  status: string;
  createdAt: string;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'sales' | 'algorithms' | 'users'>('products');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // New product form data
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    tags: "",
    inStock: true,
    onSale: false,
    salePrice: "",
    image: null as File | null
  });

  // Check admin authentication based on user role
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role !== 'ADMIN') {
        toast.error("Access denied. Admin privileges required.");
        navigate('/');
        return;
      }
    } else {
      toast.error("Please login as admin to access this page.");
      navigate('/admin-login');
      return;
    }
  }, [navigate]);

  // Load data from backend on component mount
  useEffect(() => {
    loadProducts();
    loadUsers();
  }, []);

  const loadProducts = async (skip = 0) => {
    try {
      setLoading(true);
      const fetchedProducts = await api.getProducts(skip);
      setProducts(fetchedProducts);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to load products: ${error.message}`);
      } else {
        toast.error('Failed to load products');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const fetchedUsers = await api.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to load users: ${error.message}`);
      } else {
        toast.error('Failed to load users');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    toast.success("Logged out successfully");
    navigate('/auth');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProduct({...newProduct, image: file});
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setLoading(true);
      const productData = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        tags: newProduct.tags || newProduct.category,
        category: newProduct.category,
        inStock: newProduct.inStock,
        onSale: newProduct.onSale,
        salePrice: newProduct.salePrice ? parseFloat(newProduct.salePrice) : undefined
      };
      
      await api.createProduct(productData);
      
      // Reset form
      setNewProduct({
        name: "",
        price: "",
        description: "",
        category: "",
        tags: "",
        inStock: true,
        onSale: false,
        salePrice: "",
        image: null
      });
      setImagePreview(null);
      setShowAddProduct(false);
      
      // Reload products
      await loadProducts();
      toast.success("Product added successfully!");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to add product: ${error.message}`);
      } else {
        toast.error('Failed to add product');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStock = async (productId: string) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;
      
      await api.updateProduct(productId, { inStock: !product.inStock });
      await loadProducts();
      toast.success("Product stock updated!");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to update stock: ${error.message}`);
      } else {
        toast.error('Failed to update stock');
      }
    }
  };

  const toggleProductSale = async (productId: string, salePrice?: number) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;
      
      const updates = {
        onSale: !product.onSale,
        salePrice: product.onSale ? undefined : salePrice || product.price * 0.8
      };
      
      await api.updateProduct(productId, updates);
      await loadProducts();
      toast.success(updates.onSale ? "Product added to sale!" : "Product removed from sale!");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to update sale status: ${error.message}`);
      } else {
        toast.error('Failed to update sale status');
      }
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await api.deleteProduct(productId);
      await loadProducts();
      toast.success("Product deleted successfully!");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to delete product: ${error.message}`);
      } else {
        toast.error('Failed to delete product');
      }
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('farmfresh_orders', JSON.stringify(updatedOrders));
    toast.success("Order status updated!");
  };

  const vegetables = products.filter(product => 
    product.category.toLowerCase() === 'vegetables'
  );

  return (
    <Layout>
      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage orders, products, and sales</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut size={18} />
            Logout
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <Button
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveTab('orders')}
            className="flex items-center gap-2"
          >
            <ShoppingBag size={18} />
            Orders ({orders.length})
          </Button>
          <Button
            variant={activeTab === 'products' ? 'default' : 'outline'}
            onClick={() => setActiveTab('products')}
            className="flex items-center gap-2"
          >
            <Package size={18} />
            Products ({products.length})
          </Button>
          <Button
            variant={activeTab === 'sales' ? 'default' : 'outline'}
            onClick={() => setActiveTab('sales')}
            className="flex items-center gap-2"
          >
            <Tag size={18} />
            Sales Management
          </Button>
          <Button
            variant={activeTab === 'algorithms' ? 'default' : 'outline'}
            onClick={() => setActiveTab('algorithms')}
            className="flex items-center gap-2"
          >
            🧠 Algorithms
          </Button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle>Customer Orders</CardTitle>
              <CardDescription>
                Manage and track customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Order Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.name}</div>
                            <div className="text-sm text-gray-500">{order.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{order.phone}</div>
                            <div className="text-xs text-gray-500">{order.preferredContact}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="text-sm">{order.orderDetails}</div>
                            {order.address && (
                              <div className="text-xs text-gray-500 mt-1">📍 {order.address}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            order.status === 'completed' ? 'default' :
                            order.status === 'processing' ? 'secondary' :
                            'outline'
                          }>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, 'processing')}
                            >
                              Process
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                            >
                              Complete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Products</h2>
              <Button onClick={() => setShowAddProduct(true)} className="flex items-center gap-2">
                <Plus size={18} />
                Add Product
              </Button>
            </div>

            {/* Add Product Form */}
            {showAddProduct && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="productName">Product Name *</Label>
                        <Input
                          id="productName"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="productPrice">Price (NPR) *</Label>
                        <Input
                          id="productPrice"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="productCategory">Category</Label>
                        <Input
                          id="productCategory"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                          placeholder="e.g., vegetables, dairy, fruits"
                        />
                      </div>
                      <div>
                        <Label htmlFor="productImage">Product Image</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="productImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('productImage')?.click()}
                            className="flex items-center gap-2"
                          >
                            <Upload size={16} />
                            Upload Image
                          </Button>
                          {imagePreview && (
                            <div className="flex items-center gap-2">
                              <Image size={16} className="text-green-600" />
                              <span className="text-sm text-green-600">Image selected</span>
                            </div>
                          )}
                        </div>
                        {imagePreview && (
                          <div className="mt-2">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-20 h-20 object-cover rounded border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="productDescription">Description *</Label>
                      <Textarea
                        id="productDescription"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button type="submit">Add Product</Button>
                      <Button type="button" variant="outline" onClick={() => {
                        setShowAddProduct(false);
                        setImagePreview(null);
                        setNewProduct({
                          name: "",
                          price: "",
                          description: "",
                          category: "",
                          tags: "",
                          inStock: true,
                          onSale: false,
                          salePrice: "",
                          image: null
                        });
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Products List */}
            <Card>
              <CardContent className="p-6">
                {products.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No products yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <Image size={16} className="text-gray-400" />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>NPR {product.price}</TableCell>
                          <TableCell className="max-w-xs">
                            <div className="text-sm">{product.description}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.inStock ? 'default' : 'destructive'}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleProductStock(product.id)}
                            >
                              {product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sales Management Tab */}
        {activeTab === 'sales' && (
          <Card>
            <CardHeader>
              <CardTitle>Vegetable Sales Management</CardTitle>
              <CardDescription>
                Put vegetables on sale - these changes will be reflected on the customer products page
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vegetables.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No vegetables found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vegetable Name</TableHead>
                      <TableHead>Regular Price</TableHead>
                      <TableHead>Sale Price</TableHead>
                      <TableHead>Sale Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vegetables.map((vegetable) => (
                      <TableRow key={vegetable.id}>
                        <TableCell className="font-medium">{vegetable.name}</TableCell>
                        <TableCell>NPR {vegetable.price}</TableCell>
                        <TableCell>
                          {vegetable.onSale ? (
                            <span className="text-red-600 font-medium">
                              NPR {vegetable.salePrice}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={vegetable.onSale ? 'destructive' : 'outline'}>
                            {vegetable.onSale ? 'ON SALE' : 'Regular Price'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={vegetable.onSale ? 'outline' : 'default'}
                            onClick={() => toggleProductSale(vegetable.id)}
                            className="flex items-center gap-2"
                          >
                            <Tag size={16} />
                            {vegetable.onSale ? 'Remove from Sale' : 'Put on Sale'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Algorithms Tab */}
        {activeTab === 'algorithms' && (
          <Card>
            <CardHeader>
              <CardTitle>Algorithms Used in Website</CardTitle>
              <CardDescription>
                Technical documentation of algorithms implemented in the farm fresh application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  🛒 1. Cart & Order Optimization
                </h3>
                
                <div className="pl-4 space-y-3">
                  <h4 className="font-medium">📦 Greedy Algorithm for Delivery Packing</h4>
                  <p className="text-sm text-gray-600">
                    If you later offer delivery: Problem: Fit items into delivery boxes based on volume/weight.
                    Solution: Use a greedy algorithm to optimize item arrangement into boxes.
                  </p>
                  
                  <h4 className="font-medium">🔁 Deduplication / Quantity Merge</h4>
                  <p className="text-sm text-gray-600">
                    When the same product is added again to cart: Use a hash map (object or Map) to merge quantities instead of duplicate entries.
                  </p>
                </div>

                <h3 className="text-xl font-semibold flex items-center gap-2">
                  🔍 2. Search & Filter System
                </h3>
                
                <div className="pl-4 space-y-3">
                  <h4 className="font-medium">✅ Basic Filtering</h4>
                  <p className="text-sm text-gray-600">
                    Filter by category, price range, availability, etc. Use array filters or index-based sorting.
                  </p>
                  
                  <h4 className="font-medium">🔠 Fuzzy Search (Product Names)</h4>
                  <p className="text-sm text-gray-600">
                    Use Levenshtein Distance or Tries for fuzzy search (e.g., "lettice" → "lettuce").
                    Consider using libraries like: Fuse.js (lightweight fuzzy search), lunr.js (search indexing)
                  </p>
                </div>

                <h3 className="text-xl font-semibold flex items-center gap-2">
                  📊 3. Inventory & Sales
                </h3>
                
                <div className="pl-4 space-y-3">
                  <h4 className="font-medium">📉 Time Series Forecasting (Future Feature)</h4>
                  <p className="text-sm text-gray-600">
                    Predict future demand (e.g., peak chicken sales on weekends).
                    Use algorithms like: Simple Moving Average, Exponential Smoothing.
                    Later: integrate ARIMA or ML-based models
                  </p>
                  
                  <h4 className="font-medium">🧮 Inventory Threshold Alerts</h4>
                  <p className="text-sm text-gray-600">
                    When stock &lt; threshold, alert admin. Simple if-check logic, or use priority queues to show low-stock items first.
                  </p>
                </div>

                <h3 className="text-xl font-semibold flex items-center gap-2">
                  🧠 4. Recommendations
                </h3>
                
                <div className="pl-4 space-y-3">
                  <h4 className="font-medium">🛍️ Collaborative Filtering (Basic Recommender System)</h4>
                  <p className="text-sm text-gray-600">
                    Recommend products based on: Items commonly bought together (association rules), Browsing history.
                    Example: If User A bought chicken and lettuce, and User B bought chicken → suggest lettuce to User B.
                    Can implement this using: Apriori algorithm (basic rule mining), Item-based filtering using a similarity matrix (cosine similarity)
                  </p>
                </div>

                <h3 className="text-xl font-semibold flex items-center gap-2">
                  🔐 5. Security / Auth
                </h3>
                
                <div className="pl-4 space-y-3">
                  <h4 className="font-medium">🔐 Password Hashing</h4>
                  <p className="text-sm text-gray-600">
                    Handled by Supabase, but if doing manually: Use bcrypt or argon2 for secure password storage.
                  </p>
                  
                  <h4 className="font-medium">👮 Role-Based Access Control</h4>
                  <p className="text-sm text-gray-600">
                    Use role-check logic or Supabase RLS policies to: Allow admin access to /admin, Restrict users from viewing others' orders
                  </p>
                </div>

                <h3 className="text-xl font-semibold flex items-center gap-2">
                  💳 6. Payment Validations
                </h3>
                
                <div className="pl-4 space-y-3">
                  <h4 className="font-medium">🔄 Retry Logic for Payments</h4>
                  <p className="text-sm text-gray-600">
                    Retry failed payments with exponential backoff: Use retry algorithms like: delay = base * 2^attempt
                  </p>
                </div>

                <h3 className="text-xl font-semibold flex items-center gap-2">
                  🗺️ 7. Routing & UI Logic
                </h3>
                
                <div className="pl-4 space-y-3">
                  <h4 className="font-medium">📦 Client-Side State Management</h4>
                  <p className="text-sm text-gray-600">
                    Use Finite State Machines (with xstate) for: Checkout process, Authentication flow (login → loading → success/error)
                  </p>
                </div>

                <h3 className="text-xl font-semibold flex items-center gap-2">
                  🧠 Bonus (Advanced / Optional AI)
                </h3>
                
                <div className="pl-4 space-y-3">
                  <p className="text-sm text-gray-600">
                    If you want to go further: Integrate a chatbot (GPT-style) for customer help.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
