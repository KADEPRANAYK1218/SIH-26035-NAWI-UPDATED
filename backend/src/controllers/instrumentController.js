import { Instrument } from '../models/Instrument.js';
import { ValidationService } from '../services/validationService.js';
import { db } from '../config/database.js';

export class InstrumentController {
  static async getAll(req, res, next) {
    try {
      const instruments = await Instrument.getAll();
      return res.json({
        success: true,
        data: instruments
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const instrument = await Instrument.findById(req.params.id);
      if (!instrument) {
        return res.status(404).json({
          success: false,
          message: 'Instrument not found.'
        });
      }
      return res.json({
        success: true,
        data: instrument
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const validation = ValidationService.validateInstrument(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed.',
          errors: validation.errors
        });
      }

      const instrument = await Instrument.create(req.body);
      await db.logAction(
        req.user?.id || 'ANON',
        req.user?.email || 'anon@example.com',
        'CREATE_INSTRUMENT',
        'INSTRUMENT',
        instrument.id,
        `Created instrument model ${instrument.model} SN ${instrument.serialNumber}`
      );

      return res.status(201).json({
        success: true,
        message: 'Instrument created successfully.',
        data: instrument
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const updated = await Instrument.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Instrument not found.'
        });
      }
      return res.json({
        success: true,
        message: 'Instrument updated successfully.',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }
}
