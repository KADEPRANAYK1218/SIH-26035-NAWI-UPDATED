import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { reportService } from '../services/reportService.js';
import ReportTable from '../components/ReportTable.jsx';
import Modal from '../components/Modal.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Loading from '../components/Loading.jsx';
import DocumentViewerModal from '../components/DocumentViewerModal.jsx';
import {
  Search,
  Filter,
  Calendar,
  History,
  Download,
  FileDown,
  FileText,
  Building,
  Scale,
  Paperclip,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Loader2,
  Printer
} from 'lucide-react';
import '../styles/reports.css';

export default function ReportRepository() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') === 'focus' ? '' : (searchParams.get('search') || '');

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Selected report for History / Details Modal
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Document Viewer Modal state
  const [viewerReport, setViewerReport] = useState(null);
  const [viewerDocType, setViewerDocType] = useState('pdf');
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
  const [downloadingDoc, setDownloadingDoc] = useState(null);

  const handleOpenDocViewer = (report, type) => {
    setViewerReport(report);
    setViewerDocType(type);
    setIsViewerModalOpen(true);
  };

  const handleDownloadDoc = async (report, type) => {
    try {
      setDownloadingDoc(type);
      if (type === 'pdf') {
        await reportService.downloadPdf(report.id, report.reportNumber);
      } else {
        await reportService.downloadDocx(report.id, report.reportNumber);
      }
    } catch (err) {
      console.error(err);
      alert(`Could not download ${type.toUpperCase()}. Please try again.`);
    } finally {
      setDownloadingDoc(null);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await reportService.getAll({
        search: searchQuery,
        status: statusFilter,
        fromDate,
        toDate
      });
      if (res.success && res.data) {
        setReports(res.data);
      }
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, fromDate, toDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setFromDate('');
    setToDate('');
    setTimeout(fetchReports, 50);
  };

  const handleViewReport = async (report) => {
    try {
      const res = await reportService.getById(report.id);
      if (res.success && res.data) {
        setSelectedReport(res.data);
      } else {
        setSelectedReport(report);
      }
    } catch {
      setSelectedReport(report);
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">
          Report Repository & Test History
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1 m-0">
          Search, view, and export historical NAWI verification reports and instrument test track records
        </p>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Report ID, Manufacturer, Model number, or Serial Number..."
              className="form-input pl-10"
              autoFocus={searchParams.get('search') === 'focus'}
            />
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          </div>

          <button type="submit" className="btn-primary py-2.5 px-5 text-xs">
            <Search size={14} />
            <span>Search</span>
          </button>
        </form>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-600 flex items-center gap-1">
              <Filter size={14} />
              <span>Status:</span>
            </span>

            {['', 'COMPLETED', 'FAILED', 'IN_PROGRESS', 'PENDING_REVIEW'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full font-bold uppercase text-[11px] transition border ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st === '' ? 'All Reports' : st.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-slate-500 font-medium">From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="p-1 border border-slate-300 rounded text-xs"
            />
            <span className="text-slate-500 font-medium">To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="p-1 border border-slate-300 rounded text-xs"
            />

            {(searchQuery || statusFilter || fromDate || toDate) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-red-600 font-semibold hover:underline bg-transparent border-none p-1 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* REPORTS TABLE */}
      {loading ? (
        <Loading message="Filtering test reports repository..." />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-500">
              Showing {reports.length} report(s) in repository
            </span>
          </div>

          <ReportTable
            reports={reports}
            onViewReport={handleViewReport}
          />
        </div>
      )}

      {/* VIEW REPORT & INSTRUMENT-WISE HISTORY MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedReport ? `Verification Report & Test History: ${selectedReport.reportNumber || selectedReport.id}` : 'Report Details'}
        maxWidth="max-w-5xl"
      >
        {selectedReport && (
          <div className="space-y-6">
            {/* Header Status Bar */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 flex-wrap gap-4">
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Report Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedReport.overallResult || selectedReport.status} />
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Date of Evaluation</span>
                <div className="text-xs font-bold text-slate-900 mt-1">{selectedReport.testDate}</div>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Testing Laboratory</span>
                <div className="text-xs font-bold text-slate-900 mt-1">{selectedReport.laboratoryName}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenDocViewer(selectedReport, 'pdf')}
                  className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                  title="View PDF File"
                >
                  <Eye size={12} />
                  <span>View PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenDocViewer(selectedReport, 'docx')}
                  className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                  title="View Word Document"
                >
                  <Eye size={12} />
                  <span>View Word</span>
                </button>
              </div>
            </div>

            {/* Instrument Details Card */}
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Scale size={14} />
                <span>Instrument Identification & Characteristics</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Manufacturer</span>
                  <span className="font-semibold text-slate-900">{selectedReport.instrument?.manufacturer || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Model</span>
                  <span className="font-semibold text-slate-900">{selectedReport.instrument?.model || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Serial Number</span>
                  <span className="font-mono text-slate-900 font-bold">{selectedReport.instrument?.serialNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Accuracy Class</span>
                  <span className="font-bold text-blue-900">Class {selectedReport.instrument?.accuracyClass || 'III'}</span>
                </div>

                <div>
                  <span className="text-slate-400 block">Max Capacity</span>
                  <span className="font-semibold text-slate-900">{selectedReport.instrument?.maxCapacity} {selectedReport.instrument?.unit || 'kg'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Scale Interval (e)</span>
                  <span className="font-mono text-slate-900">{selectedReport.instrument?.verificationScaleInterval} {selectedReport.instrument?.unit || 'kg'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Verification Intervals (n)</span>
                  <span className="font-mono text-slate-900">{selectedReport.instrument?.numberOfVerificationIntervals?.toLocaleString() || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Instrument Type</span>
                  <span className="font-semibold text-slate-900">{selectedReport.instrument?.instrumentType || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* INSTRUMENT-WISE TEST HISTORY */}
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <History size={14} />
                <span>Instrument-Wise Test History for Serial: {selectedReport.instrument?.serialNumber}</span>
              </h4>
              <p className="text-[11px] text-slate-600 mb-3">
                Chronological record of prior pattern examinations, reverifications, and compliance outcomes for this physical unit.
              </p>

              {selectedReport.history && selectedReport.history.length > 0 ? (
                <div className="space-y-2">
                  {selectedReport.history.map((h, i) => (
                    <div
                      key={h.id || i}
                      className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-blue-100 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-blue-900">{h.reportNumber || h.id}</span>
                        <span className="text-slate-500">{h.testDate}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={h.overallResult || h.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic m-0">No prior test history recorded for this serial number.</p>
              )}
            </div>

            {/* Test Observations Summary */}
            {selectedReport.observations && selectedReport.observations.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Recorded Test Observations ({selectedReport.observations.length} points)
                </h4>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="p-2 font-semibold">Test Point</th>
                        <th className="p-2 text-right">Reference</th>
                        <th className="p-2 text-right">Indicated</th>
                        <th className="p-2 text-right">Calc. Error</th>
                        <th className="p-2 text-center">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReport.observations.map((obs, idx) => (
                        <tr key={idx} className="border-b border-slate-100">
                          <td className="p-2 font-medium text-slate-800">{obs.testType}: {obs.testPoint}</td>
                          <td className="p-2 text-right font-mono">{obs.referenceValue}</td>
                          <td className="p-2 text-right font-mono">{obs.indicatedValue}</td>
                          <td className="p-2 text-right font-mono font-bold text-blue-800">{obs.calculatedError}</td>
                          <td className="p-2 text-center">
                            <StatusBadge status={obs.result || 'PASS'} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Supporting Attachments Section */}
            {selectedReport.attachments && selectedReport.attachments.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Paperclip size={14} />
                  <span>Supporting Photographs & Certificates</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedReport.attachments.map((att) => (
                    <div key={att.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                      <div className="truncate">
                        <span className="font-semibold text-slate-800 block truncate">{att.filename}</span>
                        <span className="text-[10px] text-slate-400">{att.fileType}</span>
                      </div>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded">Attached</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 mt-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/report/${selectedReport.id}`)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  title="Open Printable 1-Page Report"
                >
                  <Printer size={13} />
                  <span>Print Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/report/${selectedReport.id}`)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  title="View Full Test Report Sheet"
                >
                  <Eye size={13} />
                  <span>View Full Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenDocViewer(selectedReport, 'pdf')}
                  className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <FileDown size={13} />
                  <span>View PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenDocViewer(selectedReport, 'docx')}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <FileText size={13} />
                  <span>View Word</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={downloadingDoc === 'pdf'}
                  onClick={() => handleDownloadDoc(selectedReport, 'pdf')}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  {downloadingDoc === 'pdf' ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <FileDown size={13} />
                  )}
                  <span>Download PDF</span>
                </button>

                <button
                  type="button"
                  disabled={downloadingDoc === 'docx'}
                  onClick={() => handleDownloadDoc(selectedReport, 'docx')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  {downloadingDoc === 'docx' ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Download size={13} />
                  )}
                  <span>Download Word</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Embedded Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isViewerModalOpen}
        onClose={() => setIsViewerModalOpen(false)}
        report={viewerReport}
        initialDocType={viewerDocType}
      />
    </div>
  );
}
