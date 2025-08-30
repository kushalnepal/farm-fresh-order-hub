const API_BASE_URL = 'https://ecommerce-backend.kushalnepal.com.np/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
  updatedAt?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  tags: string;
  image?: string;
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
  private getAuthHeaders(isFormData = false) {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {
      ...(token && { Authorization: `Bearer ${token}` })
    };
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  }

  private async request<T>(endpoint: string, options?: RequestInit & { isFormData?: boolean }): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const { isFormData, ...fetchOptions } = options || {};
    
    const response = await fetch(url, {
      headers: this.getAuthHeaders(isFormData),
      ...fetchOptions,
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
  async getProducts(skip?: number): Promise<Product[]> {
    const params = skip ? `?skip=${skip}` : '';
    return this.request(`/products/${params}`);
  }

  async getProductById(id: string) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData: {
    name: string;
    price: number;
    description: string;
    tags: string;
    image?: File;
  }) {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price.toString());
    formData.append('description', productData.description);
    formData.append('tags', productData.tags);
    
    if (productData.image) {
      formData.append('image', productData.image);
    }
    
    return this.request('/products/createproduct', {
      method: 'POST',
      body: formData,
      isFormData: true,
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