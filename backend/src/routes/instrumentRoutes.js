import { Router } from 'express';
import { InstrumentController } from '../controllers/instrumentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', authMiddleware, InstrumentController.getAll);
router.get('/:id', authMiddleware, InstrumentController.getById);
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN', 'LABORATORY_OFFICER', 'TEST_ENGINEER']),
  InstrumentController.create
);
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN', 'LABORATORY_OFFICER', 'TEST_ENGINEER']),
  InstrumentController.update
);

export default router;
