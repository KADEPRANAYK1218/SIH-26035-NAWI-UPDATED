import React, { useState } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
import {
  CheckCircle2,
  XCircle,
  FileDown,
  FileText,
  FileCheck,
  ShieldCheck,
  Building,
  UserCheck,
  Save,
  AlertTriangle
} from 'lucide-react';

export default function ComplianceResult({
  compliance,
  instrument,
  labConditions,
  observations,
  onSaveReport,
  onPrev,
  saving,
  savedReport
}) {
  const [engineerSigned, setEngineerSigned] = useState(false);
  const [reviewerApproved, setReviewerApproved] = useState(false);
  const [remarks, setRemarks] = useState(
    compliance.overallResult === 'PASS'
      ? 'Instrument complies with applicable OIML R 76 tolerances on initial verification.'
      : 'Instrument failed to meet maximum permissible error tolerances for one or more test points.'
  );

  const isPass = compliance.overallResult === 'PASS';

  const handleSignEngineer = () => {
    setEngineerSigned(true);
  };

  const handleApproveReviewer = () => {
    setReviewerApproved(true);
  };

  return (
    <div className="space-y-6">
      {/* OVERALL DETERMINATION HERO CARD */}
      <div className={`p-6 rounded-2xl border-2 flex items-center justify-between flex-wrap gap-4 ${
        isPass
          ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
          : 'bg-rose-50/70 border-rose-500 shadow-sm'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            isPass ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}>
            {isPass ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              OIML R 76 / Legal Metrology Verification Result
            </div>
            <div className={`text-3xl font-extrabold ${isPass ? 'text-emerald-800' : 'text-rose-800'}`}>
              OVERALL RESULT: {compliance.overallResult}
            </div>
            <p className="text-xs text-slate-600 mt-1 m-0">
              {isPass
                ? 'All evaluated test observations fall within the configured Maximum Permissible Error (mpe) limits.'
                : 'One or more observations exceeded permissible tolerances. Attention required before statutory endorsement.'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 font-semibold uppercase block">Evaluated Points</span>
          <span className="text-lg font-bold text-slate-800">
            {compliance.passedObservations || 0} / {compliance.totalObservations || 0} Passed
          </span>
        </div>
      </div>

      {/* COMPLIANCE BREAKDOWN SUMMARY TABLE */}
      <div className="form-card">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <ShieldCheck size={16} className="text-blue-600" />
          <span>Test Procedure Compliance Summary</span>
        </h3>

        <div className="overflow-x-auto border border-slate-200 rounded-xl mb-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="p-3">Test Procedure</th>
                <th className="p-3 w-28 text-center">Result</th>
                <th className="p-3">Evaluation Remarks</th>
              </tr>
            </thead>
            <tbody>
              {compliance.summary && compliance.summary.length > 0 ? (
                compliance.summary.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800">{item.testType}</td>
                    <td className="p-3 text-center">
                      <StatusBadge status={item.result} />
                    </td>
                    <td className="p-3 text-slate-600">{item.remarks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-slate-400">
                    No summary available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Failure Breakdown if any */}
        {!isPass && compliance.reasons && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl">
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle size={14} />
              <span>Failure Analysis</span>
            </h4>
            <ul className="text-xs text-rose-700 m-0 pl-4 space-y-1">
              {compliance.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Verification Remarks */}
        <div className="mb-6">
          <label className="form-label">
            Official Evaluation Remarks / Recommendations
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={2}
            className="form-textarea text-xs"
            placeholder="Enter additional laboratory observations..."
          />
        </div>

        {/* Prototype Digital Signatures */}
        <div className="pt-4 border-t border-slate-200">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Digital Verification & Sign-off Section (Prototype)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Engineer Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">Test Engineer</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${engineerSigned ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  {engineerSigned ? 'SIGNED' : 'PENDING'}
                </span>
              </div>
              <p className="text-xs text-slate-500 m-0 mb-3">
                {labConditions?.testEngineerName || 'Sunita Verma'} (RRSL Verification Division)
              </p>
              <button
                type="button"
                onClick={handleSignEngineer}
                disabled={engineerSigned}
                className={`w-full py-1.5 px-3 rounded text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  engineerSigned
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <UserCheck size={14} />
                <span>{engineerSigned ? 'Digitally Verified' : 'Sign as Test Engineer'}</span>
              </button>
            </div>

            {/* Reviewer Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">Reviewing Officer</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${reviewerApproved ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'}`}>
                  {reviewerApproved ? 'APPROVED' : 'PENDING'}
                </span>
              </div>
              <p className="text-xs text-slate-500 m-0 mb-3">
                Anand Kulkarni (Directorate of Legal Metrology)
              </p>
              <button
                type="button"
                onClick={handleApproveReviewer}
                disabled={reviewerApproved}
                className={`w-full py-1.5 px-3 rounded text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  reviewerApproved
                    ? 'bg-blue-50 text-blue-700 border border-blue-300 cursor-default'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileCheck size={14} />
                <span>{reviewerApproved ? 'Report Approved' : 'Approve as Reviewer'}</span>
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 m-0 text-center italic">
            Note: Prototype signature controls for demonstration purposes; does not create a statutory certificate.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 flex-wrap gap-4">
          <button type="button" onClick={onPrev} className="btn-secondary">
            ← Back to Observations
          </button>

          <button
            type="button"
            onClick={() => onSaveReport(remarks, engineerSigned, reviewerApproved)}
            disabled={saving}
            className="btn-primary"
          >
            <Save size={16} />
            <span>{saving ? 'Saving to Repository...' : 'Save Report to Repository'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
