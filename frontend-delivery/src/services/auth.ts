import { apiClient } from './api';

export interface User {
  id: string;
  email: string;
  role: string;
  metadata?: any;
}

class AuthService {
  async register(email: string, password: string, name?: string) {
    const response = await apiClient.register(email, password, name);
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await apiClient.login(email, password);
    const { session, user } = response.data;

    localStorage.setItem('token', session.access_token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, session };
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
