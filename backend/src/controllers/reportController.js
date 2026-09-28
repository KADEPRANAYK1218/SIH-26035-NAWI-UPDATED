import { TestReport } from '../models/TestReport.js';
import { Instrument } from '../models/Instrument.js';
import { ComplianceService } from '../services/complianceService.js';
import { ValidationService } from '../services/validationService.js';
import { PdfService } from '../services/pdfService.js';
import { WordService } from '../services/wordService.js';
import { db } from '../config/database.js';

export class ReportController {
  static async getAll(req, res, next) {
    try {
      const { status, overallResult, search, fromDate, toDate } = req.query;
      const reports = await TestReport.getAll({
        status,
        overallResult,
        search,
        fromDate,
        toDate
      });

      return res.json({
        success: true,
        count: reports.length,
        data: reports
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const report = await TestReport.findById(req.params.id);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Test report not found.'
        });
      }
      return res.json({
        success: true,
        data: report
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { instrument, laboratoryConditions, observations, remarks } = req.body;

      if (!instrument) {
        return res.status(400).json({
          success: false,
          message: 'Instrument data is required.'
        });
      }

      // Check / save instrument
      let instrumentRecord;
      if (instrument.id) {
        instrumentRecord = await Instrument.findById(instrument.id);
      }
      if (!instrumentRecord) {
        const instVal = ValidationService.validateInstrument(instrument);
        if (!instVal.isValid) {
          return res.status(400).json({
            success: false,
            message: 'Instrument validation failed.',
            errors: instVal.errors
          });
        }
        instrumentRecord = await Instrument.create(instrument);
      }

      // Validate observations
      if (observations && observations.length > 0) {
        const obsVal = ValidationService.validateObservations(observations);
        if (!obsVal.isValid) {
          return res.status(400).json({
            success: false,
            message: 'Observation validation failed.',
            errors: obsVal.errors
          });
        }
      }

      // Evaluate compliance
      const compliance = ComplianceService.evaluateCompliance(observations, instrumentRecord);

      // Report payload
      const reportPayload = {
        instrumentId: instrumentRecord.id,
        laboratoryId: laboratoryConditions?.laboratoryId || 'RRSL-DEL-01',
        laboratoryName: laboratoryConditions?.laboratoryName || 'Regional Reference Standards Laboratory',
        testEngineerId: req.user?.id || 'USR-002',
        testEngineerName: req.user?.name || 'Sunita Verma',
        testDate: laboratoryConditions?.testDate || new Date().toISOString().slice(0, 10),
        status: compliance.status || 'COMPLETED',
        overallResult: compliance.overallResult || 'PASS',
        standardApplied: 'OIML R 76-1 (2006) / Legal Metrology (General) Rules 2011',
        remarks: remarks || (compliance.overallResult === 'PASS' ? 'All evaluated test points comply with configured requirements.' : 'Instrument failed one or more tolerance checks.')
      };

      const newReport = await TestReport.create(
        reportPayload,
        laboratoryConditions,
        compliance.calculatedObservations || observations
      );

      await db.logAction(
        req.user?.id || 'SYS',
        req.user?.email || 'sys@example.com',
        'CREATE_REPORT',
        'TEST_REPORT',
        newReport.id,
        `Generated test report ${newReport.reportNumber} with result ${newReport.overallResult}`
      );

      return res.status(201).json({
        success: true,
        message: 'Test report generated and saved successfully.',
        data: newReport
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const updated = await TestReport.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Report not found.'
        });
      }
      return res.json({
        success: true,
        message: 'Report updated successfully.',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const success = await TestReport.delete(req.params.id);
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Report not found.'
        });
      }
      return res.json({
        success: true,
        message: 'Report deleted successfully.'
      });
    } catch (err) {
      next(err);
    }
  }

  static async sign(req, res, next) {
    try {
      const { signType } = req.body; // 'engineer' or 'reviewer'
      const report = await TestReport.findById(req.params.id);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Report not found.'
        });
      }

      const updates = {};
      const now = new Date().toISOString();

      if (signType === 'reviewer' || req.user?.role === 'REVIEWER') {
        updates.signedByReviewer = true;
        updates.reviewerSignedAt = now;
        updates.reviewerId = req.user?.id;
        updates.reviewerName = req.user?.name;
        if (report.status === 'PENDING_REVIEW') {
          updates.status = report.overallResult === 'PASS' ? 'COMPLETED' : 'FAILED';
        }
      } else {
        updates.signedByEngineer = true;
        updates.engineerSignedAt = now;
        updates.testEngineerId = req.user?.id;
        updates.testEngineerName = req.user?.name;
      }

      const updated = await TestReport.update(report.id, updates);
      await db.logAction(
        req.user?.id || 'SYS',
        req.user?.email || 'sys@example.com',
        'SIGN_REPORT',
        'TEST_REPORT',
        report.id,
        `Digitally signed (${signType}) report ${report.reportNumber}`
      );

      return res.json({
        success: true,
        message: `Report signed successfully as ${signType || 'Engineer'}. (Note: Prototype signature for demonstration).`,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static async exportPdf(req, res, next) {
    try {
      const report = await TestReport.findById(req.params.id);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Report not found.'
        });
      }

      const pdfBuffer = await PdfService.generateReportPdf(report);
      const isInline = req.query.inline === 'true' || req.query.view === 'true';
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `${isInline ? 'inline' : 'attachment'}; filename="${report.reportNumber || report.id}-OIML-R76-Report.pdf"`
      );
      return res.send(pdfBuffer);
    } catch (err) {
      next(err);
    }
  }

  static async exportDocx(req, res, next) {
    try {
      const report = await TestReport.findById(req.params.id);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Report not found.'
        });
      }

      const docxBuffer = await WordService.generateReportDocx(report);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${report.reportNumber || report.id}-OIML-R76-Report.docx"`);
      return res.send(docxBuffer);
    } catch (err) {
      next(err);
    }
  }

  static async getDashboardSummary(req, res, next) {
    try {
      const summary = await db.getDashboardSummary();
      const recentReports = await TestReport.getAll();
      return res.json({
        success: true,
        data: {
          ...summary,
          recentReports: recentReports.slice(0, 5)
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async getRegulatoryReferences(req, res, next) {
    try {
      const references = await db.getRegulatoryReferences();
      return res.json({
        success: true,
        data: references
      });
    } catch (err) {
      next(err);
    }
  }

  static async getRuleConfigurations(req, res, next) {
    try {
      const rules = await db.getRuleConfigurations();
      return res.json({
        success: true,
        data: rules
      });
    } catch (err) {
      next(err);
    }
  }
}
