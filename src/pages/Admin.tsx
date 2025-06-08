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
import { Plus, Package, ShoppingBag, Tag, LogOut } from "lucide-react";

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

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  inStock: boolean;
  onSale: boolean;
  salePrice?: number;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'sales'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const navigate = useNavigate();
  
  // New product form data
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    inStock: true
  });

  // Check admin authentication
  useEffect(() => {
    const isAdminAuthenticated = localStorage.getItem('adminAuth');
    if (!isAdminAuthenticated) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('farmfresh_orders');
    const savedProducts = localStorage.getItem('farmfresh_products');
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Initialize with some default products including vegetables
      const defaultProducts: Product[] = [
        {
          id: '1',
          name: 'Organic Tomatoes',
          price: 150,
          description: 'Fresh organic tomatoes from our farm',
          category: 'Vegetables',
          inStock: true,
          onSale: false
        },
        {
          id: '2',
          name: 'Fresh Carrots',
          price: 120,
          description: 'Crisp and sweet organic carrots',
          category: 'Vegetables',
          inStock: true,
          onSale: false
        },
        {
          id: '3',
          name: 'Green Lettuce',
          price: 80,
          description: 'Fresh leafy green lettuce',
          category: 'Vegetables',
          inStock: true,
          onSale: false
        },
        {
          id: '4',
          name: 'Bell Peppers',
          price: 200,
          description: 'Colorful bell peppers',
          category: 'Vegetables',
          inStock: true,
          onSale: false
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('farmfresh_products', JSON.stringify(defaultProducts));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    toast.success("Logged out successfully");
    navigate('/admin-login');
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      description: newProduct.description,
      category: newProduct.category || 'general',
      inStock: newProduct.inStock,
      onSale: false
    };
    
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    localStorage.setItem('farmfresh_products', JSON.stringify(updatedProducts));
    
    // Reset form
    setNewProduct({
      name: "",
      price: "",
      description: "",
      category: "",
      inStock: true
    });
    
    setShowAddProduct(false);
    toast.success("Product added successfully!");
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('farmfresh_orders', JSON.stringify(updatedOrders));
    toast.success("Order status updated!");
  };

  const toggleProductStock = (productId: string) => {
    const updatedProducts = products.map(product => 
      product.id === productId ? { ...product, inStock: !product.inStock } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('farmfresh_products', JSON.stringify(updatedProducts));
    toast.success("Product stock updated!");
  };

  const toggleProductSale = (productId: string, salePrice?: number) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          onSale: !product.onSale,
          salePrice: product.onSale ? undefined : salePrice || product.price * 0.8
        };
      }
      return product;
    });
    setProducts(updatedProducts);
    localStorage.setItem('farmfresh_products', JSON.stringify(updatedProducts));
    toast.success(updatedProducts.find(p => p.id === productId)?.onSale ? "Product added to sale!" : "Product removed from sale!");
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
        <div className="flex gap-4 mb-8">
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
                      <Button type="button" variant="outline" onClick={() => setShowAddProduct(false)}>
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
      </div>
    </Layout>
  );
};

export default Admin;
