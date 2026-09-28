import { db } from '../config/database.js';

export class TestObservation {
  static async getByReportId(reportId) {
    return db.getObservationsByReportId(reportId);
  }

  static async saveBatch(reportId, observations) {
    return db.saveObservations(reportId, observations);
  }
}
