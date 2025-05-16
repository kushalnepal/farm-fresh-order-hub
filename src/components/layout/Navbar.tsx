
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, Phone } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-farm-green-dark flex items-center justify-center text-white font-bold text-xl">F</div>
          <div className="font-poppins font-bold text-xl">
            <span className="text-farm-green-dark">Farm</span>
            <span className="text-farm-brown-dark">Fresh</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="font-medium hover:text-farm-green-dark transition-colors">Home</Link>
          <Link to="/products" className="font-medium hover:text-farm-green-dark transition-colors">Products</Link>
          <Link to="/order-now" className="font-medium hover:text-farm-green-dark transition-colors">Order Now</Link>
          <Link to="/gallery" className="font-medium hover:text-farm-green-dark transition-colors">Gallery</Link>
          <Link to="/contact" className="font-medium hover:text-farm-green-dark transition-colors">Contact</Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <a href="tel:+9779812345678" className="btn-outline py-2 px-4">
            <Phone size={18} />
            <span>Call to Order</span>
          </a>
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-farm-green-dark text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <nav className="container-custom py-4 flex flex-col gap-4">
            <Link to="/" className="font-medium px-4 py-2 hover:bg-farm-cream rounded-md" onClick={toggleMenu}>Home</Link>
            <Link to="/products" className="font-medium px-4 py-2 hover:bg-farm-cream rounded-md" onClick={toggleMenu}>Products</Link>
            <Link to="/order-now" className="font-medium px-4 py-2 hover:bg-farm-cream rounded-md" onClick={toggleMenu}>Order Now</Link>
            <Link to="/gallery" className="font-medium px-4 py-2 hover:bg-farm-cream rounded-md" onClick={toggleMenu}>Gallery</Link>
            <Link to="/contact" className="font-medium px-4 py-2 hover:bg-farm-cream rounded-md" onClick={toggleMenu}>Contact</Link>
            <div className="flex flex-col gap-3 mt-2">
              <a href="tel:+9779812345678" className="btn-primary">
                <Phone size={18} />
                <span>Call to Order</span>
              </a>
              <Link to="/cart" className="btn-secondary flex items-center justify-center gap-2">
                <ShoppingCart size={18} />
                <span>Cart (0)</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
