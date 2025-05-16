
import { Layout } from "@/components/layout/Layout";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, CreditCard } from "lucide-react";
import { useState } from "react";
import PaymentModal from "@/components/cart/PaymentModal";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Calculate cart total
  const cartTotal = getCartTotal();
  const hasItems = items.length > 0;

  return (
    <Layout>
      <section className="bg-farm-cream py-16 md:py-20">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Cart</h1>
          <p className="text-gray-600 max-w-2xl mb-8">
            Review your selected items and proceed to checkout.
          </p>
        </div>
      </section>

      <section className="container-custom py-12 md:py-16">
        {hasItems ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Shopping Cart</h2>
                
                <div className="space-y-6">
                  {items.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 pb-6 border-b">
                      <div className="w-full sm:w-24 h-24">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-medium text-lg">{item.name}</h3>
                          <span className="text-farm-green-dark font-semibold">NPR {item.price}</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-1">{item.description}</p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={18} />
                            </Button>
                            
                            <span className="w-8 text-center">{item.quantity}</span>
                            
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus size={18} />
                            </Button>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-4">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>NPR {cartTotal}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span>Free</span>
                  </div>
                  
                  <div className="pt-4 border-t mt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-farm-green-dark">NPR {cartTotal}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6 bg-farm-green-dark hover:bg-farm-green-light"
                    onClick={() => setIsPaymentModalOpen(true)}
                  >
                    <CreditCard className="mr-2" size={18} />
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Browse our products and add some items to your cart.</p>
            <Button asChild>
              <a href="/products">Continue Shopping</a>
            </Button>
          </div>
        )}
      </section>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={cartTotal}
      />
    </Layout>
  );
};

export default Cart;
