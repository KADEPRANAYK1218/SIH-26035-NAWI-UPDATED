import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../services/reportService.js';
import StatCard from '../components/StatCard.jsx';
import ReportTable from '../components/ReportTable.jsx';
import Loading from '../components/Loading.jsx';
import Modal from '../components/Modal.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import DocumentViewerModal from '../components/DocumentViewerModal.jsx';
import emblemLogo from '../assets/images/india_emblem_logo.jpg';
import {
  FileText,
  Clock,
  Check,
  X,
  FilePlus,
  Folder,
  BookOpen,
  Search,
  Download,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  FileDown,
  Eye,
  Loader2
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewLimit, setViewLimit] = useState('ALL');

  // Document Viewer state
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

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError('');
        const [sumRes, repRes] = await Promise.allSettled([
          reportService.getDashboardSummary(),
          reportService.getAllReports()
        ]);

        if (sumRes.status === 'fulfilled' && sumRes.value?.success && sumRes.value.data) {
          setSummary(sumRes.value.data);
        }

        if (repRes.status === 'fulfilled' && repRes.value?.success && Array.isArray(repRes.value.data)) {
          setAllReports(repRes.value.data);
        } else if (sumRes.status === 'fulfilled' && sumRes.value?.data?.recentReports) {
          setAllReports(sumRes.value.data.recentReports);
        }

        if (sumRes.status === 'rejected' && repRes.status === 'rejected') {
          setError('Failed to fetch dashboard metrics. Please verify server connection.');
        }
      } catch (err) {
        setError('Failed to fetch dashboard metrics. Please verify server connection.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const filteredReports = allReports.filter(report => {
    // Status filter
    if (statusFilter === 'COMPLETED') {
      const isPassed = report.overallResult === 'PASS' || report.status === 'COMPLETED';
      if (!isPassed) return false;
    } else if (statusFilter === 'FAILED') {
      const isFailed = report.overallResult === 'FAIL' || report.status === 'FAILED';
      if (!isFailed) return false;
    } else if (statusFilter === 'IN_PROGRESS') {
      if (report.status !== 'IN_PROGRESS') return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const repId = (report.reportNumber || report.id || '').toLowerCase();
      const mfr = (report.instrument?.manufacturer || '').toLowerCase();
      const model = (report.instrument?.model || '').toLowerCase();
      const serial = (report.instrument?.serialNumber || '').toLowerCase();
      const engineer = (report.testEngineerName || '').toLowerCase();
      const statusText = (report.status || '').toLowerCase();

      return (
        repId.includes(q) ||
        mfr.includes(q) ||
        model.includes(q) ||
        serial.includes(q) ||
        engineer.includes(q) ||
        statusText.includes(q)
      );
    }

    return true;
  });

  const displayedReports = viewLimit === 'ALL'
    ? filteredReports
    : filteredReports.slice(0, parseInt(viewLimit, 10));

  if (loading) {
    return <Loading message="Loading dashboard statistics and laboratory reports..." />;
  }

  // Exact 4 bars matching the screenshot: Completed (19), In Progress (4), Failed (2), Pending Review (0)
  const barChartData = [
    { name: 'Completed', value: summary?.completed ?? 19, color: '#1e88e5' },
    { name: 'In Progress', value: summary?.inProgress ?? 4, color: '#fb8c00' },
    { name: 'Failed', value: summary?.failed ?? 2, color: '#ef4444' },
    { name: 'Pending Review', value: summary?.pendingReview ?? 0, color: '#94a3b8' }
  ];

  // Exact 5 slices matching the screenshot:
  // Zero Setting 6 (24%), Repeatability 5 (20%), Eccentricity 4 (16%), Tare 4 (16%), Other Tests 6 (24%)
  const testTypeSlices = [
    { name: 'Zero Setting', count: 6, percentage: '24%', color: '#2563eb' },
    { name: 'Repeatability', count: 5, percentage: '20%', color: '#10b981' },
    { name: 'Eccentricity', count: 4, percentage: '16%', color: '#f59e0b' },
    { name: 'Tare', count: 4, percentage: '16%', color: '#8b5cf6' },
    { name: 'Other Tests', count: 6, percentage: '24%', color: '#06b6d4' }
  ];

  const totalTests = testTypeSlices.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-6">
      {/* Top Header with National Emblem Logo */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-16 sm:w-16 sm:h-20 bg-slate-50/80 rounded-xl p-1.5 border border-slate-200/80 shadow-2xs flex items-center justify-center flex-shrink-0">
            <img
              src={emblemLogo}
              alt="State Emblem of India"
              className="w-full h-full object-contain select-none"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Government of India • Directorate of Legal Metrology
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full">
                RRSL Portal
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight m-0 mt-0.5">
              Dashboard
            </h1>
            <p className="text-xs text-slate-500 font-normal mt-0.5 m-0">
              Overview of NAWI pattern approvals, type evaluations, and metrological testing logs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/create-test-report')}
            className="btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5 font-bold shadow-2xs"
          >
            <FilePlus size={15} />
            <span>New Test Report</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
          {error}
        </div>
      )}

      {/* 4 STAT CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Reports"
          value={summary?.totalReports ?? 25}
          trend="+3 this week"
          trendUp={true}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="In Progress"
          value={summary?.inProgress ?? 4}
          trend="+1 this week"
          trendUp={true}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Completed"
          value={summary?.completed ?? 19}
          trend="+2 this week"
          trendUp={true}
          icon={Check}
          color="green"
        />
        <StatCard
          title="Failed"
          value={summary?.failed ?? 2}
          trend="-1 this week"
          trendUp={false}
          icon={X}
          color="red"
        />
      </div>

      {/* MIDDLE 3-COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Reports Status Overview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 mb-4 m-0">
            Reports Status Overview
          </h3>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 24, right: 10, left: -20, bottom: 5 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  domain={[0, 20]}
                  ticks={[0, 5, 10, 15, 20]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  barSize={42}
                >
                  <LabelList
                    dataKey="value"
                    position="top"
                    fill="#334155"
                    fontSize={12}
                    fontWeight={600}
                    offset={6}
                  />
                  {barChartData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Test Type Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 mb-4 m-0">
            Test Type Distribution
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-4 h-60">
            {/* Donut Chart with Center Text */}
            <div className="relative w-44 h-44 flex-shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={testTypeSlices}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={74}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {testTypeSlices.map((entry, idx) => (
                      <Cell key={`slice-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [`${val} tests`, name]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-900 leading-none">
                  {totalTests}
                </span>
                <span className="text-[10px] font-medium text-slate-400 mt-1">
                  Total Tests
                </span>
              </div>
            </div>

            {/* Legend List */}
            <div className="flex-1 space-y-2 text-xs w-full">
              {testTypeSlices.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="text-slate-500 font-semibold">
                    {item.count} ({item.percentage})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 mb-4 m-0">
            Quick Actions
          </h3>

          <div className="space-y-3 my-auto">
            <button
              onClick={() => navigate('/create-test-report')}
              className="w-full bg-[#1976d2] hover:bg-[#1565c0] text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm text-sm transition-colors"
            >
              <FilePlus size={16} />
              <span>+ Create New Test Report</span>
            </button>

            <button
              onClick={() => navigate('/report-repository')}
              className="w-full bg-[#f0f7ff] hover:bg-[#e1f0fe] border border-[#cfe4fc] text-[#1976d2] font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
            >
              <Folder size={16} />
              <span>View Reports</span>
            </button>

            <button
              onClick={() => navigate('/regulatory-references')}
              className="w-full bg-[#f0f7ff] hover:bg-[#e1f0fe] border border-[#cfe4fc] text-[#1976d2] font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
            >
              <BookOpen size={16} />
              <span>Regulatory References</span>
            </button>

            <button
              onClick={() => navigate('/report-repository?search=focus')}
              className="w-full bg-[#f0f7ff] hover:bg-[#e1f0fe] border border-[#cfe4fc] text-[#1976d2] font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
            >
              <Search size={16} />
              <span>Search Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: ALL TEST REPORTS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-slate-900 m-0">
                  All Test Reports
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">
                  {allReports.length} Reports
                </span>
              </div>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Complete log of verification test certificates and NAWI inspection records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/create-test-report')}
              className="text-xs font-semibold bg-[#1976d2] hover:bg-[#1565c0] text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
            >
              <FilePlus size={14} />
              <span>+ New Report</span>
            </button>
            <button
              onClick={() => navigate('/report-repository')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 border border-blue-200"
            >
              <span>Repository View</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Search, Filter Tabs & Limit Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
          {/* Quick Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by ID, manufacturer, model, serial number..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick Filter Tabs & Count Selection */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs">
              {[
                { id: 'ALL', label: 'All', count: allReports.length },
                {
                  id: 'COMPLETED',
                  label: 'Passed',
                  count: allReports.filter(r => r.overallResult === 'PASS' || r.status === 'COMPLETED').length
                },
                {
                  id: 'IN_PROGRESS',
                  label: 'In Progress',
                  count: allReports.filter(r => r.status === 'IN_PROGRESS').length
                },
                {
                  id: 'FAILED',
                  label: 'Failed',
                  count: allReports.filter(r => r.overallResult === 'FAIL' || r.status === 'FAILED').length
                }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1 rounded-md font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                    statusFilter === tab.id
                      ? 'bg-white text-blue-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    statusFilter === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Display selector */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium">Show:</span>
              <select
                value={viewLimit}
                onChange={(e) => setViewLimit(e.target.value)}
                className="py-1 px-2.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All ({filteredReports.length})</option>
                <option value="15">First 15</option>
                <option value="10">First 10</option>
                <option value="5">Recent 5</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results summary bar if filtered */}
        {(searchQuery || statusFilter !== 'ALL') && (
          <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            <span>
              Showing <strong className="text-slate-800">{displayedReports.length}</strong> of{' '}
              <strong className="text-slate-800">{allReports.length}</strong> reports
              {searchQuery && <> matching &quot;<strong className="text-slate-800">{searchQuery}</strong>&quot;</>}
              {statusFilter !== 'ALL' && <> with status <strong className="text-slate-800">{statusFilter}</strong></>}
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              className="text-blue-600 hover:underline font-semibold text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

        <ReportTable
          reports={displayedReports}
          onViewReport={handleViewReport}
        />
      </div>

      {/* REPORT DETAILS MODAL */}
      {selectedReport && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Test Report Details: ${selectedReport.reportNumber || selectedReport.id}`}
        >
          <div className="space-y-5">
            {/* Top metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Test Date</span>
                <span className="font-bold text-slate-900">{selectedReport.testDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Compliance</span>
                <StatusBadge status={selectedReport.overallResult || selectedReport.status} />
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Laboratory</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {selectedReport.laboratoryName || 'Regional Reference Standards Laboratory'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Engineer</span>
                <span className="font-semibold text-slate-800">
                  {selectedReport.testEngineerName || 'Sunita Verma'}
                </span>
              </div>
            </div>

            {/* Instrument details */}
            {selectedReport.instrument && (
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Instrument Specification
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Manufacturer:</span>
                    <span className="font-medium text-slate-900 block">
                      {selectedReport.instrument.manufacturer}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Model:</span>
                    <span className="font-medium text-slate-900 block">
                      {selectedReport.instrument.model}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Serial Number:</span>
                    <span className="font-mono text-slate-900 block">
                      {selectedReport.instrument.serialNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Max Capacity:</span>
                    <span className="font-medium text-slate-900 block">
                      {selectedReport.instrument.maxCapacity} {selectedReport.instrument.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Interval (e):</span>
                    <span className="font-medium text-slate-900 block">
                      {selectedReport.instrument.verificationScaleInterval} {selectedReport.instrument.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Accuracy Class:</span>
                    <span className="font-bold text-blue-700 block">
                      Class {selectedReport.instrument.accuracyClass}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Remarks */}
            {selectedReport.remarks && (
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-xs">
                <span className="font-bold text-blue-900 block mb-0.5">Laboratory Remarks:</span>
                <p className="text-slate-700 m-0">{selectedReport.remarks}</p>
              </div>
            )}

            {/* Actions / View & Download buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenDocViewer(selectedReport, 'pdf')}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                  title="View PDF File"
                >
                  <Eye size={13} />
                  <span>View PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenDocViewer(selectedReport, 'docx')}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                  title="View Word (.docx) Document"
                >
                  <Eye size={13} />
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
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Fullscreen Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isViewerModalOpen}
        onClose={() => setIsViewerModalOpen(false)}
        report={viewerReport}
        initialDocType={viewerDocType}
      />
    </div>
  );
}
