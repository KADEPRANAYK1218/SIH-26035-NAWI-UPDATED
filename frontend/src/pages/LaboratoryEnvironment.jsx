import React from 'react';
import FormField from '../components/FormField.jsx';
import { FlaskConical, Thermometer, Zap, Award, Upload } from 'lucide-react';

export default function LaboratoryEnvironment({ data, onChange, onNext, onPrev }) {
  const handleQuickDefaults = () => {
    onChange({
      ...data,
      laboratoryName: 'Regional Reference Standards Laboratory (RRSL), New Delhi',
      laboratoryId: 'RRSL-DEL-01',
      testEngineerName: 'Sunita Verma',
      testDate: new Date().toISOString().slice(0, 10),
      location: 'Environmental Test Room 4, Ground Floor',
      temperature: '23.4',
      humidity: '52.5',
      pressure: '1012.8',
      voltage: '230.0',
      frequency: '50.0',
      standardWeightsId: 'RRSL-STD-WT-SET-08 (Class F1 / M1 Certified)',
      calCertNumber: 'CC/DEL/2026/04882',
      calValidUntil: '2027-03-31'
    });
  };

  return (
    <div className="form-card">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <FlaskConical size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 m-0">Step 2: Laboratory & Environmental Conditions</h3>
            <p className="text-xs text-slate-500 m-0">
              Traceability standards and environmental influence factors (OIML R 76-1 Clause A.5)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleQuickDefaults}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition"
        >
          <span>Use Laboratory Defaults</span>
        </button>
      </div>

      {/* Lab Station Info */}
      <div className="form-grid-3">
        <FormField
          label="Laboratory Name"
          name="laboratoryName"
          required
          value={data.laboratoryName}
          onChange={(e) => onChange({ ...data, laboratoryName: e.target.value })}
          placeholder="e.g. Regional Reference Standards Laboratory"
        />

        <FormField
          label="Laboratory ID / Code"
          name="laboratoryId"
          value={data.laboratoryId}
          onChange={(e) => onChange({ ...data, laboratoryId: e.target.value })}
          placeholder="e.g. RRSL-DEL-01"
        />

        <FormField
          label="Test Date"
          name="testDate"
          type="date"
          required
          value={data.testDate}
          onChange={(e) => onChange({ ...data, testDate: e.target.value })}
        />

        <FormField
          label="Test Engineer"
          name="testEngineerName"
          value={data.testEngineerName}
          onChange={(e) => onChange({ ...data, testEngineerName: e.target.value })}
          placeholder="Officer / Engineer Name"
        />

        <div className="col-span-2">
          <FormField
            label="Testing Location / Bay"
            name="location"
            value={data.location}
            onChange={(e) => onChange({ ...data, location: e.target.value })}
            placeholder="e.g. Environmental Chamber 2, Ground Floor"
          />
        </div>
      </div>

      {/* Environmental Conditions */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Thermometer size={14} className="text-amber-600" />
          <span>Ambient Environmental Parameters</span>
        </h4>

        <div className="form-grid-3">
          <FormField
            label="Ambient Temperature (°C)"
            name="temperature"
            type="number"
            value={data.temperature}
            onChange={(e) => onChange({ ...data, temperature: e.target.value })}
            placeholder="e.g. 23.4"
            helpText="Standard range: 20°C ± 5°C"
          />

          <FormField
            label="Relative Humidity (% RH)"
            name="humidity"
            type="number"
            value={data.humidity}
            onChange={(e) => onChange({ ...data, humidity: e.target.value })}
            placeholder="e.g. 52.0"
            helpText="Standard range: 30% to 70%"
          />

          <FormField
            label="Atmospheric Pressure (hPa)"
            name="pressure"
            type="number"
            value={data.pressure}
            onChange={(e) => onChange({ ...data, pressure: e.target.value })}
            placeholder="e.g. 1013.2"
            helpText="Barometric test chamber pressure"
          />
        </div>
      </div>

      {/* Electrical Power Supply */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Zap size={14} className="text-blue-600" />
          <span>Mains Electrical Supply</span>
        </h4>

        <div className="form-grid-2">
          <FormField
            label="Supply Voltage (V AC)"
            name="voltage"
            type="number"
            value={data.voltage}
            onChange={(e) => onChange({ ...data, voltage: e.target.value })}
            placeholder="e.g. 230.0"
          />

          <FormField
            label="Mains Frequency (Hz)"
            name="frequency"
            type="number"
            value={data.frequency}
            onChange={(e) => onChange({ ...data, frequency: e.target.value })}
            placeholder="e.g. 50.0"
          />
        </div>
      </div>

      {/* Reference Standards & Calibration */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Award size={14} className="text-emerald-600" />
          <span>Reference Standard Weights & Traceability</span>
        </h4>

        <div className="form-grid-3">
          <FormField
            label="Standard Weights ID / Set"
            name="standardWeightsId"
            value={data.standardWeightsId}
            onChange={(e) => onChange({ ...data, standardWeightsId: e.target.value })}
            placeholder="e.g. RRSL-STD-WT-SET-08"
          />

          <FormField
            label="Calibration Certificate No."
            name="calCertNumber"
            value={data.calCertNumber}
            onChange={(e) => onChange({ ...data, calCertNumber: e.target.value })}
            placeholder="e.g. CC/DEL/2026/04882"
          />

          <FormField
            label="Calibration Valid Until"
            name="calValidUntil"
            type="date"
            value={data.calValidUntil}
            onChange={(e) => onChange({ ...data, calValidUntil: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
        <button type="button" onClick={onPrev} className="btn-secondary">
          ← Back to Instrument
        </button>

        <button type="button" onClick={onNext} className="btn-primary">
          <span>Save & Next Step (Select Tests) →</span>
        </button>
      </div>
    </div>
  );
}
