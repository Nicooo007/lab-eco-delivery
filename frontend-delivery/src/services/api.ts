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
  async register(email: string, password: string, name?: string) {
    return this.client.post('/auth/register', {
      email,
      password,
      role: 'delivery',
      name,
    });
  }

  async login(email: string, password: string) {
    return this.client.post('/auth/login', {
      email,
      password,
    });
  }

  // Orders - Delivery
  async getAvailableOrders() {
    return this.client.get('/orders/available/list');
  }

  async acceptOrder(orderId: string) {
    return this.client.patch(`/orders/${orderId}/accept`);
  }

  async rejectOrder(orderId: string) {
    return this.client.patch(`/orders/${orderId}/reject`);
  }

  async getMyDeliveries() {
    return this.client.get('/orders/my-deliveries/list');
  }

  async getOrderById(id: string) {
    return this.client.get(`/orders/${id}`);
  }
}

export const apiClient = new ApiClient();
