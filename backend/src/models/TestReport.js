import { db } from '../config/database.js';

export class TestReport {
  static async getAll(filters) {
    return db.getAllReports(filters);
  }

  static async findById(id) {
    return db.findReportById(id);
  }

  static async create(reportData, labData, observations) {
    return db.createReport(reportData, labData, observations);
  }

  static async update(id, updates) {
    return db.updateReport(id, updates);
  }

  static async delete(id) {
    return db.deleteReport(id);
  }
}
