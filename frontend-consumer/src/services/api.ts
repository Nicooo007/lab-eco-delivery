import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
    });

    // Interceptor para agregar token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para manejo de errores
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async register(email: string, password: string, role: string, storeName?: string, address?: string, name?: string) {
    return this.client.post('/auth/register', {
      email,
      password,
      role,
      storeName,
      address,
      name,
    });
  }

  async login(email: string, password: string) {
    return this.client.post('/auth/login', {
      email,
      password,
    });
  }

  // Stores
  async getStores() {
    return this.client.get('/stores');
  }

  // Products
  async getProductsByStore(storeId: string) {
    return this.client.get(`/products/store/${storeId}`);
  }

  async getProductById(id: string) {
    return this.client.get(`/products/${id}`);
  }

  // Orders
  async createOrder(storeId: string, items: any[]) {
    return this.client.post('/orders', {
      store_id: storeId,
      items,
    });
  }

  async getMyOrders() {
    return this.client.get('/orders/my-orders');
  }

  async getOrderById(id: string) {
    return this.client.get(`/orders/${id}`);
  }
}

export const apiClient = new ApiClient();
