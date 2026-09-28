/**
 * OIML R 76 Calculation Service
 * Computes indicated errors, permissible limits, and interval ratios
 */

import { getApplicableRequirement, getMPEInVerificationIntervals } from '../rules/oimlR76Rules.js';

export class CalculationService {
  /**
   * Calculates error for a single observation:
   * Error = Indicated Value - Reference Value
   */
  static calculateSingleObservation(observation, instrument) {
    const reference = Number(observation.referenceValue) || 0;
    const indicated = Number(observation.indicatedValue) || 0;
    const error = Number((indicated - reference).toFixed(5));
    const testType = observation.testType || 'Weighing performance';

    // Requirement evaluation from OIML R 76 rule engine
    const requirement = getApplicableRequirement(instrument, reference, testType);

    // Check pass/fail against rule engine
    const absError = Math.abs(error);
    const passed = absError <= (requirement.mpeValue + 0.000001);

    return {
      testType,
      testPoint: observation.testPoint || 'Test load',
      referenceValue: reference,
      indicatedValue: indicated,
      calculatedError: error,
      applicableRequirement: requirement.mpeText,
      mpeValue: requirement.mpeValue,
      result: passed ? 'PASS' : 'FAIL',
      remarks: observation.remarks || (passed ? 'Within permissible tolerance' : `Exceeded limit of ${requirement.mpeText}`)
    };
  }

  /**
   * Calculates errors and requirements for an entire batch of observations
   */
  static calculateBatch(observations, instrument) {
    if (!Array.isArray(observations)) return [];

    return observations.map(obs => this.calculateSingleObservation(obs, instrument));
  }

  /**
   * Computes instrument scale metrics:
   * n = Max / e
   */
  static calculateInstrumentMetrics(instrument) {
    const max = Number(instrument.maxCapacity) || 0;
    const min = Number(instrument.minCapacity) || 0;
    const e = Number(instrument.verificationScaleInterval) || 1;
    const d = Number(instrument.actualScaleInterval) || e;

    const n = e > 0 ? Math.round(max / e) : 0;
    const ratio_e_d = d > 0 ? e / d : 1;

    return {
      n,
      ratio_e_d,
      max,
      min,
      e,
      d
    };
  }
}
