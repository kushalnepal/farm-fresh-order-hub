
import { useState, FormEvent } from "react";
import { Phone, WhatsApp } from "lucide-react";
import { toast } from "sonner";

const OrderForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    orderDetails: "",
    preferredContact: "phone"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.phone || !formData.orderDetails) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Here you would normally send the data to your backend
    console.log("Order submitted:", formData);
    
    // Show success message
    toast.success("Your order has been submitted! We'll contact you soon.");
    
    // Clear form
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      orderDetails: "",
      preferredContact: "phone"
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <h3 className="text-2xl font-semibold mb-6">Place Your Order</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-farm-green-dark focus:border-farm-green-dark"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-farm-green-dark focus:border-farm-green-dark"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-farm-green-dark focus:border-farm-green-dark"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium">
              Delivery Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-farm-green-dark focus:border-farm-green-dark"
            />
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <label htmlFor="orderDetails" className="block text-sm font-medium">
            Order Details <span className="text-red-500">*</span>
          </label>
          <textarea
            id="orderDetails"
            name="orderDetails"
            value={formData.orderDetails}
            onChange={handleChange}
            rows={5}
            placeholder="Please provide details of the products you want to order, including quantities and any special requests."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-farm-green-dark focus:border-farm-green-dark"
            required
          ></textarea>
        </div>
        
        <div className="mt-6 space-y-2">
          <label className="block text-sm font-medium">
            Preferred Contact Method
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="preferredContact"
                value="phone"
                checked={formData.preferredContact === "phone"}
                onChange={handleChange}
                className="form-radio h-5 w-5 text-farm-green-dark"
              />
              <span className="ml-2 flex items-center">
                <Phone size={18} className="mr-1" /> Phone Call
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="preferredContact"
                value="whatsapp"
                checked={formData.preferredContact === "whatsapp"}
                onChange={handleChange}
                className="form-radio h-5 w-5 text-farm-green-dark"
              />
              <span className="ml-2 flex items-center">
                <WhatsApp size={18} className="mr-1" /> WhatsApp
              </span>
            </label>
          </div>
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            className="bg-farm-green-dark hover:bg-farm-green-light text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300 w-full md:w-auto"
          >
            Submit Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
