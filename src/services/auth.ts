import { apiClient } from './api';

export interface User {
  id: string;
  email: string;
  role: string;
  user_metadata?: any;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

class AuthService {
  private authState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
  };

  async register(email: string, password: string, role: string, storeName?: string, address?: string, name?: string) {
    const response = await apiClient.register(email, password, role, storeName, address, name);
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await apiClient.login(email, password);
    const { session, user } = response.data;

    // Guardar token
    localStorage.setItem('token', session.access_token);
    localStorage.setItem('user', JSON.stringify(user));

    this.authState = {
      user,
      token: session.access_token,
      isAuthenticated: true,
    };

    return this.authState;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authState = {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export const authService = new AuthService();
