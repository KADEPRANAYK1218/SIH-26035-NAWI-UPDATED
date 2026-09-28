/**
 * Compliance Engine
 * Evaluates test results, applies OIML R 76 tolerances, and computes overall compliance
 */

import { CalculationService } from './calculationService.js';

export class ComplianceService {
  /**
   * Evaluates overall report compliance given observations and instrument details
   */
  static evaluateCompliance(observations, instrument) {
    if (!observations || observations.length === 0) {
      return {
        overallResult: 'PENDING',
        summary: [],
        hasFailures: false,
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        status: 'IN_PROGRESS',
        reasons: ['No test observations recorded yet.']
      };
    }

    // Run calculation service on all observations
    const calculatedObservations = CalculationService.calculateBatch(observations, instrument);

    // Group by test type
    const grouped = {};
    calculatedObservations.forEach(obs => {
      const type = obs.testType || 'General Test';
      if (!grouped[type]) {
        grouped[type] = {
          testType: type,
          points: [],
          passCount: 0,
          failCount: 0,
          result: 'PASS',
          remarks: ''
        };
      }
      grouped[type].points.push(obs);
      if (obs.result === 'PASS') {
        grouped[type].passCount++;
      } else {
        grouped[type].failCount++;
        grouped[type].result = 'FAIL';
      }
    });

    // Check each group result
    const summary = Object.values(grouped).map(group => {
      if (group.failCount > 0) {
        group.remarks = `${group.failCount} observation(s) exceeded the applicable configured requirement.`;
      } else {
        group.remarks = `All ${group.passCount} test point(s) met the applicable configured requirement.`;
      }
      return group;
    });

    const failedGroups = summary.filter(g => g.result === 'FAIL');
    const hasFailures = failedGroups.length > 0;
    const overallResult = hasFailures ? 'FAIL' : 'PASS';
    const status = hasFailures ? 'FAILED' : 'COMPLETED';

    const reasons = [];
    if (hasFailures) {
      failedGroups.forEach(g => {
        reasons.push(`Test "${g.testType}" had ${g.failCount} point(s) out of tolerance.`);
      });
    } else {
      reasons.push('All evaluated test points comply with configured OIML R 76 requirements.');
    }

    return {
      overallResult,
      status,
      summary,
      hasFailures,
      totalObservations: calculatedObservations.length,
      failedObservations: calculatedObservations.filter(o => o.result === 'FAIL').length,
      passedObservations: calculatedObservations.filter(o => o.result === 'PASS').length,
      reasons,
      calculatedObservations
    };
  }
}
