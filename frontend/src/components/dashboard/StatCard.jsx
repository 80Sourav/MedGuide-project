import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'teal', subtitle }) => {
  const colorMap = {
    teal: 'bg-white border-teal-200 text-teal-800',
    cyan: 'bg-white border-sky-200 text-sky-800',
    emerald: 'bg-white border-emerald-200 text-emerald-800',
    amber: 'bg-white border-amber-200 text-amber-800',
  };

  const iconBgMap = {
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    cyan: 'bg-sky-50 text-sky-700 border-sky-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <div className={`p-5 rounded-2xl border shadow-xs med-card-hover ${colorMap[color] || colorMap.teal}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 font-medium mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl border ${iconBgMap[color] || iconBgMap.teal}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
