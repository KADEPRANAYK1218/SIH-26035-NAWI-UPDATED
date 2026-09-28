import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { step: 1, title: 'Instrument Details' },
  { step: 2, title: 'Lab & Environment' },
  { step: 3, title: 'Select Tests' },
  { step: 4, title: 'Observations' },
  { step: 5, title: 'Review & Generate' }
];

export default function TestStepper({ currentStep, onSelectStep }) {
  return (
    <div className="stepper-nav">
      {STEPS.map((s, idx) => {
        const isActive = currentStep === s.step;
        const isCompleted = currentStep > s.step;

        return (
          <React.Fragment key={s.step}>
            <div
              onClick={() => onSelectStep && onSelectStep(s.step)}
              className={`step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <div className="step-number">
                {isCompleted ? <Check size={16} /> : s.step}
              </div>
              <span className="step-title">{s.title}</span>
            </div>

            {idx < STEPS.length - 1 && (
              <div className="hidden sm:block flex-1 h-[2px] mx-4 bg-slate-200">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
