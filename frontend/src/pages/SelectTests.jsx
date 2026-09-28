import React from 'react';
import { CheckSquare, Square, CheckCircle, Info, ShieldCheck } from 'lucide-react';

const AVAILABLE_TESTS = [
  {
    id: 'zero-setting',
    title: 'Zero-setting & Zero-tracking',
    clause: 'OIML R 76-1: A.4.1 / A.4.2',
    description: 'Determines the zero error after balancing; residual zero error must not exceed ±0.25 e.',
    mandatory: true,
    pointsCount: '2 test points'
  },
  {
    id: 'weighing-performance',
    title: 'Weighing Performance (Load Test)',
    clause: 'OIML R 76-1: A.4.4',
    description: 'Increasing and decreasing load tests from Min to Max across ≥5 load steps to verify linearity and hysteresis.',
    mandatory: true,
    pointsCount: '5+ test points'
  },
  {
    id: 'eccentricity',
    title: 'Eccentricity (Off-Centre Loading)',
    clause: 'OIML R 76-1: A.4.7',
    description: 'Evaluation with ~1/3 Max placed at corners / eccentric positions of the load receptor.',
    mandatory: true,
    pointsCount: '4–5 positions'
  },
  {
    id: 'repeatability',
    title: 'Repeatability Test',
    clause: 'OIML R 76-1: A.4.10',
    description: 'Multiple weighings (3 to 10 series) of the same load to evaluate repeatability error.',
    mandatory: true,
    pointsCount: '3 series'
  },
  {
    id: 'tare',
    title: 'Tare Weighing & Balancing',
    clause: 'OIML R 76-1: A.4.6',
    description: 'Evaluation of the accuracy of tare devices and net indication error with subtractive tare loads.',
    mandatory: false,
    pointsCount: '2 test points'
  },
  {
    id: 'discrimination',
    title: 'Discrimination Test',
    clause: 'OIML R 76-1: A.4.8',
    description: 'Response of indicator to an additional load of 1.4 d placed smoothly on load receptor.',
    mandatory: false,
    pointsCount: '3 test points'
  },
  {
    id: 'temperature-influence',
    title: 'Temperature Influence Factor',
    clause: 'OIML R 76-1: A.5.3',
    description: 'Span error and zero return stability across specified operational temperature boundaries.',
    mandatory: false,
    pointsCount: '3 temperatures'
  },
  {
    id: 'voltage-variation',
    title: 'Voltage Variation Test',
    clause: 'OIML R 76-1: A.5.4',
    description: 'Behavior under nominal mains voltage variations (-15% to +10%).',
    mandatory: false,
    pointsCount: '3 voltages'
  }
];

export default function SelectTests({ selectedTests, onToggleTest, onSelectAll, onNext, onPrev }) {
  const isSelected = (id) => selectedTests.includes(id);

  return (
    <div className="form-card">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 flex-wrap gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 m-0">Step 3: Select Applicable OIML R 76 Test Procedures</h3>
          <p className="text-xs text-slate-500 m-0">
            Configure required evaluations according to instrument accuracy class and test regime
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition"
          >
            <CheckSquare size={14} />
            <span>Select All Applicable</span>
          </button>
        </div>
      </div>

      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center gap-2">
        <Info size={16} className="flex-shrink-0 text-amber-600" />
        <span>
          Note: Not every non-automatic weighing instrument requires every test procedure. Select the procedures applicable to this instrument's type evaluation scope.
        </span>
      </div>

      {/* Test Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AVAILABLE_TESTS.map((test) => {
          const checked = isSelected(test.id);

          return (
            <div
              key={test.id}
              onClick={() => onToggleTest(test.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-3 ${
                checked
                  ? 'bg-blue-50/60 border-blue-600 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="mt-0.5 text-blue-600">
                {checked ? <CheckSquare size={20} /> : <Square size={20} className="text-slate-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-900 m-0 truncate">
                    {test.title}
                  </h4>
                  {test.mandatory && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      Mandatory
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-semibold text-blue-700 mb-1 flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span>{test.clause}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-normal">{test.pointsCount}</span>
                </div>

                <p className="text-xs text-slate-600 m-0 leading-relaxed">
                  {test.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
        <button type="button" onClick={onPrev} className="btn-secondary">
          ← Back to Lab Conditions
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={selectedTests.length === 0}
          className="btn-primary"
        >
          <span>Save & Next Step (Test Observations) →</span>
        </button>
      </div>
    </div>
  );
}
