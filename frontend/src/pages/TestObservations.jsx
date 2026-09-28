import React, { useState } from 'react';
import { testService } from '../services/testService.js';
import { Plus, Trash2, Calculator, Sparkles, AlertCircle, CheckCircle, Info } from 'lucide-react';
import StatusBadge from '../components/StatusBadge.jsx';

export default function TestObservations({
  observations,
  instrument,
  selectedTests,
  onChange,
  onNext,
  onPrev
}) {
  const [calculating, setCalculating] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');

  const unit = instrument?.unit || 'kg';
  const eVal = Number(instrument?.verificationScaleInterval) || 0.005;
  const max = Number(instrument?.maxCapacity) || 30.0;

  // Generate standard observations based on instrument capacity & selected tests
  const handlePopulateStandardObservations = () => {
    const list = [];

    if (selectedTests.includes('zero-setting')) {
      list.push({
        testType: 'Zero-setting',
        testPoint: 'Zero load indication (0.00 kg)',
        referenceValue: 0.0,
        indicatedValue: 0.0,
        calculatedError: 0.0,
        applicableRequirement: `±0.25 e (±${(0.25 * eVal).toFixed(4)} ${unit})`,
        result: 'PASS',
        remarks: 'Digital zero return within tolerance'
      });
    }

    if (selectedTests.includes('weighing-performance')) {
      const p1 = Number(instrument?.minCapacity) || Number((20 * eVal).toFixed(3));
      const p2 = Number((500 * eVal).toFixed(3));
      const p3 = Number((2000 * eVal).toFixed(3));
      const p4 = Number((max * 0.5).toFixed(3));
      const p5 = max;

      list.push(
        {
          testType: 'Weighing performance',
          testPoint: `Min Capacity (${p1} ${unit})`,
          referenceValue: p1,
          indicatedValue: p1,
          calculatedError: 0.0,
          applicableRequirement: `±0.5 e (±${(0.5 * eVal).toFixed(4)} ${unit})`,
          result: 'PASS',
          remarks: 'Initial minimum load'
        },
        {
          testType: 'Weighing performance',
          testPoint: `500 e threshold (${p2} ${unit})`,
          referenceValue: p2,
          indicatedValue: Number((p2 + 0.001).toFixed(4)),
          calculatedError: 0.001,
          applicableRequirement: `±0.5 e (±${(0.5 * eVal).toFixed(4)} ${unit})`,
          result: 'PASS',
          remarks: 'Increasing load step'
        },
        {
          testType: 'Weighing performance',
          testPoint: `2000 e threshold (${p3} ${unit})`,
          referenceValue: p3,
          indicatedValue: Number((p3 + 0.002).toFixed(4)),
          calculatedError: 0.002,
          applicableRequirement: `±1.0 e (±${(1.0 * eVal).toFixed(4)} ${unit})`,
          result: 'PASS',
          remarks: 'Increasing load step'
        },
        {
          testType: 'Weighing performance',
          testPoint: `50% Max Capacity (${p4} ${unit})`,
          referenceValue: p4,
          indicatedValue: Number((p4 + 0.002).toFixed(4)),
          calculatedError: 0.002,
          applicableRequirement: `±1.0 e (±${(1.0 * eVal).toFixed(4)} ${unit})`,
          result: 'PASS',
          remarks: 'Increasing half capacity'
        },
        {
          testType: 'Weighing performance',
          testPoint: `Max Capacity (${p5} ${unit})`,
          referenceValue: p5,
          indicatedValue: Number((p5 + 0.003).toFixed(4)),
          calculatedError: 0.003,
          applicableRequirement: `±1.5 e (±${(1.5 * eVal).toFixed(4)} ${unit})`,
          result: 'PASS',
          remarks: 'Full capacity load'
        }
      );
    }

    if (selectedTests.includes('eccentricity')) {
      const eccLoad = Number((max / 3).toFixed(2));
      list.push(
        {
          testType: 'Eccentricity',
          testPoint: `Position 1 - Centre (${eccLoad} ${unit})`,
          referenceValue: eccLoad,
          indicatedValue: eccLoad,
          calculatedError: 0.0,
          applicableRequirement: `±1.0 e (±${(1.0 * eVal).toFixed(4)} ${unit})`,
          result: 'PASS',
          remarks: 'Centre load'
        },
        {
          testType: 'Eccentricity',
          testPoint: `Position 2 - Front Left (${eccLoad} ${unit})`,
          referenceValue: eccLoad,
          indicatedValue: Number((eccLoad + 0.002).toFixed(4)),
          calculatedError: 0.002,
          applicableRequirement: `±1.0 e (±${(1.0 * eVal).toFixed(4)} ${unit})`,
          result: 'PASS',
          remarks: 'Corner load 1/3 Max'
        },
        {
          testType: 'Eccentricity',
          testPoint: `Position 3 - Back Right (${eccLoad} ${unit})`,
          referenceValue: eccLoad,
          indicatedValue: Number((eccLoad + 0.002).toFixed(4)),
          calculatedError: 0.002,
          applicableRequirement: `±1.0 e (±${(1.0 * eVal).toFixed(4)} ${unit})`,
          result: 'PASS',
          remarks: 'Corner load 1/3 Max'
        }
      );
    }

    if (selectedTests.includes('repeatability')) {
      const repLoad = Number((max * 0.5).toFixed(2));
      list.push(
        {
          testType: 'Repeatability',
          testPoint: `Run 1 (50% Max - ${repLoad} ${unit})`,
          referenceValue: repLoad,
          indicatedValue: Number((repLoad + 0.001).toFixed(4)),
          calculatedError: 0.001,
          applicableRequirement: `Max diff ≤ 1.0 e (${(1.0 * eVal).toFixed(4)} ${unit})`,
          result: 'PASS',
          remarks: 'Repeatability series 1'
        },
        {
          testType: 'Repeatability',
          testPoint: `Run 2 (50% Max - ${repLoad} ${unit})`,
          referenceValue: repLoad,
          indicatedValue: Number((repLoad + 0.002).toFixed(4)),
          calculatedError: 0.002,
          applicableRequirement: `Max diff ≤ 1.0 e (${(1.0 * eVal).toFixed(4)} ${unit})`,
          result: 'PASS',
          remarks: 'Repeatability series 2'
        }
      );
    }

    onChange(list);
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...observations];
    updated[index] = { ...updated[index], [field]: value };

    // Automatic calculation: Error = Indicated - Reference
    if (field === 'referenceValue' || field === 'indicatedValue') {
      const ref = Number(field === 'referenceValue' ? value : updated[index].referenceValue) || 0;
      const ind = Number(field === 'indicatedValue' ? value : updated[index].indicatedValue) || 0;
      const err = Number((ind - ref).toFixed(5));
      updated[index].calculatedError = err;
    }

    onChange(updated);
  };

  const handleAddRow = () => {
    onChange([
      ...observations,
      {
        testType: 'Weighing performance',
        testPoint: `Test Point ${observations.length + 1}`,
        referenceValue: 10.0,
        indicatedValue: 10.0,
        calculatedError: 0.0,
        applicableRequirement: `±1.0 e (±${(1.0 * eVal).toFixed(4)} ${unit})`,
        result: 'PASS',
        remarks: 'Manual test entry'
      }
    ]);
  };

  const handleRemoveRow = (index) => {
    const updated = observations.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  // Run backend calculation engine for official validation
  const handleRunBackendCalculation = async () => {
    if (observations.length === 0) return;
    setCalculating(true);
    setErrorNotice('');
    try {
      const res = await testService.calculate(observations, instrument);
      if (res.success && res.data?.observations) {
        onChange(res.data.observations);
      }
    } catch (err) {
      setErrorNotice('Error triggering calculation engine. Please review input numbers.');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="form-card">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 flex-wrap gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 m-0">Step 4: Enter Test Observations & Compute Errors</h3>
          <p className="text-xs text-slate-500 m-0">
            System automatically calculates Error = Indicated Value - Reference Value against OIML R 76 rules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePopulateStandardObservations}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition"
          >
            <Sparkles size={14} />
            <span>Generate Standard Test Points</span>
          </button>

          <button
            type="button"
            onClick={handleRunBackendCalculation}
            disabled={calculating || observations.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-300 transition"
          >
            <Calculator size={14} />
            <span>{calculating ? 'Calculating...' : 'Re-compute Errors'}</span>
          </button>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="mb-4 p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center gap-2">
        <Info size={16} className="flex-shrink-0 text-amber-600" />
        <span>
          Demo rule configuration – verify against the applicable official standard before regulatory use. Maximum permissible error (mpe) calculated in intervals of <em>e</em> ({eVal} {unit}).
        </span>
      </div>

      {errorNotice && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Observations Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl mb-4">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <th className="p-3 w-10 text-center">#</th>
              <th className="p-3 w-40">Test Procedure</th>
              <th className="p-3">Test Point Description</th>
              <th className="p-3 w-28">Ref Load ({unit})</th>
              <th className="p-3 w-28">Indicated ({unit})</th>
              <th className="p-3 w-28">Calculated Error</th>
              <th className="p-3 w-36">Tolerance Limit</th>
              <th className="p-3 w-20 text-center">Result</th>
              <th className="p-3 w-12 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {observations.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-400">
                  No observation points entered yet. Click <strong>Generate Standard Test Points</strong> above or <strong>+ Add Test Row</strong> below.
                </td>
              </tr>
            ) : (
              observations.map((obs, index) => {
                const isPass = (obs.result || 'PASS').toUpperCase() === 'PASS';
                const errVal = Number(obs.calculatedError);
                const errSign = errVal > 0 ? `+${errVal}` : `${errVal}`;

                return (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="p-2 text-center font-bold text-slate-400">{index + 1}</td>
                    
                    <td className="p-2">
                      <select
                        value={obs.testType}
                        onChange={(e) => handleRowChange(index, 'testType', e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white"
                      >
                        <option value="Zero-setting">Zero-setting</option>
                        <option value="Weighing performance">Weighing performance</option>
                        <option value="Repeatability">Repeatability</option>
                        <option value="Eccentricity">Eccentricity</option>
                        <option value="Tare">Tare</option>
                        <option value="Discrimination">Discrimination</option>
                      </select>
                    </td>

                    <td className="p-2">
                      <input
                        type="text"
                        value={obs.testPoint || ''}
                        onChange={(e) => handleRowChange(index, 'testPoint', e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs"
                        placeholder="e.g. 50% Max load"
                      />
                    </td>

                    <td className="p-2">
                      <input
                        type="number"
                        step="any"
                        value={obs.referenceValue}
                        onChange={(e) => handleRowChange(index, 'referenceValue', e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs font-mono"
                      />
                    </td>

                    <td className="p-2">
                      <input
                        type="number"
                        step="any"
                        value={obs.indicatedValue}
                        onChange={(e) => handleRowChange(index, 'indicatedValue', e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs font-mono"
                      />
                    </td>

                    <td className="p-2 font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded ${errVal === 0 ? 'text-slate-600 bg-slate-100' : isPass ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                        {errSign} {unit}
                      </span>
                    </td>

                    <td className="p-2 text-slate-600 font-mono text-[11px]">
                      {obs.applicableRequirement || `±1.0 e`}
                    </td>

                    <td className="p-2 text-center">
                      <StatusBadge status={obs.result || 'PASS'} />
                    </td>

                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(index)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                        title="Delete Observation"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={handleAddRow}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition"
      >
        <Plus size={14} />
        <span>+ Add Test Observation Row</span>
      </button>

      {/* Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
        <button type="button" onClick={onPrev} className="btn-secondary">
          ← Back to Test Selection
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={observations.length === 0}
          className="btn-primary"
        >
          <span>Evaluate Compliance & Generate Report →</span>
        </button>
      </div>
    </div>
  );
}
