import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, FileDown, FileText, Download, Loader2, Printer } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import DocumentViewerModal from './DocumentViewerModal.jsx';
import { reportService } from '../services/reportService.js';

export default function ReportTable({ reports = [], onViewReport }) {
  const navigate = useNavigate();
  const [selectedDocReport, setSelectedDocReport] = useState(null);
  const [docModalType, setDocModalType] = useState('pdf');
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const handleOpenPdf = (report, e) => {
    e.stopPropagation();
    setSelectedDocReport(report);
    setDocModalType('pdf');
    setIsDocModalOpen(true);
  };

  const handleOpenDocx = (report, e) => {
    e.stopPropagation();
    setSelectedDocReport(report);
    setDocModalType('docx');
    setIsDocModalOpen(true);
  };

  const handleDownloadFile = async (report, type, e) => {
    e.stopPropagation();
    const key = `${report.id}-${type}`;
    try {
      setDownloadingId(key);
      if (type === 'pdf') {
        await reportService.downloadPdf(report.id, report.reportNumber);
      } else {
        await reportService.downloadDocx(report.id, report.reportNumber);
      }
    } catch (err) {
      console.error('Download failed:', err);
      alert(`Could not download ${type.toUpperCase()}. Please try again.`);
    } finally {
      setDownloadingId(null);
    }
  };

  if (!reports || reports.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
        <p className="text-sm m-0">No test reports found matching the criteria.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/50">
            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Report ID
            </th>
            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Instrument
            </th>
            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Model
            </th>
            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Serial Number
            </th>
            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Test Date
            </th>
            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
              Action & Documents
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {reports.map((report) => {
            const inst = report.instrument || {};
            // Determine display status (PASS, FAIL, IN PROGRESS)
            let statusToDisplay = report.status;
            if (report.overallResult === 'PASS' || report.status === 'COMPLETED') {
              statusToDisplay = 'PASS';
            } else if (report.overallResult === 'FAIL' || report.status === 'FAILED') {
              statusToDisplay = 'FAIL';
            } else if (report.status === 'IN_PROGRESS') {
              statusToDisplay = 'IN PROGRESS';
            }

            const isPdfDownloading = downloadingId === `${report.id}-pdf`;
            const isDocxDownloading = downloadingId === `${report.id}-docx`;

            return (
              <tr
                key={report.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  {report.reportNumber || report.id}
                </td>
                <td className="py-3.5 px-4 text-slate-800 font-medium">
                  {inst.instrumentType || 'Weighing Instrument'}
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">
                  {inst.model || 'N/A'}
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                  {inst.serialNumber || 'N/A'}
                </td>
                <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                  {report.testDate}
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={statusToDisplay} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center justify-end gap-1.5 flex-nowrap">
                    {/* View Report */}
                    <button
                      type="button"
                      onClick={() => onViewReport(report)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-200 transition-colors cursor-pointer"
                      title="View Report Details & History"
                    >
                      <Eye size={13} />
                      <span>View Report</span>
                    </button>

                    {/* Print Report */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/report/${report.id}`);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 shadow-2xs transition-colors cursor-pointer"
                      title="Print Official Report (1 Page)"
                    >
                      <Printer size={13} />
                      <span>Print Report</span>
                    </button>

                    {/* View PDF Button */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenPdf(report, e)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 shadow-2xs transition-colors cursor-pointer"
                      title="View 1-Page PDF Certificate"
                    >
                      <FileDown size={13} />
                      <span>PDF</span>
                    </button>

                    {/* View Word Button */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenDocx(report, e)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 shadow-2xs transition-colors cursor-pointer"
                      title="View Word (.docx) Document"
                    >
                      <FileText size={13} />
                      <span>Word</span>
                    </button>

                    {/* Direct PDF Download icon */}
                    <button
                      type="button"
                      onClick={(e) => handleDownloadFile(report, 'pdf', e)}
                      disabled={isPdfDownloading}
                      className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Direct Download PDF"
                    >
                      {isPdfDownloading ? (
                        <Loader2 size={15} className="animate-spin text-red-600" />
                      ) : (
                        <Download size={15} />
                      )}
                    </button>

                    {/* Direct DOCX Download icon */}
                    <button
                      type="button"
                      onClick={(e) => handleDownloadFile(report, 'docx', e)}
                      disabled={isDocxDownloading}
                      className="p-1 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      title="Direct Download Word (.docx)"
                    >
                      {isDocxDownloading ? (
                        <Loader2 size={15} className="animate-spin text-blue-600" />
                      ) : (
                        <FileText size={15} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Embedded Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        report={selectedDocReport}
        initialDocType={docModalType}
      />
    </div>
  );
}
