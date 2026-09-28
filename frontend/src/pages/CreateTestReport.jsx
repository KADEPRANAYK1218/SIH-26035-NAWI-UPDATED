import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TestStepper from '../components/TestStepper.jsx';
import InstrumentDetails from './InstrumentDetails.jsx';
import LaboratoryEnvironment from './LaboratoryEnvironment.jsx';
import SelectTests from './SelectTests.jsx';
import TestObservations from './TestObservations.jsx';
import ComplianceResult from './ComplianceResult.jsx';
import ReportPreview from './ReportPreview.jsx';
import { reportService } from '../services/reportService.js';
import { testService } from '../services/testService.js';
import { AlertCircle } from 'lucide-react';
import '../styles/forms.css';

export default function CreateTestReport() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');
  const [createdReport, setCreatedReport] = useState(null);

  // Step 1: Instrument State
  const [instrument, setInstrument] = useState({
    manufacturer: '',
    manufacturerAddress: '',
    applicantName: '',
    applicantAddress: '',
    model: '',
    serialNumber: '',
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
  const [instrumentErrors, setInstrumentErrors] = useState({});

  // Step 2: Lab & Environment State
  const [labConditions, setLabConditions] = useState({
    laboratoryName: 'Regional Reference Standards Laboratory (RRSL), New Delhi',
    laboratoryId: 'RRSL-DEL-01',
    testEngineerName: 'Sunita Verma',
    testDate: new Date().toISOString().slice(0, 10),
    location: 'Test Chamber A-3, RRSL New Delhi',
    temperature: '23.4',
    humidity: '52.0',
    pressure: '1012.5',
    voltage: '230.0',
    frequency: '50.0',
    standardWeightsId: 'RRSL-STD-WT-SET-08 (Class F1)',
    calCertNumber: 'CC/DEL/2026/04882',
    calValidUntil: '2027-03-31'
  });

  // Step 3: Selected Tests State
  const [selectedTests, setSelectedTests] = useState([
    'zero-setting',
    'weighing-performance',
    'repeatability',
    'eccentricity'
  ]);

  // Step 4: Observations State
  const [observations, setObservations] = useState([]);

  // Step 5: Compliance Result State
  const [complianceResult, setComplianceResult] = useState(null);

  // Step navigation & validation
  const validateStep1 = () => {
    const errs = {};
    if (!instrument.manufacturer?.trim()) errs.manufacturer = 'Manufacturer name is required.';
    if (!instrument.model?.trim()) errs.model = 'Model number is required.';
    if (!instrument.serialNumber?.trim()) errs.serialNumber = 'Serial number is required.';
    if (!instrument.maxCapacity || isNaN(Number(instrument.maxCapacity))) errs.maxCapacity = 'Valid Max capacity required.';
    if (!instrument.verificationScaleInterval || isNaN(Number(instrument.verificationScaleInterval))) {
      errs.verificationScaleInterval = 'Valid verification interval (e) required.';
    }
    setInstrumentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = async () => {
    setErrorNotice('');

    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (selectedTests.length === 0) {
        setErrorNotice('Please select at least one test procedure.');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (observations.length === 0) {
        setErrorNotice('Please enter or generate at least one test observation.');
        return;
      }

      // Evaluate compliance via backend engine
      try {
        const res = await testService.calculate(observations, instrument);
        if (res.success && res.data) {
          setObservations(res.data.observations);
          setComplianceResult(res.data.compliance);
          setCurrentStep(5);
        }
      } catch (err) {
        setErrorNotice('Calculation failed. Please check observation entries.');
      }
    }
  };

  const handlePrevStep = () => {
    setErrorNotice('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleToggleTest = (id) => {
    setSelectedTests((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSelectAllTests = () => {
    setSelectedTests([
      'zero-setting',
      'weighing-performance',
      'repeatability',
      'eccentricity',
      'tare',
      'discrimination',
      'temperature-influence',
      'voltage-variation'
    ]);
  };

  // Save report to repository
  const handleSaveReport = async (remarks, engineerSigned, reviewerApproved) => {
    setSaving(true);
    setErrorNotice('');

    try {
      const payload = {
        instrument,
        laboratoryConditions: labConditions,
        observations,
        remarks,
        signedByEngineer: engineerSigned,
        signedByReviewer: reviewerApproved
      };

      const res = await reportService.create(payload);
      if (res.success && res.data) {
        setCreatedReport(res.data);
      } else {
        setErrorNotice(res.message || 'Failed to save test report.');
      }
    } catch (err) {
      setErrorNotice(err.message || 'Error occurred while saving report.');
    } finally {
      setSaving(false);
    }
  };

  if (createdReport) {
    return (
      <div>
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs flex items-center justify-between">
          <span className="font-semibold">
            ✓ Report {createdReport.reportNumber} has been successfully recorded in the Metrology Repository!
          </span>
          <button
            onClick={() => navigate('/report-repository')}
            className="text-xs font-bold text-emerald-900 underline hover:text-emerald-700 bg-transparent border-none cursor-pointer"
          >
            Open Repository →
          </button>
        </div>

        <ReportPreview
          report={createdReport}
          onBack={() => navigate('/report-repository')}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">
          Create New Test Report
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1 m-0">
          Standardized OIML R 76 Type Evaluation Observation and Compliance Workflow
        </p>
      </div>

      {errorNotice && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Stepper Navigation */}
      <TestStepper
        currentStep={currentStep}
        onSelectStep={(step) => {
          if (step < currentStep) setCurrentStep(step);
        }}
      />

      {/* Step Components */}
      {currentStep === 1 && (
        <InstrumentDetails
          data={instrument}
          onChange={setInstrument}
          onNext={handleNextStep}
          onCancel={() => navigate('/dashboard')}
          errors={instrumentErrors}
        />
      )}

      {currentStep === 2 && (
        <LaboratoryEnvironment
          data={labConditions}
          onChange={setLabConditions}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {currentStep === 3 && (
        <SelectTests
          selectedTests={selectedTests}
          onToggleTest={handleToggleTest}
          onSelectAll={handleSelectAllTests}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {currentStep === 4 && (
        <TestObservations
          observations={observations}
          instrument={instrument}
          selectedTests={selectedTests}
          onChange={setObservations}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {currentStep === 5 && complianceResult && (
        <ComplianceResult
          compliance={complianceResult}
          instrument={instrument}
          labConditions={labConditions}
          observations={observations}
          onSaveReport={handleSaveReport}
          onPrev={handlePrevStep}
          saving={saving}
          savedReport={createdReport}
        />
      )}
    </div>
  );
}
