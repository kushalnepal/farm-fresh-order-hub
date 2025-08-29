const API_BASE_URL = 'http://localhost:5000/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  tags: string;
  category?: string;
  inStock: boolean;
  onSale?: boolean;
  salePrice?: number;
  createdAt: string;
  updatedAt: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, errorText || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(name: string, email: string, password: string, role: 'USER' | 'ADMIN' = 'USER'): Promise<{ token: string; user: User }> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  // Product endpoints
  async getProducts() {
    return this.request('/products/');
  }

  async getProductById(id: string) {
    return this.request(`/products/${id}`);
  }

  async createProduct(product: {
    name: string;
    price: number;
    description: string;
    tags: string;
  }) {
    return this.request('/products/createproduct', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: {
    name?: string;
    price?: number;
    description?: string;
    tags?: string;
  }) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin user management endpoints
  async getUsers(): Promise<User[]> {
    return this.request('/admin/users');
  }

  async getUserById(id: string): Promise<User> {
    return this.request(`/admin/users/${id}`);
  }

  async updateUser(id: string, updates: { name?: string; email?: string; role?: 'USER' | 'ADMIN' }): Promise<User> {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin product management endpoints
  async createAdminProduct(product: {
    name: string;
    price: number;
    description: string;
    tags: string;
    category?: string;
    inStock?: boolean;
    onSale?: boolean;
    salePrice?: number;
  }): Promise<Product> {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async getAdminProducts(): Promise<Product[]> {
    return this.request('/admin/products');
  }

  async getAdminProductById(id: string): Promise<Product> {
    return this.request(`/admin/products/${id}`);
  }

  async updateAdminProduct(id: string, updates: {
    name?: string;
    price?: number;
    description?: string;
    tags?: string;
    category?: string;
    inStock?: boolean;
    onSale?: boolean;
    salePrice?: number;
  }): Promise<Product> {
    return this.request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteAdminProduct(id: string): Promise<void> {
    return this.request(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
export { ApiError, type User, type Product };