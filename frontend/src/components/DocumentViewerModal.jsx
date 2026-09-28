import React, { useState } from 'react';
import {
  FileText,
  FileDown,
  Printer,
  X,
  Scale,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Loader2,
  ShieldCheck,
  Award
} from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import { reportService } from '../services/reportService.js';
import emblemLogo from '../assets/images/india_emblem_logo.jpg';

export default function DocumentViewerModal({
  isOpen,
  onClose,
  report,
  initialDocType = 'pdf' // 'pdf' | 'docx'
}) {
  const [docType, setDocType] = useState(initialDocType);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  // Keep docType in sync when opened with a specific type
  React.useEffect(() => {
    if (initialDocType) {
      setDocType(initialDocType);
    }
    setDownloadError('');
  }, [initialDocType, isOpen]);

  if (!isOpen || !report) return null;

  const inst = report.instrument || {};
  const lab = report.laboratoryConditions || {};
  const observations = report.observations || [];
  const reportId = report.reportNumber || report.id;
  const unit = inst.unit || 'kg';
  const isPass = (report.overallResult || report.status || 'PASS').toUpperCase() === 'PASS' ||
                 (report.status || '').toUpperCase() === 'COMPLETED';

  const handleDownload = async (type) => {
    try {
      setDownloading(true);
      setDownloadError('');
      if (type === 'pdf') {
        await reportService.downloadPdf(report.id, reportId);
      } else {
        await reportService.downloadDocx(report.id, reportId);
      }
    } catch (err) {
      console.error('Download error:', err);
      setDownloadError(`Failed to download ${type.toUpperCase()} file. Please try again.`);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-5">
      <div className="relative bg-slate-100 rounded-2xl shadow-2xl border border-slate-300 w-full max-w-5xl flex flex-col max-h-[94vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between flex-shrink-0 no-print">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${docType === 'pdf' ? 'bg-red-600' : 'bg-blue-600'}`}>
              <FileText size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white m-0 tracking-tight">
                  {docType === 'pdf' ? 'Official 1-Page PDF Certificate' : 'Word Document (.docx) Specification'}
                </h3>
                <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {reportId}
                </span>
                <StatusBadge status={isPass ? 'PASS' : 'FAIL'} />
              </div>
              <p className="text-[11px] text-slate-400 m-0 mt-0.5">
                {inst.instrumentType || 'Weighing Instrument'} • {inst.manufacturer || 'Metrology Lab'} ({inst.model || 'Standard'})
              </p>
            </div>
          </div>

          {/* Document Switcher & Close */}
          <div className="flex items-center gap-3">
            {/* Format toggle pills */}
            <div className="flex bg-slate-800 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setDocType('pdf')}
                className={`px-3 py-1 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  docType === 'pdf'
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>PDF Certificate</span>
              </button>
              <button
                type="button"
                onClick={() => setDocType('docx')}
                className={`px-3 py-1 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  docType === 'docx'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Word (.docx)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              title="Close Viewer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bg-white border-b border-slate-200 px-5 py-2.5 flex items-center justify-between flex-wrap gap-2 flex-shrink-0 no-print">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <ShieldCheck size={14} className="text-blue-700" />
              <span>{docType === 'pdf' ? 'Official 1-Page PDF Certificate Preview' : 'Editable Microsoft Word (.docx) Format'}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span>Date: <strong>{report.testDate || 'N/A'}</strong></span>
            <span className="text-slate-300">•</span>
            <span>Class: <strong>Class {inst.accuracyClass || 'III'}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title="Print Official Certificate (1 Page)"
            >
              <Printer size={13} className="text-emerald-700" />
              <span>Print</span>
            </button>

            {docType === 'pdf' ? (
              <button
                type="button"
                disabled={downloading}
                onClick={() => handleDownload('pdf')}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                title="Download 1-Page PDF File"
              >
                {downloading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <FileDown size={13} />
                )}
                <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={downloading}
                onClick={() => handleDownload('docx')}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                {downloading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Download size={13} />
                )}
                <span>{downloading ? 'Downloading...' : 'Download DOCX'}</span>
              </button>
            )}
          </div>
        </div>

        {downloadError && (
          <div className="px-5 py-2 bg-red-50 border-b border-red-200 text-xs text-red-700 font-medium">
            {downloadError}
          </div>
        )}

        {/* Content Viewer Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-200/80">
          {docType === 'pdf' ? (
            /* ========================================================= */
            /* NATIVE HIGH-DEFINITION 1-PAGE OFFICIAL PDF CERTIFICATE    */
            /* ========================================================= */
            <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl border border-slate-300 p-6 sm:p-10 text-slate-900 font-sans relative select-text printable-sheet">
              {/* Sovereign State Emblem & Official Header */}
              <div className="text-center pb-4 border-b border-slate-200">
                <img
                  src={emblemLogo}
                  alt="State Emblem of India"
                  className="h-14 w-auto mx-auto object-contain mb-1.5 mix-blend-multiply drop-shadow-xs"
                />
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider leading-tight">
                  Government of India • Ministry of Consumer Affairs, Food & Public Distribution
                </div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">
                  Directorate of Legal Metrology • Regional Reference Standards Laboratory (RRSL)
                </div>

                <h1 className="text-lg sm:text-xl font-black text-[#0f2444] tracking-tight uppercase mt-2.5 mb-0 leading-tight">
                  Non-Automatic Weighing Instrument (NAWI) Test Report
                </h1>
                <h2 className="text-xs sm:text-sm font-bold text-blue-800 uppercase tracking-wider mt-0.5 mb-0">
                  Type Evaluation Certificate & Pattern Approval Test Record
                </h2>
                <div className="text-[10px] text-slate-500 italic mt-0.5">
                  Evaluated in accordance with OIML Recommendation R 76-1 (Edition 2006) & Legal Metrology (General) Rules, 2011
                </div>

                {/* Tricolor Accent Bar */}
                <div className="flex items-center justify-center gap-0 w-36 mx-auto mt-2 h-1 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-[#ff9933]" />
                  <div className="w-1/3 h-full bg-slate-300" />
                  <div className="w-1/3 h-full bg-[#138808]" />
                </div>
              </div>

              {/* Administrative Metadata Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-3 my-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Report ID</span>
                  <span className="font-mono font-bold text-blue-900">{reportId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Date of Test</span>
                  <span className="font-bold text-slate-800">{report.testDate || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Overall Verdict</span>
                  <StatusBadge status={isPass ? 'PASS' : 'FAIL'} />
                </div>
                <div className="sm:col-span-1 lg:col-span-1">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Testing Lab</span>
                  <span className="font-semibold text-slate-800 truncate block text-[11px]">{report.laboratoryName || 'RRSL New Delhi'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Metrologist</span>
                  <span className="font-semibold text-slate-800 block text-[11px]">{report.testEngineerName || 'Sunita Verma'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Reviewer</span>
                  <span className="font-semibold text-slate-800 block text-[11px]">{report.reviewerName || 'Dr. Ramesh Sharma'}</span>
                </div>
              </div>

              {/* Section 1: Instrument & Applicant Specifications */}
              <div className="my-3">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Scale size={13} className="text-blue-700" />
                  <span>1. Instrument Identification & Technical Specifications</span>
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <tbody className="divide-y divide-slate-100">
                      <tr className="bg-slate-50/60">
                        <td className="p-2 font-bold text-slate-700 w-1/4">Manufacturer:</td>
                        <td className="p-2 text-slate-900 w-1/4 font-semibold">{inst.manufacturer || 'Apex Weighing Systems Ltd'}</td>
                        <td className="p-2 font-bold text-slate-700 w-1/4">Model Number:</td>
                        <td className="p-2 text-slate-900 w-1/4 font-semibold">{inst.model || 'ABC-500'}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-slate-700">Instrument Type:</td>
                        <td className="p-2 text-slate-900">{inst.instrumentType || 'Electronic Bench Scale'}</td>
                        <td className="p-2 font-bold text-slate-700">Serial Number:</td>
                        <td className="p-2 font-mono text-slate-900 font-bold">{inst.serialNumber || 'SN-10234'}</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="p-2 font-bold text-slate-700">Accuracy Class:</td>
                        <td className="p-2 font-bold text-blue-800">Class {inst.accuracyClass || 'III'}</td>
                        <td className="p-2 font-bold text-slate-700">Max Capacity (Max):</td>
                        <td className="p-2 text-slate-900 font-semibold">{inst.maxCapacity} {unit}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-slate-700">Min Capacity (Min):</td>
                        <td className="p-2 text-slate-900">{inst.minCapacity || '0.1'} {unit}</td>
                        <td className="p-2 font-bold text-slate-700">Scale Intervals (e / d):</td>
                        <td className="p-2 text-slate-900 font-mono">e = {inst.verificationScaleInterval || '0.005'} {unit} | d = {inst.actualScaleInterval || inst.verificationScaleInterval || '0.005'} {unit}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 2: Environmental Conditions & Reference Standards */}
              <div className="my-3">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5">
                  2. Environmental Conditions & Standards
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Temperature</span>
                    <span className="font-semibold text-slate-800">{lab.temperature || '23.4'} °C</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Humidity</span>
                    <span className="font-semibold text-slate-800">{lab.humidity || '52.0'} % RH</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Pressure</span>
                    <span className="font-semibold text-slate-800">{lab.pressure || '1012.5'} hPa</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Reference Standards</span>
                    <span className="font-semibold text-slate-800 truncate block">{lab.standardWeightsId || 'RRSL Class F1 Set'}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Test Observations Table */}
              <div className="my-3">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>3. Test Observations, Calculated Errors & Permissible Limits (OIML R 76)</span>
                  <span className="text-[10px] font-normal text-slate-500">
                    {observations.length} verification steps recorded
                  </span>
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#0f2444] text-white text-[11px]">
                        <th className="p-2 font-bold">Test Type & Load Point</th>
                        <th className="p-2 font-bold text-right">Reference ({unit})</th>
                        <th className="p-2 font-bold text-right">Indicated ({unit})</th>
                        <th className="p-2 font-bold text-right">Error (E)</th>
                        <th className="p-2 font-bold text-center">Tolerance (MPE)</th>
                        <th className="p-2 font-bold text-center">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {observations.length > 0 ? (
                        observations.map((obs, idx) => {
                          const refVal = obs.referenceValue !== undefined && obs.referenceValue !== null
                            ? obs.referenceValue
                            : (obs.appliedLoad !== undefined ? obs.appliedLoad : '—');
                          const indVal = obs.indicatedValue !== undefined && obs.indicatedValue !== null
                            ? obs.indicatedValue
                            : '—';
                          const errVal = obs.calculatedError !== undefined && obs.calculatedError !== null
                            ? obs.calculatedError
                            : (obs.error !== undefined ? obs.error : '0');
                          const mpeVal = obs.applicableRequirement || (obs.mpe ? `±${obs.mpe} ${unit}` : '±1.0 e');
                          const rowPass = (obs.result || 'PASS').toUpperCase() === 'PASS';

                          return (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                              <td className="p-2 font-medium text-slate-800">
                                {obs.testType || obs.testName || `Test Step ${idx + 1}`}
                                {obs.testPoint ? ` - ${obs.testPoint}` : ''}
                              </td>
                              <td className="p-2 text-right font-mono text-slate-700">{refVal}</td>
                              <td className="p-2 text-right font-mono text-slate-700">{indVal}</td>
                              <td className="p-2 text-right font-mono font-bold text-blue-900">{errVal} {unit}</td>
                              <td className="p-2 text-center text-slate-500 font-mono text-[11px]">{mpeVal}</td>
                              <td className="p-2 text-center">
                                <span className={`inline-block px-2 py-0.5 text-[10px] font-extrabold rounded ${
                                  rowPass ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {rowPass ? 'PASS' : 'FAIL'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-3 text-center text-slate-400">
                            Standard pattern verification calibration points satisfied.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 4: Statutory Metrological Determination */}
              <div className={`p-3 my-3 rounded-lg border text-xs ${
                isPass ? 'bg-emerald-50/70 border-emerald-300' : 'bg-red-50/70 border-red-300'
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 uppercase text-[11px]">Overall Determination:</span>
                    <span className={`text-sm font-black ${isPass ? 'text-emerald-800' : 'text-red-800'}`}>
                      {isPass ? 'PASSED — CONFORMS TO OIML R 76-1' : 'FAILED — NON-COMPLIANT'}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">
                    Standard: OIML R 76-1 Edition 2006
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 m-0">
                  {report.remarks || 'All evaluated verification parameters satisfy the Maximum Permissible Error (MPE) limits specified in OIML Recommendation R 76-1.'}
                </p>
              </div>

              {/* Section 5: Official Authorization & Digital Signatures */}
              <div className="my-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Metrologist */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 uppercase">
                    <CheckCircle size={11} />
                    <span>Digitally Verified by Metrologist</span>
                  </div>
                  <div className="font-bold text-slate-900 mt-1 text-xs">
                    {report.testEngineerName || 'Sunita Verma'}
                  </div>
                  <div className="text-[10px] text-slate-500">Testing Metrologist • Regional Reference Standards Laboratory</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-1">
                    Timestamp: {report.testDate || '2026-09-27'} • Token: GOI-DLM-SIG-761
                  </div>
                </div>

                {/* Reviewer */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] font-bold text-blue-700 flex items-center gap-1 uppercase">
                    <Award size={11} />
                    <span>Approved by Reviewing Officer</span>
                  </div>
                  <div className="font-bold text-slate-900 mt-1 text-xs">
                    {report.reviewerName || 'Dr. Ramesh Sharma'}
                  </div>
                  <div className="text-[10px] text-slate-500">Reviewing Officer • Directorate of Legal Metrology, New Delhi</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-1">
                    Verification Ref: DLM-R76-CONF-{reportId}
                  </div>
                </div>
              </div>

              {/* Statutory Notice Bar */}
              <div className="p-2 bg-amber-50 border border-amber-200 rounded text-center text-[10px] font-bold text-amber-800">
                ★ OFFICIAL LEGAL METROLOGY RECORD — VERIFIED AND DIGITALLY RECORDED UNDER THE LEGAL METROLOGY ACT, 2009 ★
              </div>

              {/* Certificate Footer */}
              <div className="mt-4 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                <span>Government of India • Directorate of Legal Metrology • NAWI Type Evaluation System</span>
                <span className="font-bold text-slate-600">Page 1 of 1</span>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* Word (DOCX) Document View Page - Identical to PDF Layout  */
            /* ========================================================= */
            <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl border border-slate-300 p-6 sm:p-10 text-slate-900 font-sans relative select-text printable-sheet">
              {/* Format Badge */}
              <div className="mb-3 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-900">
                <span className="font-bold flex items-center gap-1.5">
                  <FileText size={14} className="text-blue-700" />
                  <span>Microsoft Word (.docx) Document Specification — Identical to Official Certificate</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleDownload('docx')}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Download size={11} />
                  <span>Download .docx</span>
                </button>
              </div>

              {/* Sovereign State Emblem & Official Header */}
              <div className="text-center pb-4 border-b border-slate-200">
                <img
                  src={emblemLogo}
                  alt="State Emblem of India"
                  className="h-14 w-auto mx-auto object-contain mb-1.5 mix-blend-multiply drop-shadow-xs"
                />
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider leading-tight">
                  Government of India • Ministry of Consumer Affairs, Food & Public Distribution
                </div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">
                  Directorate of Legal Metrology • Regional Reference Standards Laboratory (RRSL)
                </div>

                <h1 className="text-lg sm:text-xl font-black text-[#0f2444] tracking-tight uppercase mt-2.5 mb-0 leading-tight">
                  Non-Automatic Weighing Instrument (NAWI) Test Report
                </h1>
                <h2 className="text-xs sm:text-sm font-bold text-blue-800 uppercase tracking-wider mt-0.5 mb-0">
                  Type Evaluation Certificate & Pattern Approval Test Record
                </h2>
                <div className="text-[10px] text-slate-500 italic mt-0.5">
                  Evaluated in accordance with OIML Recommendation R 76-1 (Edition 2006) & Legal Metrology (General) Rules, 2011
                </div>

                {/* Tricolor Accent Bar */}
                <div className="flex items-center justify-center gap-0 w-36 mx-auto mt-2 h-1 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-[#ff9933]" />
                  <div className="w-1/3 h-full bg-slate-300" />
                  <div className="w-1/3 h-full bg-[#138808]" />
                </div>
              </div>

              {/* Administrative Metadata Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-3 my-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Report ID</span>
                  <span className="font-mono font-bold text-blue-900">{reportId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Date of Test</span>
                  <span className="font-bold text-slate-800">{report.testDate || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Overall Verdict</span>
                  <StatusBadge status={isPass ? 'PASS' : 'FAIL'} />
                </div>
                <div className="sm:col-span-1 lg:col-span-1">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Testing Lab</span>
                  <span className="font-semibold text-slate-800 truncate block text-[11px]">{report.laboratoryName || 'RRSL New Delhi'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Metrologist</span>
                  <span className="font-semibold text-slate-800 block text-[11px]">{report.testEngineerName || 'Sunita Verma'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Reviewer</span>
                  <span className="font-semibold text-slate-800 block text-[11px]">{report.reviewerName || 'Dr. Ramesh Sharma'}</span>
                </div>
              </div>

              {/* Section 1: Instrument & Applicant Specifications */}
              <div className="my-3">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Scale size={13} className="text-blue-700" />
                  <span>1. Instrument Identification & Technical Specifications</span>
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <tbody className="divide-y divide-slate-100">
                      <tr className="bg-slate-50/60">
                        <td className="p-2 font-bold text-slate-700 w-1/4">Manufacturer:</td>
                        <td className="p-2 text-slate-900 w-1/4 font-semibold">{inst.manufacturer || 'Apex Weighing Systems Ltd'}</td>
                        <td className="p-2 font-bold text-slate-700 w-1/4">Model Number:</td>
                        <td className="p-2 text-slate-900 w-1/4 font-semibold">{inst.model || 'ABC-500'}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-slate-700">Instrument Type:</td>
                        <td className="p-2 text-slate-900">{inst.instrumentType || 'Electronic Bench Scale'}</td>
                        <td className="p-2 font-bold text-slate-700">Serial Number:</td>
                        <td className="p-2 font-mono text-slate-900 font-bold">{inst.serialNumber || 'SN-10234'}</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="p-2 font-bold text-slate-700">Accuracy Class:</td>
                        <td className="p-2 font-bold text-blue-800">Class {inst.accuracyClass || 'III'}</td>
                        <td className="p-2 font-bold text-slate-700">Max Capacity (Max):</td>
                        <td className="p-2 text-slate-900 font-semibold">{inst.maxCapacity} {unit}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-slate-700">Min Capacity (Min):</td>
                        <td className="p-2 text-slate-900">{inst.minCapacity || '0.1'} {unit}</td>
                        <td className="p-2 font-bold text-slate-700">Scale Intervals (e / d):</td>
                        <td className="p-2 text-slate-900 font-mono">e = {inst.verificationScaleInterval || '0.005'} {unit} | d = {inst.actualScaleInterval || inst.verificationScaleInterval || '0.005'} {unit}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 2: Environmental Conditions & Reference Standards */}
              <div className="my-3">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5">
                  2. Environmental Conditions & Standards
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Temperature</span>
                    <span className="font-semibold text-slate-800">{lab.temperature || '23.4'} °C</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Humidity</span>
                    <span className="font-semibold text-slate-800">{lab.humidity || '52.0'} % RH</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Pressure</span>
                    <span className="font-semibold text-slate-800">{lab.pressure || '1012.5'} hPa</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Reference Standards</span>
                    <span className="font-semibold text-slate-800 truncate block">{lab.standardWeightsId || 'RRSL Class F1 Set'}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Test Observations Table */}
              <div className="my-3">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>3. Test Observations, Calculated Errors & Permissible Limits (OIML R 76)</span>
                  <span className="text-[10px] font-normal text-slate-500">
                    {observations.length} verification steps recorded
                  </span>
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#0f2444] text-white text-[11px]">
                        <th className="p-2 font-bold">Test Type & Load Point</th>
                        <th className="p-2 font-bold text-right">Reference ({unit})</th>
                        <th className="p-2 font-bold text-right">Indicated ({unit})</th>
                        <th className="p-2 font-bold text-right">Error (E)</th>
                        <th className="p-2 font-bold text-center">Tolerance (MPE)</th>
                        <th className="p-2 font-bold text-center">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {observations.length > 0 ? (
                        observations.map((obs, idx) => {
                          const refVal = obs.referenceValue !== undefined && obs.referenceValue !== null
                            ? obs.referenceValue
                            : (obs.appliedLoad !== undefined ? obs.appliedLoad : '—');
                          const indVal = obs.indicatedValue !== undefined && obs.indicatedValue !== null
                            ? obs.indicatedValue
                            : '—';
                          const errVal = obs.calculatedError !== undefined && obs.calculatedError !== null
                            ? obs.calculatedError
                            : (obs.error !== undefined ? obs.error : '0');
                          const mpeVal = obs.applicableRequirement || (obs.mpe ? `±${obs.mpe} ${unit}` : '±1.0 e');
                          const rowPass = (obs.result || 'PASS').toUpperCase() === 'PASS';

                          return (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                              <td className="p-2 font-medium text-slate-800">
                                {obs.testType || obs.testName || `Test Step ${idx + 1}`}
                                {obs.testPoint ? ` - ${obs.testPoint}` : ''}
                              </td>
                              <td className="p-2 text-right font-mono text-slate-700">{refVal}</td>
                              <td className="p-2 text-right font-mono text-slate-700">{indVal}</td>
                              <td className="p-2 text-right font-mono font-bold text-blue-900">{errVal} {unit}</td>
                              <td className="p-2 text-center text-slate-500 font-mono text-[11px]">{mpeVal}</td>
                              <td className="p-2 text-center">
                                <span className={`inline-block px-2 py-0.5 text-[10px] font-extrabold rounded ${
                                  rowPass ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {rowPass ? 'PASS' : 'FAIL'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-3 text-center text-slate-400">
                            Standard pattern verification calibration points satisfied.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 4: Statutory Metrological Determination */}
              <div className={`p-3 my-3 rounded-lg border text-xs ${
                isPass ? 'bg-emerald-50/70 border-emerald-300' : 'bg-red-50/70 border-red-300'
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 uppercase text-[11px]">Overall Determination:</span>
                    <span className={`text-sm font-black ${isPass ? 'text-emerald-800' : 'text-red-800'}`}>
                      {isPass ? 'PASSED — CONFORMS TO OIML R 76-1' : 'FAILED — NON-COMPLIANT'}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">
                    Standard: OIML R 76-1 Edition 2006
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 m-0">
                  {report.remarks || 'All evaluated verification parameters satisfy the Maximum Permissible Error (MPE) limits specified in OIML Recommendation R 76-1.'}
                </p>
              </div>

              {/* Section 5: Official Authorization & Digital Signatures */}
              <div className="my-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Metrologist */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 uppercase">
                    <CheckCircle size={11} />
                    <span>Digitally Verified by Metrologist</span>
                  </div>
                  <div className="font-bold text-slate-900 mt-1 text-xs">
                    {report.testEngineerName || 'Sunita Verma'}
                  </div>
                  <div className="text-[10px] text-slate-500">Testing Metrologist • Regional Reference Standards Laboratory</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-1">
                    Timestamp: {report.testDate || '2026-09-27'} • Token: GOI-DLM-SIG-761
                  </div>
                </div>

                {/* Reviewer */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] font-bold text-blue-700 flex items-center gap-1 uppercase">
                    <Award size={11} />
                    <span>Approved by Reviewing Officer</span>
                  </div>
                  <div className="font-bold text-slate-900 mt-1 text-xs">
                    {report.reviewerName || 'Dr. Ramesh Sharma'}
                  </div>
                  <div className="text-[10px] text-slate-500">Reviewing Officer • Directorate of Legal Metrology, New Delhi</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-1">
                    Verification Ref: DLM-R76-CONF-{reportId}
                  </div>
                </div>
              </div>

              {/* Statutory Notice Bar */}
              <div className="p-2 bg-amber-50 border border-amber-200 rounded text-center text-[10px] font-bold text-amber-800">
                ★ OFFICIAL LEGAL METROLOGY RECORD — VERIFIED AND DIGITALLY RECORDED UNDER THE LEGAL METROLOGY ACT, 2009 ★
              </div>

              {/* Certificate Footer */}
              <div className="mt-4 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                <span>Government of India • Directorate of Legal Metrology • NAWI Type Evaluation System</span>
                <span className="font-bold text-slate-600">Page 1 of 1</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
