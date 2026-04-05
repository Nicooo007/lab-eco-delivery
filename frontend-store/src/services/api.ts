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
  async register(email: string, password: string, role: string, storeName?: string) {
    return this.client.post('/auth/register', {
      email,
      password,
      role,
      storeName,
    });
  }

  async login(email: string, password: string) {
    return this.client.post('/auth/login', {
      email,
      password,
    });
  }

  // Stores
  async getMyStore() {
    return this.client.get('/stores/me');
  }

  async updateStoreStatus(storeId: string, isOpen: boolean) {
    return this.client.patch(`/stores/${storeId}/status`, {
      is_open: isOpen,
    });
  }

  // Products
  async getMyProducts(storeId: string) {
    return this.client.get(`/products/store/${storeId}`);
  }

  async createProduct(storeId: string, name: string, price: number) {
    return this.client.post(`/products/${storeId}`, {
      name,
      price,
    });
  }

  // Orders
  async getStoreOrders(storeId: string) {
    return this.client.get(`/orders/store/${storeId}`);
  }

  async getOrderById(id: string) {
    return this.client.get(`/orders/${id}`);
  }
}

export const apiClient = new ApiClient();
