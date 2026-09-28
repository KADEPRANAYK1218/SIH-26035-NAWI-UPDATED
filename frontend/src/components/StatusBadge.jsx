import React from 'react';

export default function StatusBadge({ status }) {
  const norm = (status || 'PENDING').toUpperCase();

  if (norm === 'PASS' || norm === 'COMPLETED') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-emerald-100/90 text-emerald-800 border border-emerald-200">
        PASS
      </span>
    );
  }

  if (norm === 'FAIL' || norm === 'FAILED') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-rose-100/90 text-rose-800 border border-rose-200">
        FAIL
      </span>
    );
  }

  if (norm === 'IN_PROGRESS' || norm === 'IN PROGRESS') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-amber-100/90 text-amber-800 border border-amber-200">
        IN PROGRESS
      </span>
    );
  }

  if (norm === 'PENDING_REVIEW' || norm === 'PENDING') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-blue-100/90 text-blue-800 border border-blue-200">
        PENDING REVIEW
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-slate-100 text-slate-700 border border-slate-200">
      {status}
    </span>
  );
}
