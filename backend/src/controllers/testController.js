import { CalculationService } from '../services/calculationService.js';
import { ValidationService } from '../services/validationService.js';
import { ComplianceService } from '../services/complianceService.js';
import { TestObservation } from '../models/TestObservation.js';
import { OIML_TEST_PROCEDURES, OIML_R76_METADATA } from '../rules/oimlR76Rules.js';

export class TestController {
  static getProcedures(req, res) {
    return res.json({
      success: true,
      metadata: OIML_R76_METADATA,
      data: OIML_TEST_PROCEDURES
    });
  }

  static async calculate(req, res, next) {
    try {
      const { observations, instrument } = req.body;

      if (!observations || !Array.isArray(observations)) {
        return res.status(400).json({
          success: false,
          message: 'Observations array is required.'
        });
      }

      if (!instrument) {
        return res.status(400).json({
          success: false,
          message: 'Instrument specifications are required for tolerance calculations.'
        });
      }

      const calculatedObservations = CalculationService.calculateBatch(observations, instrument);
      const metrics = CalculationService.calculateInstrumentMetrics(instrument);
      const compliance = ComplianceService.evaluateCompliance(observations, instrument);

      return res.json({
        success: true,
        data: {
          observations: calculatedObservations,
          metrics,
          compliance
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async validate(req, res, next) {
    try {
      const { instrument, labConditions, observations } = req.body;
      const errors = [];

      if (instrument) {
        const instVal = ValidationService.validateInstrument(instrument);
        if (!instVal.isValid) errors.push(...instVal.errors);
      }

      if (labConditions) {
        const labVal = ValidationService.validateLaboratoryConditions(labConditions);
        if (!labVal.isValid) errors.push(...labVal.errors);
      }

      if (observations) {
        const obsVal = ValidationService.validateObservations(observations);
        if (!obsVal.isValid) errors.push(...obsVal.errors);
      }

      return res.json({
        success: errors.length === 0,
        isValid: errors.length === 0,
        errors
      });
    } catch (err) {
      next(err);
    }
  }

  static async getByReportId(req, res, next) {
    try {
      const observations = await TestObservation.getByReportId(req.params.reportId);
      return res.json({
        success: true,
        data: observations
      });
    } catch (err) {
      next(err);
    }
  }

  static async saveObservations(req, res, next) {
    try {
      const { observations } = req.body;
      const reportId = req.params.reportId;
      const saved = await TestObservation.saveBatch(reportId, observations);
      return res.json({
        success: true,
        message: 'Observations saved successfully.',
        data: saved
      });
    } catch (err) {
      next(err);
    }
  }
}
