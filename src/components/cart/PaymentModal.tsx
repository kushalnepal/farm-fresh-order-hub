
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import eSewaLogo from "/src/assets/esewa-logo.png";
import phonePayLogo from "/src/assets/phonepay-logo.png";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

const PaymentModal = ({ isOpen, onClose, total }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { clearCart } = useCart();

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would integrate with the actual payment gateway APIs here
      
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
                  <img src={eSewaLogo} alt="eSewa" className="max-w-full max-h-full" />
                </div>
                <span className="font-medium">eSewa</span>
              </div>
            </div>
            
            <div 
              className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${paymentMethod === 'PhonePay' ? 'border-farm-green-dark bg-farm-cream' : 'border-gray-200'}`}
              onClick={() => setPaymentMethod('PhonePay')}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img src={phonePayLogo} alt="PhonePay" className="max-w-full max-h-full" />
                </div>
                <span className="font-medium">PhonePay</span>
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
              <h4 className="font-semibold text-green-800 mb-2">eSewa Payment Instructions</h4>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Payment Number:</strong> 9803342289</p>
                <p><strong>Amount:</strong> NPR {total}</p>
                <p className="mt-2">
                  1. Open your eSewa app<br/>
                  2. Send money to: <strong>9803342289</strong><br/>
                  3. Enter amount: <strong>NPR {total}</strong><br/>
                  4. Complete the transaction<br/>
                  5. Click "Pay Now" below to confirm your order
                </p>
              </div>
            </div>
          )}

          {paymentMethod === 'PhonePay' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">PhonePay Payment Instructions</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Amount:</strong> NPR {total}</p>
                <p className="mt-2">
                  Complete your payment through PhonePay and click "Pay Now" to confirm your order.
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
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
