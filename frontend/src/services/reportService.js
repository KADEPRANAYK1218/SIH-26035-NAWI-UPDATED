import api from './api.js';

export const reportService = {
  async getAll(params = {}) {
    return api.get('/reports', { params });
  },

  async getAllReports(params = {}) {
    return api.get('/reports', { params });
  },

  async getById(id) {
    return api.get(`/reports/${id}`);
  },

  async create(data) {
    return api.post('/reports', data);
  },

  async update(id, data) {
    return api.put(`/reports/${id}`, data);
  },

  async sign(id, signType) {
    return api.post(`/reports/${id}/sign`, { signType });
  },

  async delete(id) {
    return api.delete(`/reports/${id}`);
  },

  getPdfUrl(id) {
    const base = import.meta.env.VITE_API_URL || '/api';
    return `${base}/reports/${id}/pdf`;
  },

  getPdfViewUrl(id) {
    const base = import.meta.env.VITE_API_URL || '/api';
    return `${base}/reports/${id}/pdf?view=true`;
  },

  getDocxUrl(id) {
    const base = import.meta.env.VITE_API_URL || '/api';
    return `${base}/reports/${id}/docx`;
  },

  async downloadPdf(id, reportNumber = '') {
    const base = import.meta.env.VITE_API_URL || '/api';
    const res = await fetch(`${base}/reports/${id}/pdf`);
    if (!res.ok) throw new Error('Failed to download PDF');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportNumber || id}-OIML-R76-Report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  async downloadDocx(id, reportNumber = '') {
    const base = import.meta.env.VITE_API_URL || '/api';
    const res = await fetch(`${base}/reports/${id}/docx`);
    if (!res.ok) throw new Error('Failed to download Word document');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportNumber || id}-OIML-R76-Report.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  async getDashboardSummary() {
    return api.get('/reports/dashboard/summary');
  },

  async getRegulatoryReferences() {
    return api.get('/reports/regulatory-references');
  },

  async getRules() {
    return api.get('/reports/rules');
  },

  async uploadAttachment(reportId, file) {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/reports/${reportId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
