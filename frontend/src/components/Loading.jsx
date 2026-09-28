import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading({ message = 'Loading metrology data...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
      <Loader2 size={32} className="animate-spin text-blue-600 mb-3" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
