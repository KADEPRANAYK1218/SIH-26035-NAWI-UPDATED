import api from './api.js';

export const authService = {
  async login(email, password, role) {
    const res = await api.post('/auth/login', { email, password, role });
    if (res.success && res.data?.token) {
      localStorage.setItem('nawi_token', res.data.token);
      localStorage.setItem('nawi_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  async register(userData) {
    const res = await api.post('/auth/register', userData);
    return res;
  },

  async getMe() {
    return api.get('/auth/me');
  },

  logout() {
    localStorage.removeItem('nawi_token');
    localStorage.removeItem('nawi_user');
  },

  getCurrentUser() {
    try {
      const user = localStorage.getItem('nawi_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('nawi_token');
  }
};
