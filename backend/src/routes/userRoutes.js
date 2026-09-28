import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

// User management endpoints (ADMIN only)
router.get('/', authMiddleware, roleMiddleware(['ADMIN']), UserController.getAllUsers);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), UserController.updateUser);
router.post('/:id/reset-password', authMiddleware, roleMiddleware(['ADMIN']), UserController.resetPassword);
router.get('/audit-logs', authMiddleware, roleMiddleware(['ADMIN']), UserController.getAuditLogs);

export default router;
