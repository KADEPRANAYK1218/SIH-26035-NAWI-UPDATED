import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reportService } from '../services/reportService.js';
import StatusBadge from '../components/StatusBadge.jsx';
import Loading from '../components/Loading.jsx';
import DocumentViewerModal from '../components/DocumentViewerModal.jsx';
import {
  FileDown,
  FileText,
  Printer,
  ArrowLeft,
  CheckCircle,
  Building,
  ShieldCheck,
  Eye,
  Download,
  Loader2
} from 'lucide-react';
import '../styles/reports.css';

export default function ReportPreview({ report: propReport = null, onBack = undefined } = {}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [report, setReport] = useState(propReport || null);
  const [loading, setLoading] = useState(!propReport && Boolean(id));
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerDocType, setViewerDocType] = useState('pdf');
  const [downloadingType, setDownloadingType] = useState(null);

  useEffect(() => {
    if (propReport) {
      setReport(propReport);
      setLoading(false);
      return;
    }

    if (id) {
      setLoading(true);
      reportService.getById(id)
        .then((res) => {
          if (res.success && res.data) {
            setReport(res.data);
          }
        })
        .catch((err) => {
          console.error('Failed to load report for preview:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, propReport]);

  if (loading) {
    return <Loading message="Loading official test report document..." />;
  }

  if (!report) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-sm text-slate-500 m-0">No report selected for preview.</p>
        <button onClick={() => navigate('/report-repository')} className="btn-primary mt-4">
          Go to Repository
        </button>
      </div>
    );
  }

  const handleDownload = async (type) => {
    try {
      setDownloadingType(type);
      if (type === 'pdf') {
        await reportService.downloadPdf(report.id, report.reportNumber);
      } else {
        await reportService.downloadDocx(report.id, report.reportNumber);
      }
    } catch (e) {
      alert(`Could not download ${type.toUpperCase()}`);
    } finally {
      setDownloadingType(null);
    }
  };

  const inst = report.instrument || {};
  const lab = report.laboratoryConditions || {};
  const observations = report.observations || [];
  const unit = inst.unit || 'kg';

  return (
    <div className="space-y-6 printable-report">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-xl border border-slate-200 no-print top-action-bar">
        <button
          onClick={onBack || (() => navigate('/report-repository'))}
          className="btn-secondary py-2 px-3 text-xs"
        >
          <ArrowLeft size={14} />
          <span>Back to List</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="btn-secondary py-2 px-3 text-xs"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>

          {/* View PDF */}
          <button
            type="button"
            onClick={() => {
              setViewerDocType('pdf');
              setIsViewerOpen(true);
            }}
            className="btn-secondary py-2 px-3 text-xs text-red-700 bg-red-50 hover:bg-red-100 border-red-200 flex items-center gap-1.5"
            title="View Official PDF File"
          >
            <Eye size={14} />
            <span>View PDF</span>
          </button>

          {/* View Word */}
          <button
            type="button"
            onClick={() => {
              setViewerDocType('docx');
              setIsViewerOpen(true);
            }}
            className="btn-secondary py-2 px-3 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200 flex items-center gap-1.5"
            title="View Word Document"
          >
            <Eye size={14} />
            <span>View Word</span>
          </button>

          {/* Download PDF */}
          <button
            type="button"
            disabled={downloadingType === 'pdf'}
            onClick={() => handleDownload('pdf')}
            className="btn-primary py-2 px-3 text-xs bg-red-700 hover:bg-red-800 disabled:opacity-50 flex items-center gap-1.5"
          >
            {downloadingType === 'pdf' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <FileDown size={14} />
            )}
            <span>Download PDF</span>
          </button>

          {/* Download DOCX */}
          <button
            type="button"
            disabled={downloadingType === 'docx'}
            onClick={() => handleDownload('docx')}
            className="btn-primary py-2 px-3 text-xs bg-blue-700 hover:bg-blue-800 disabled:opacity-50 flex items-center gap-1.5"
          >
            {downloadingType === 'docx' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            <span>Download DOCX</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Sheet */}
      <div className="report-document-sheet bg-white">
        {/* Header */}
        <div className="text-center pb-6 border-b-2 border-slate-900">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">
            Government of India • Department of Consumer Affairs
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Directorate of Legal Metrology • Regional Reference Standards Laboratory
          </div>

          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight m-0 uppercase">
            Non-Automatic Weighing Instrument (NAWI)
          </h1>
          <h2 className="text-sm font-bold text-blue-700 m-0 uppercase tracking-wider mt-1">
            Type Evaluation & Pattern Verification Test Report
          </h2>
          <div className="text-xs text-slate-500 mt-1 italic">
            In accordance with OIML Recommendation R 76-1 (2006) & Legal Metrology (General) Rules, 2011
          </div>

          {/* Prototype Notice */}
          <div className="mt-3 p-1.5 bg-amber-50 border border-amber-300 rounded text-[11px] font-bold text-amber-800">
            ★ PROTOTYPE / DEMONSTRATION RECORD — NOT A STATUTORY MODEL APPROVAL CERTIFICATE ★
          </div>
        </div>

        {/* Report Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 my-6 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold">Report Number</span>
            <span className="font-bold text-slate-900">{report.reportNumber || report.id}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Test Date</span>
            <span className="font-bold text-slate-900">{report.testDate}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Laboratory</span>
            <span className="font-bold text-slate-900 truncate block">{report.laboratoryName || 'RRSL New Delhi'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Status / Result</span>
            <StatusBadge status={report.overallResult || report.status} />
          </div>
        </div>

        {/* Section 1: Manufacturer & Instrument Specs */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider pb-1 mb-3 border-b border-blue-200">
            1. Applicant & Instrument Technical Specifications
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Manufacturer</span>
              <span className="font-semibold text-slate-900">{inst.manufacturer || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Model Number</span>
              <span className="font-semibold text-slate-900">{inst.model || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Serial Number</span>
              <span className="font-mono text-slate-900">{inst.serialNumber || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Instrument Type</span>
              <span className="font-semibold text-slate-900">{inst.instrumentType || 'N/A'}</span>
            </div>

            <div>
              <span className="text-slate-500 block">Accuracy Class</span>
              <span className="font-bold text-blue-900">Class {inst.accuracyClass || 'III'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Max Capacity (Max)</span>
              <span className="font-semibold text-slate-900">{inst.maxCapacity} {unit}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Min Capacity (Min)</span>
              <span className="font-semibold text-slate-900">{inst.minCapacity || 'N/A'} {unit}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Intervals (e / d)</span>
              <span className="font-mono text-slate-900">
                e = {inst.verificationScaleInterval} {unit}, d = {inst.actualScaleInterval || inst.verificationScaleInterval}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Laboratory & Environmental Conditions */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider pb-1 mb-3 border-b border-blue-200">
            2. Environmental Conditions & Standards
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Ambient Temp</span>
              <span className="font-semibold text-slate-900">{lab.temperature || '23.4'} °C</span>
            </div>
            <div>
              <span className="text-slate-500 block">Relative Humidity</span>
              <span className="font-semibold text-slate-900">{lab.humidity || '52.0'} % RH</span>
            </div>
            <div>
              <span className="text-slate-500 block">Mains Power</span>
              <span className="font-semibold text-slate-900">{lab.voltage || '230'} V / {lab.frequency || '50'} Hz</span>
            </div>
            <div>
              <span className="text-slate-500 block">Working Standards</span>
              <span className="font-semibold text-slate-900">{lab.standardWeightsId || 'Certified Class F1/M1'}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Test Observations Table */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider pb-1 mb-3 border-b border-blue-200">
            3. Test Observations & Calculated Errors
          </h3>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                  <th className="p-2.5">Test Procedure / Point</th>
                  <th className="p-2.5 text-right">Reference ({unit})</th>
                  <th className="p-2.5 text-right">Indicated ({unit})</th>
                  <th className="p-2.5 text-right">Calculated Error</th>
                  <th className="p-2.5 text-center">Configured MPE</th>
                  <th className="p-2.5 text-center">Result</th>
                </tr>
              </thead>
              <tbody>
                {observations.map((obs, i) => {
                  const errVal = Number(obs.calculatedError);
                  const isPass = (obs.result || 'PASS').toUpperCase() === 'PASS';
                  return (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="p-2.5">
                        <span className="font-semibold text-slate-800">{obs.testType}:</span> {obs.testPoint}
                      </td>
                      <td className="p-2.5 text-right font-mono">{obs.referenceValue}</td>
                      <td className="p-2.5 text-right font-mono">{obs.indicatedValue}</td>
                      <td className="p-2.5 text-right font-mono font-bold">
                        <span className={isPass ? 'text-emerald-700' : 'text-rose-700'}>
                          {errVal > 0 ? `+${errVal}` : errVal} {unit}
                        </span>
                      </td>
                      <td className="p-2.5 text-center font-mono text-[11px] text-slate-600">
                        {obs.applicableRequirement}
                      </td>
                      <td className="p-2.5 text-center">
                        <StatusBadge status={obs.result || 'PASS'} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Metrological Determination */}
        <div className={`p-4 rounded-xl border-2 mb-6 ${
          report.overallResult === 'PASS'
            ? 'bg-emerald-50 border-emerald-500'
            : 'bg-rose-50 border-rose-500'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Overall Compliance Determination
              </span>
              <div className={`text-2xl font-black ${report.overallResult === 'PASS' ? 'text-emerald-800' : 'text-rose-800'}`}>
                RESULT: {report.overallResult || 'PASS'}
              </div>
              <p className="text-xs text-slate-600 mt-1 m-0">
                {report.remarks || 'Evaluation performed against applicable OIML R 76 tolerances.'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 uppercase block">Standard Applied</span>
              <span className="text-xs font-bold text-slate-900">OIML R 76-1: 2006</span>
            </div>
          </div>
        </div>

        {/* Section 5: Signatures */}
        <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="h-10 border-b border-slate-400 mb-2 flex items-end">
              <span className="font-mono text-[11px] text-emerald-800 font-bold">
                {report.signedByEngineer ? '[DIGITALLY VERIFIED - TEST ENGINEER]' : '[PENDING SIGNATURE]'}
              </span>
            </div>
            <div className="font-bold text-slate-900">{report.testEngineerName || 'Sunita Verma'}</div>
            <div className="text-slate-500">Test Engineer • Regional Reference Standards Laboratory</div>
          </div>

          <div>
            <div className="h-10 border-b border-slate-400 mb-2 flex items-end">
              <span className="font-mono text-[11px] text-blue-800 font-bold">
                {report.signedByReviewer ? '[DIGITALLY APPROVED - REVIEWER]' : '[PENDING APPROVAL]'}
              </span>
            </div>
            <div className="font-bold text-slate-900">{report.reviewerName || 'Anand Kulkarni'}</div>
            <div className="text-slate-500">Reviewing Officer • Directorate of Legal Metrology</div>
          </div>
        </div>
      </div>

      {/* Embedded Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        report={report}
        initialDocType={viewerDocType}
      />
    </div>
  );
}
