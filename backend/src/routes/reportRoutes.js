import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { ReportController } from '../controllers/reportController.js';
import { Attachment } from '../models/Attachment.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

// Configure Multer storage
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf|doc|docx/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, PDF, and DOCX files are allowed.'));
    }
  }
});

// Dashboard Analytics
router.get('/dashboard/summary', authMiddleware, ReportController.getDashboardSummary);

// Regulatory & Rule Endpoints
router.get('/regulatory-references', ReportController.getRegulatoryReferences);
router.get('/rules', ReportController.getRuleConfigurations);

// Reports CRUD
router.get('/', authMiddleware, ReportController.getAll);
router.get('/:id', authMiddleware, ReportController.getById);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN', 'LABORATORY_OFFICER', 'TEST_ENGINEER']),
  ReportController.create
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN', 'LABORATORY_OFFICER', 'TEST_ENGINEER', 'REVIEWER']),
  ReportController.update
);

router.post(
  '/:id/sign',
  authMiddleware,
  roleMiddleware(['ADMIN', 'TEST_ENGINEER', 'REVIEWER', 'LABORATORY_OFFICER']),
  ReportController.sign
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  ReportController.delete
);

// Exports
router.get('/:id/pdf', ReportController.exportPdf);
router.get('/:id/docx', ReportController.exportDocx);

// Attachments
router.get('/:id/attachments', authMiddleware, async (req, res, next) => {
  try {
    const attachments = await Attachment.getByReportId(req.params.id);
    res.json({ success: true, data: attachments });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/:id/attachments',
  authMiddleware,
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
      }

      const attachment = await Attachment.create({
        reportId: req.params.id,
        filename: req.file.originalname,
        fileType: req.file.mimetype,
        storagePath: req.file.path,
        fileSize: req.file.size,
        uploadedBy: req.user.id
      });

      res.status(201).json({
        success: true,
        message: 'Attachment uploaded successfully.',
        data: attachment
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
