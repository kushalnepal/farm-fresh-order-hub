import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

const PaymentModal = ({ isOpen, onClose, total }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { clearCart } = useCart();

  const handleESewaPayment = () => {
    setLoading(true);
    
    // eSewa test configuration
    const eSewaConfig = {
      merchantId: 'EPAYTEST',
      amount: total,
      productCode: 'EPAYTEST',
      productServiceCharge: '0',
      productDeliveryCharge: '0',
      taxAmount: '0',
      totalAmount: total,
      successUrl: `${window.location.origin}/cart?payment=success`,
      failureUrl: `${window.location.origin}/cart?payment=failed`
    };

    // Create form and submit to eSewa
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://uat.esewa.com.np/epay/main';
    form.target = '_blank';

    // Add form fields
    Object.entries(eSewaConfig).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value.toString();
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    // Show success message and clear cart after a delay
    setTimeout(() => {
      toast.success(`Redirected to eSewa for payment of NPR ${total}`);
      clearCart();
      onClose();
      setLoading(false);
    }, 1000);
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (paymentMethod === 'eSewa') {
      handleESewaPayment();
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing for other methods
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Payment of NPR ${total} successful via ${paymentMethod}!`);
      clearCart();
      onClose();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Payment Method</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="text-center mb-4">
            <span className="text-lg font-semibold">Total Amount: NPR {total}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${paymentMethod === 'eSewa' ? 'border-farm-green-dark bg-farm-cream' : 'border-gray-200'}`}
              onClick={() => setPaymentMethod('eSewa')}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img src="/lovable-uploads/09072c16-f556-4a2d-b0da-4e05e8720c80.png" alt="eSewa" className="max-w-full max-h-full" />
                </div>
                <span className="font-medium">eSewa</span>
              </div>
            </div>
            
            <div 
              className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${paymentMethod === 'FonePay' ? 'border-farm-green-dark bg-farm-cream' : 'border-gray-200'}`}
              onClick={() => setPaymentMethod('FonePay')}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img src="/lovable-uploads/45815cb9-3684-42be-87f4-29fa35851e94.png" alt="Fone Pay" className="max-w-full max-h-full" />
                </div>
                <span className="font-medium">Fone Pay</span>
              </div>
            </div>
            
            <div 
              className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${paymentMethod === 'Cash' ? 'border-farm-green-dark bg-farm-cream' : 'border-gray-200'}`}
              onClick={() => setPaymentMethod('Cash')}
              style={{ gridColumn: "1 / -1" }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="12" cy="12" r="2" />
                    <path d="M6 12h.01M18 12h.01" />
                  </svg>
                </div>
                <span className="font-medium">Cash on Delivery</span>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          {paymentMethod === 'eSewa' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">eSewa Payment Gateway</h4>
              <div className="text-sm text-green-700 space-y-2">
                <p><strong>Amount:</strong> NPR {total}</p>
                <p className="text-xs bg-green-100 p-2 rounded">
                  <strong>Test Mode:</strong> Use test credentials<br/>
                  eSewa ID: 9806800001, Password: Nepal@123
                </p>
                <p>
                  Click "Pay with eSewa" to redirect to eSewa payment gateway where you can complete your payment securely.
                </p>
              </div>
            </div>
          )}

          {paymentMethod === 'FonePay' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Fone Pay Payment Instructions</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Amount:</strong> NPR {total}</p>
                <p className="mt-2">
                  Complete your payment through Fone Pay and click "Pay Now" to confirm your order.
                </p>
              </div>
            </div>
          )}

          {paymentMethod === 'Cash' && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Cash on Delivery</h4>
              <div className="text-sm text-amber-700">
                <p><strong>Amount:</strong> NPR {total}</p>
                <p className="mt-2">
                  Pay NPR {total} in cash when your order is delivered to your doorstep.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handlePayment} 
            disabled={loading || !paymentMethod}
            className="bg-farm-green-dark hover:bg-farm-green-light"
          >
            {loading ? "Processing..." : paymentMethod === 'eSewa' ? "Pay with eSewa" : "Pay Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
