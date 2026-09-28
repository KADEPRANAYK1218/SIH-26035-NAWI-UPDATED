import { Router } from 'express';
import { TestController } from '../controllers/testController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/procedures', TestController.getProcedures);
router.post('/calculate', TestController.calculate);
router.post('/validate', TestController.validate);
router.get('/:reportId', authMiddleware, TestController.getByReportId);
router.post('/:reportId/save', authMiddleware, TestController.saveObservations);

export default router;
