import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { db } from '../config/database.js';

export class UserController {
  static async getAllUsers(req, res, next) {
    try {
      const users = await User.getAll();
      return res.json({
        success: true,
        data: users
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const { role, status, department, name } = req.body;
      const updated = await User.update(req.params.id, {
        ...(role && { role }),
        ...(status && { status }),
        ...(department && { department }),
        ...(name && { name })
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      await db.logAction(
        req.user?.id || 'SYS',
        req.user?.email || 'sys@example.com',
        'UPDATE_USER',
        'USER',
        req.params.id,
        `Updated user attributes: ${JSON.stringify(req.body)}`
      );

      return res.json({
        success: true,
        message: 'User updated successfully.',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      const updated = await User.update(req.params.id, { passwordHash });
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      await db.logAction(
        req.user?.id || 'SYS',
        req.user?.email || 'sys@example.com',
        'RESET_PASSWORD',
        'USER',
        req.params.id,
        'Reset user password'
      );

      return res.json({
        success: true,
        message: 'Password reset successfully.'
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAuditLogs(req, res, next) {
    try {
      const logs = await db.getAuditLogs();
      return res.json({
        success: true,
        data: logs
      });
    } catch (err) {
      next(err);
    }
  }
}
