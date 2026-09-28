import React from 'react';
import FormField from '../components/FormField.jsx';
import { Scale, Sparkles } from 'lucide-react';

const INSTRUMENT_TYPES = [
  { value: 'Electronic Scale', label: 'Electronic Scale' },
  { value: 'Platform Scale', label: 'Platform Scale' },
  { value: 'Bench Scale', label: 'Bench Scale' },
  { value: 'Truck Scale', label: 'Truck Scale' },
  { value: 'Weighbridge', label: 'Weighbridge' },
  { value: 'Other', label: 'Other Non-Automatic Weighing Instrument' }
];

const ACCURACY_CLASSES = [
  { value: 'I', label: 'Class I (Special Accuracy)' },
  { value: 'II', label: 'Class II (High Accuracy)' },
  { value: 'III', label: 'Class III (Medium Accuracy - Commercial/Trade)' },
  { value: 'IIII', label: 'Class IIII (Ordinary Accuracy)' }
];

export default function InstrumentDetails({ data, onChange, onNext, onCancel, errors = {} }) {
  // Compute n = Max / e
  const max = Number(data.maxCapacity) || 0;
  const eVal = Number(data.verificationScaleInterval) || 0;
  const n = eVal > 0 ? Math.round(max / eVal) : 0;

  const handleQuickDemo = () => {
    onChange({
      ...data,
      manufacturer: 'Apex Weighing Systems Ltd',
      manufacturerAddress: 'Plot 42, Industrial Area Phase II, Gurugram, Haryana - 122001',
      applicantName: 'Apex Weighing Systems Ltd',
      applicantAddress: 'Plot 42, Industrial Area Phase II, Gurugram, Haryana - 122001',
      model: 'ABC-500',
      serialNumber: `SN-${Math.floor(10000 + Math.random() * 90000)}`,
      instrumentType: 'Electronic Scale',
      accuracyClass: 'III',
      maxCapacity: '30.0',
      minCapacity: '0.1',
      verificationScaleInterval: '0.005',
      actualScaleInterval: '0.005',
      unit: 'kg',
      displayType: 'Electronic Digital (7-Segment LED)',
      weighingRange: 'Single-interval'
    });
  };

  return (
    <div className="form-card">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Scale size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 m-0">Step 1: Instrument & Manufacturer Details</h3>
            <p className="text-xs text-slate-500 m-0">
              Technical specifications according to OIML R 76-1 / Legal Metrology (General) Rules 2011
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleQuickDemo}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition"
        >
          <Sparkles size={14} />
          <span>Fill Demo Specifications</span>
        </button>
      </div>

      <div className="form-grid-2">
        <FormField
          label="Manufacturer Name"
          name="manufacturer"
          required
          value={data.manufacturer}
          onChange={(e) => onChange({ ...data, manufacturer: e.target.value })}
          placeholder="e.g. Bharat Precision Metrology Pvt Ltd"
          error={errors.manufacturer}
        />

        <FormField
          label="Manufacturer Address"
          name="manufacturerAddress"
          value={data.manufacturerAddress}
          onChange={(e) => onChange({ ...data, manufacturerAddress: e.target.value })}
          placeholder="Factory / Registered address"
        />

        <FormField
          label="Applicant Name"
          name="applicantName"
          value={data.applicantName}
          onChange={(e) => onChange({ ...data, applicantName: e.target.value })}
          placeholder="Name of submitting entity"
        />

        <FormField
          label="Applicant Address"
          name="applicantAddress"
          value={data.applicantAddress}
          onChange={(e) => onChange({ ...data, applicantAddress: e.target.value })}
          placeholder="Applicant communication address"
        />

        <FormField
          label="Model Number"
          name="model"
          required
          value={data.model}
          onChange={(e) => onChange({ ...data, model: e.target.value })}
          placeholder="e.g. PF-1000 / ABC-500"
          error={errors.model}
        />

        <FormField
          label="Serial Number"
          name="serialNumber"
          required
          value={data.serialNumber}
          onChange={(e) => onChange({ ...data, serialNumber: e.target.value })}
          placeholder="e.g. SN-88291"
          error={errors.serialNumber}
        />

        <FormField
          label="Instrument Type"
          name="instrumentType"
          type="select"
          required
          value={data.instrumentType}
          onChange={(e) => onChange({ ...data, instrumentType: e.target.value })}
          options={INSTRUMENT_TYPES}
          error={errors.instrumentType}
        />

        <FormField
          label="Accuracy Class"
          name="accuracyClass"
          type="select"
          required
          value={data.accuracyClass}
          onChange={(e) => onChange({ ...data, accuracyClass: e.target.value })}
          options={ACCURACY_CLASSES}
          helpText="Class III applies to standard industrial and commercial weighing scales."
        />
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
          Metrological Capacities & Scale Intervals
        </h4>

        <div className="form-grid-3">
          <FormField
            label="Maximum Capacity (Max)"
            name="maxCapacity"
            type="number"
            required
            value={data.maxCapacity}
            onChange={(e) => onChange({ ...data, maxCapacity: e.target.value })}
            placeholder="e.g. 30"
            error={errors.maxCapacity}
            helpText="In engineering unit (e.g. kg)"
          />

          <FormField
            label="Minimum Capacity (Min)"
            name="minCapacity"
            type="number"
            value={data.minCapacity}
            onChange={(e) => onChange({ ...data, minCapacity: e.target.value })}
            placeholder="e.g. 0.1"
            helpText="Typically 20 e for Class III"
          />

          <FormField
            label="Engineering Unit"
            name="unit"
            value={data.unit || 'kg'}
            onChange={(e) => onChange({ ...data, unit: e.target.value })}
            placeholder="kg / g / t"
          />

          <FormField
            label="Verification Scale Interval (e)"
            name="verificationScaleInterval"
            type="number"
            required
            value={data.verificationScaleInterval}
            onChange={(e) => onChange({ ...data, verificationScaleInterval: e.target.value })}
            placeholder="e.g. 0.005"
            error={errors.verificationScaleInterval}
            helpText="Interval used for MPE verification"
          />

          <FormField
            label="Actual Scale Interval (d)"
            name="actualScaleInterval"
            type="number"
            value={data.actualScaleInterval}
            onChange={(e) => onChange({ ...data, actualScaleInterval: e.target.value })}
            placeholder="e.g. 0.005"
            helpText="Smallest scale graduation"
          />

          <div>
            <label className="form-label">Calculated Scale Intervals (n = Max / e)</label>
            <div className="px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold text-sm">
              {n > 0 ? `${n.toLocaleString()} intervals` : 'Enter Max & e'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Automatic verification parameter</p>
          </div>
        </div>

        <div className="form-grid-2 mt-4">
          <FormField
            label="Display Type"
            name="displayType"
            value={data.displayType || 'Electronic Digital (LED/LCD)'}
            onChange={(e) => onChange({ ...data, displayType: e.target.value })}
            placeholder="e.g. Backlit LCD / 7-Segment LED"
          />

          <FormField
            label="Weighing Range Type"
            name="weighingRange"
            value={data.weighingRange || 'Single-interval'}
            onChange={(e) => onChange({ ...data, weighingRange: e.target.value })}
            placeholder="Single-interval / Multi-interval"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>

        <button type="button" onClick={onNext} className="btn-primary">
          <span>Save & Next Step (Lab & Environment) →</span>
        </button>
      </div>
    </div>
  );
}
