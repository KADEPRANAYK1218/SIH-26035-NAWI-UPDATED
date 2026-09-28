import { db } from '../config/database.js';

export class Instrument {
  static async getAll() {
    return db.getAllInstruments();
  }

  static async findById(id) {
    return db.findInstrumentById(id);
  }

  static async create(data) {
    return db.createInstrument(data);
  }

  static async update(id, updates) {
    return db.updateInstrument(id, updates);
  }
}
