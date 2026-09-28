import { db } from '../config/database.js';

export class User {
  static async findByEmail(email) {
    return db.findUserByEmail(email);
  }

  static async findById(id) {
    return db.findUserById(id);
  }

  static async getAll() {
    return db.getAllUsers();
  }

  static async create(userData) {
    return db.createUser(userData);
  }

  static async update(id, updates) {
    return db.updateUser(id, updates);
  }
}
