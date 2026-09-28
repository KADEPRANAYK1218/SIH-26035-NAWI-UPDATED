import { db } from '../config/database.js';

export class Attachment {
  static async getByReportId(reportId) {
    return db.getAttachmentsByReportId(reportId);
  }

  static async create(attachmentData) {
    return db.createAttachment(attachmentData);
  }
}
