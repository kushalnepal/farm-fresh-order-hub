
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simple admin credentials (in a real app, this would be properly secured)
  const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin123"
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate login delay
    setTimeout(() => {
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminAuth', 'true');
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin panel!",
        });
        navigate("/admin");
      } else {
        setError("Invalid admin credentials");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-farm-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-farm-green-dark flex items-center justify-center text-white font-bold text-xl">F</div>
            <div className="font-poppins font-bold text-xl">
              <span className="text-farm-green-dark">Farm</span>
              <span className="text-farm-brown-dark">Fresh</span>
            </div>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-farm-green-dark flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={32} />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Access the admin panel to manage products and sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-farm-green-dark hover:bg-farm-green-light"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In as Admin"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <div className="bg-blue-50 p-3 rounded-md mb-4">
                <p className="text-sm text-blue-800 font-medium">Demo Credentials:</p>
                <p className="text-xs text-blue-600">Username: admin</p>
                <p className="text-xs text-blue-600">Password: admin123</p>
              </div>
              
              <Link 
                to="/" 
                className="text-sm text-gray-500 hover:text-farm-green-dark"
              >
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
