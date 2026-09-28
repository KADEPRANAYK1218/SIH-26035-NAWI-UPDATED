import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  trend = '+3 this week',
  trendUp = true
}) {
  const colorMap = {
    blue: {
      bg: 'bg-[#f0f7ff]',
      border: 'border-[#cfe4fc]',
      iconBg: 'bg-[#1e88e5] text-white',
      trendColor: 'text-teal-600',
    },
    amber: {
      bg: 'bg-[#fffbf0]',
      border: 'border-[#fed7aa]',
      iconBg: 'bg-[#fb8c00] text-white',
      trendColor: 'text-amber-600',
    },
    green: {
      bg: 'bg-[#f0fdf4]',
      border: 'border-[#bbf7d0]',
      iconBg: 'bg-[#10b981] text-white',
      trendColor: 'text-emerald-600',
    },
    red: {
      bg: 'bg-[#fff1f2]',
      border: 'border-[#fecdd3]',
      iconBg: 'bg-[#ef4444] text-white',
      trendColor: 'text-rose-600',
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`${scheme.bg} border ${scheme.border} rounded-xl p-4 flex items-center gap-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
    >
      <div
        className={`w-12 h-12 rounded-full ${scheme.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}
      >
        {Icon && <Icon size={22} />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-600 m-0">
          {title}
        </p>
        <div className="text-2xl font-bold text-slate-900 mt-0.5 leading-tight">
          {value !== undefined ? value : '--'}
        </div>
        {trend && (
          <div className={`text-[11px] font-semibold ${scheme.trendColor} flex items-center gap-1 mt-0.5`}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}
