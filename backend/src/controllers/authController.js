import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { db } from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nawi-secret-metrology-demo-key-2026';

export class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required.'
        });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      // Check role if specified
      if (role && user.role !== role) {
        return res.status(403).json({
          success: false,
          message: `User is registered as ${user.role}, not ${role}. Please select the matching role.`
        });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      if (user.status === 'INACTIVE' || user.status === 'SUSPENDED') {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated. Please contact an administrator.'
        });
      }

      // Sign JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      await db.logAction(user.id, user.email, 'LOGIN', 'USER', user.id, `User logged in with role ${user.role}`);

      const { passwordHash, ...userData } = user;
      return res.json({
        success: true,
        message: 'Authentication successful.',
        data: {
          token,
          user: userData
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async register(req, res, next) {
    try {
      const { name, email, password, role, department } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required.'
        });
      }

      const existing = await User.findByEmail(email);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name,
        email,
        passwordHash,
        role: role || 'TEST_ENGINEER',
        department: department || 'Regional Reference Standards Laboratory'
      });

      const { passwordHash: _, ...safeUser } = newUser;
      return res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        data: safeUser
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }
      const { passwordHash, ...safeUser } = user;
      return res.json({
        success: true,
        data: safeUser
      });
    } catch (err) {
      next(err);
    }
  }
}
