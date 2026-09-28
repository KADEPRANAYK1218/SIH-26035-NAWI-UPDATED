/**
 * Validation Engine
 * Validates instrument data, laboratory conditions, and test observations
 */

export class ValidationService {
  /**
   * Validates Instrument technical specifications
   */
  static validateInstrument(instrument) {
    const errors = [];

    if (!instrument.manufacturer || !instrument.manufacturer.trim()) {
      errors.push('Manufacturer name is required.');
    }
    if (!instrument.model || !instrument.model.trim()) {
      errors.push('Model number is required.');
    }
    if (!instrument.serialNumber || !instrument.serialNumber.trim()) {
      errors.push('Serial number is required.');
    }
    if (!instrument.instrumentType) {
      errors.push('Instrument type is required.');
    }

    const max = Number(instrument.maxCapacity);
    const min = Number(instrument.minCapacity);
    const e = Number(instrument.verificationScaleInterval);

    if (isNaN(max) || max <= 0) {
      errors.push('Maximum capacity (Max) must be a positive numeric value.');
    }
    if (isNaN(e) || e <= 0) {
      errors.push('Verification scale interval (e) must be a positive numeric value.');
    }
    if (!isNaN(min) && !isNaN(max) && min >= max) {
      errors.push('Minimum capacity (Min) cannot be greater than or equal to Maximum capacity (Max).');
    }

    // Class validation check
    const validClasses = ['I', 'II', 'III', 'IIII'];
    if (instrument.accuracyClass && !validClasses.includes(instrument.accuracyClass)) {
      errors.push(`Invalid accuracy class. Must be one of: ${validClasses.join(', ')}.`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates Laboratory and Environmental Conditions
   */
  static validateLaboratoryConditions(conditions) {
    const errors = [];

    if (conditions.temperature !== undefined && conditions.temperature !== null && conditions.temperature !== '') {
      const temp = Number(conditions.temperature);
      if (isNaN(temp) || temp < -30 || temp > 70) {
        errors.push('Temperature must be a valid number between -30°C and 70°C.');
      }
    }

    if (conditions.humidity !== undefined && conditions.humidity !== null && conditions.humidity !== '') {
      const rh = Number(conditions.humidity);
      if (isNaN(rh) || rh < 0 || rh > 100) {
        errors.push('Relative humidity must be a percentage between 0% and 100%.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates Test Observations array
   */
  static validateObservations(observations) {
    const errors = [];

    if (!Array.isArray(observations) || observations.length === 0) {
      errors.push('At least one test observation is required.');
      return { isValid: false, errors };
    }

    observations.forEach((obs, index) => {
      const itemNum = index + 1;
      if (!obs.testType) {
        errors.push(`Observation #${itemNum}: Test type is required.`);
      }
      if (!obs.testPoint || !obs.testPoint.trim()) {
        errors.push(`Observation #${itemNum}: Test point description is required.`);
      }
      if (obs.referenceValue === undefined || obs.referenceValue === null || isNaN(Number(obs.referenceValue))) {
        errors.push(`Observation #${itemNum}: Reference load must be a valid numeric value.`);
      }
      if (obs.indicatedValue === undefined || obs.indicatedValue === null || isNaN(Number(obs.indicatedValue))) {
        errors.push(`Observation #${itemNum}: Indicated load must be a valid numeric value.`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
