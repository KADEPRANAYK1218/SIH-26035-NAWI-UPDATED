/**
 * OIML R 76-1 (2006) / Legal Metrology (General) Rules 2011 (Eighth Schedule)
 * Rule Configuration & Verification Engine
 * 
 * DISCLAIMER:
 * This is a prototype / demonstration rule configuration.
 * Always verify against the official Gazette notification / OIML R 76 standard
 * before actual regulatory enforcement.
 */

export const OIML_R76_METADATA = {
  standard: 'OIML R 76-1',
  version: 'Edition 2006 (E)',
  nationalStandard: 'Legal Metrology (General) Rules, 2011 (Eighth Schedule, Part II)',
  authority: 'Department of Consumer Affairs, Government of India',
  effectiveDate: '2011-04-01',
  prototypeNotice: 'Demo rule configuration – verify against the applicable official standard before regulatory use.'
};

/**
 * Standard test procedures supported by OIML R 76
 */
export const OIML_TEST_PROCEDURES = [
  {
    id: 'zero-setting',
    name: 'Zero-setting & Zero-tracking',
    oimlClause: 'A.4.1 / A.4.2',
    description: 'Residual zero-setting deviation after zero balancing with zero load (tolerance ±0.25 e).',
    mandatory: true,
    defaultPoints: ['Zero load (0.0 kg)', 'Zero tracking speed test']
  },
  {
    id: 'weighing-performance',
    name: 'Weighing Performance (Load Test)',
    oimlClause: 'A.4.4',
    description: 'Increasing and decreasing loads from Min to Max in at least 5 distributed test steps.',
    mandatory: true,
    defaultPoints: ['Min capacity', '500 e threshold', '2000 e threshold', '50% Max', 'Max capacity']
  },
  {
    id: 'repeatability',
    name: 'Repeatability Test',
    oimlClause: 'A.4.10',
    description: 'Series of 3 or 10 repeated weighings at approximately 50% Max and close to Max.',
    mandatory: true,
    defaultPoints: ['Run 1 (50% Max)', 'Run 2 (50% Max)', 'Run 3 (50% Max)']
  },
  {
    id: 'eccentricity',
    name: 'Eccentricity / Off-centre Loading',
    oimlClause: 'A.4.7',
    description: 'Off-centre loading at ~1/3 Max on 4 quarters/corners and centre of the load receptor.',
    mandatory: true,
    defaultPoints: ['Position 1 - Centre', 'Position 2 - Front Left', 'Position 3 - Back Left', 'Position 4 - Back Right', 'Position 5 - Front Right']
  },
  {
    id: 'tare',
    name: 'Tare Weighing & Balancing',
    oimlClause: 'A.4.6',
    description: 'Tare mechanism accuracy under subtractive tare loads; net indication error within mpe.',
    mandatory: false,
    defaultPoints: ['Tare balanced at 20% Max', 'Tare balanced at 50% Max']
  },
  {
    id: 'discrimination',
    name: 'Discrimination Test',
    oimlClause: 'A.4.8',
    description: 'Response to an extra load equal to 1.4 d placed smoothly on load receptor at Min, 1/2 Max and Max.',
    mandatory: false,
    defaultPoints: ['Min + 1.4d', '1/2 Max + 1.4d', 'Max + 1.4d']
  },
  {
    id: 'temperature-influence',
    name: 'Temperature Influence Factor',
    oimlClause: 'A.5.3',
    description: 'Span stability across specified temperature limits (e.g., -10°C to +40°C or specified band).',
    mandatory: false,
    defaultPoints: ['Reference Temp (+20°C)', 'High Temp (+40°C)', 'Low Temp (-10°C)']
  },
  {
    id: 'voltage-variation',
    name: 'Voltage Variation Test',
    oimlClause: 'A.5.4',
    description: 'Zero indication and span error under mains voltage variations (-15% to +10% of nominal).',
    mandatory: false,
    defaultPoints: ['Nominal (230V)', 'High limit (253V)', 'Low limit (195V)']
  }
];

/**
 * Calculates Maximum Permissible Error (mpe) in terms of verification interval 'e'
 * according to OIML R 76-1 Table 6 (Initial Verification)
 * 
 * @param {string} accuracyClass - 'I', 'II', 'III', 'IIII'
 * @param {number} loadInVerificationIntervals - m / e
 * @returns {number} mpe in units of 'e'
 */
export function getMPEInVerificationIntervals(accuracyClass, loadInVerificationIntervals) {
  const m = Math.abs(Number(loadInVerificationIntervals));
  const cls = (accuracyClass || 'III').toUpperCase();

  switch (cls) {
    case 'I': // Special accuracy
      if (m <= 50000) return 0.5;
      if (m <= 200000) return 1.0;
      return 1.5;

    case 'II': // High accuracy
      if (m <= 5000) return 0.5;
      if (m <= 20000) return 1.0;
      if (m <= 100000) return 1.5;
      return 1.5;

    case 'III': // Medium accuracy (most commercial bench / platform / retail scales)
      if (m <= 500) return 0.5;
      if (m <= 2000) return 1.0;
      if (m <= 10000) return 1.5;
      return 1.5;

    case 'IIII': // Ordinary accuracy (crane scales, heavy weighbridges)
      if (m <= 50) return 0.5;
      if (m <= 200) return 1.0;
      if (m <= 1000) return 1.5;
      return 1.5;

    default:
      if (m <= 500) return 0.5;
      if (m <= 2000) return 1.0;
      return 1.5;
  }
}

/**
 * Computes exact mpe in engineering units (kg, g, etc.) for a specific reference load
 * 
 * @param {Object} instrument
 * @param {number} referenceLoad
 * @param {string} testType
 * @returns {Object} { mpeValue, mpeUnit, mpeText, clause }
 */
export function getApplicableRequirement(instrument, referenceLoad, testType = 'Weighing performance') {
  const e = Number(instrument.verificationScaleInterval) || 0.005;
  const unit = instrument.unit || 'kg';
  const accClass = instrument.accuracyClass || 'III';
  const ref = Math.abs(Number(referenceLoad) || 0);

  // Zero-setting has specific limit of ±0.25 e
  if (testType.toLowerCase().includes('zero')) {
    const limit = 0.25 * e;
    return {
      mpeFactor: 0.25,
      mpeValue: limit,
      mpeUnit: unit,
      mpeText: `±0.25 e (±${limit.toFixed(4)} ${unit})`,
      clause: 'OIML R 76-1: 4.5.1'
    };
  }

  // Load in units of 'e'
  const mInE = e > 0 ? ref / e : 0;
  const factor = getMPEInVerificationIntervals(accClass, mInE);
  const mpeValue = factor * e;

  if (testType.toLowerCase().includes('repeatability')) {
    return {
      mpeFactor: factor,
      mpeValue: mpeValue,
      mpeUnit: unit,
      mpeText: `Max diff ≤ ${factor} e (${mpeValue.toFixed(4)} ${unit})`,
      clause: 'OIML R 76-1: 3.6.1'
    };
  }

  return {
    mpeFactor: factor,
    mpeValue: mpeValue,
    mpeUnit: unit,
    mpeText: `±${factor} e (±${mpeValue.toFixed(4)} ${unit})`,
    clause: `OIML R 76-1: 3.5.1 (Class ${accClass})`
  };
}
