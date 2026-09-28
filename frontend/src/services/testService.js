import api from './api.js';

export const testService = {
  async getProcedures() {
    return api.get('/tests/procedures');
  },

  async calculate(observations, instrument) {
    return api.post('/tests/calculate', { observations, instrument });
  },

  async validate(payload) {
    return api.post('/tests/validate', payload);
  },

  async getByReportId(reportId) {
    return api.get(`/tests/${reportId}`);
  },

  async saveObservations(reportId, observations) {
    return api.post(`/tests/${reportId}/save`, { observations });
  }
};
