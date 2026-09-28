import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService.js';
import Loading from '../components/Loading.jsx';
import {
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Scale,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export default function RegulatoryReferences() {
  const [references, setReferences] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('statutes'); // 'statutes' or 'rules'

  useEffect(() => {
    async function fetchData() {
      try {
        const [refRes, ruleRes] = await Promise.all([
          reportService.getRegulatoryReferences(),
          reportService.getRules()
        ]);
        if (refRes.success && refRes.data) setReferences(refRes.data);
        if (ruleRes.success && ruleRes.data) setRules(ruleRes.data);
      } catch (err) {
        console.error('Error fetching regulatory references', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <Loading message="Loading Indian Legal Metrology statutory references..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
          <Building2 size={14} />
          <span>Government of India • Department of Consumer Affairs</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">
          Regulatory References & Metrological Rule Repository
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1 m-0">
          Official statutory baseline, Legal Metrology Acts, and configurable OIML R 76 recommendation thresholds
        </p>
      </div>

      {/* Prototype Notice Box */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-1">PROTOTYPE / DEMONSTRATION NOTICE</span>
          These regulatory references and rule parameters represent standard reference materials from the Department of Consumer Affairs and the International Organization of Legal Metrology (OIML). This prototype does not grant official statutory model approval or certification. Always verify against official Gazette notifications prior to regulatory enforcement.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('statutes')}
          className={`py-3 px-5 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'statutes'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen size={15} />
          <span>Indian Legal Metrology Statutes & OIML Standards ({references.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`py-3 px-5 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'rules'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers size={15} />
          <span>Configured Verification Rules & MPE Limits ({rules.length})</span>
        </button>
      </div>

      {/* TAB 1: STATUTES */}
      {activeTab === 'statutes' && (
        <div className="space-y-4">
          {references.map((ref) => (
            <div
              key={ref.id}
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {ref.sourceType}
                    </span>
                    {ref.version && (
                      <span className="text-[10px] text-slate-500 font-mono font-medium">
                        {ref.version}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 m-0 mb-1">
                    {ref.title}
                  </h3>

                  <div className="text-xs text-blue-700 font-medium mb-3">
                    {ref.organization}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed m-0 mb-4">
                    {ref.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500">
                    {ref.effectiveDate && (
                      <div className="flex items-center gap-1">
                        <Calendar size={13} className="text-slate-400" />
                        <span>Effective Date: {ref.effectiveDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {ref.sourceLink && (
                  <a
                    href={ref.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary py-2 px-3 text-xs"
                  >
                    <span>Open Official Source</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: RULES CONFIGURATION REPOSITORY */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center gap-2">
            <Scale size={16} className="text-blue-700 flex-shrink-0" />
            <span>
              Configurable OIML R 76 Table 6 Tolerances: Used by the Calculation and Compliance engine to evaluate maximum permissible errors (mpe).
            </span>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rule ID</th>
                  <th>Standard</th>
                  <th>Test Procedure</th>
                  <th>Class</th>
                  <th>Parameter / Load Range</th>
                  <th>Configured Tolerance (MPE)</th>
                  <th>Statutory Reference</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.id}>
                    <td className="font-mono text-xs font-bold text-blue-900">{r.ruleId}</td>
                    <td className="text-slate-700">{r.standard} ({r.version})</td>
                    <td className="font-semibold text-slate-900">{r.testType}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
                        {r.instrumentClass}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-slate-700">{r.parameter}</td>
                    <td className="font-bold text-emerald-800 font-mono text-xs">{r.requirement}</td>
                    <td className="text-[11px] text-slate-500 italic">{r.sourceReference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
