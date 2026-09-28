import api from './api.js';

export const instrumentService = {
  async getAll() {
    return api.get('/instruments');
  },

  async getById(id) {
    return api.get(`/instruments/${id}`);
  },

  async create(data) {
    return api.post('/instruments', data);
  },

  async update(id, data) {
    return api.put(`/instruments/${id}`, data);
  }
};
