import React from 'react';
import { Pill, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TodayMedicinesWidget = ({ medicines = [] }) => {
  return (
    <div className="med-card p-6 bg-white border border-slate-200 shadow-xs rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Pill className="w-5 h-5 text-teal-600" />
          Today's Active Medicines
        </h3>
        <Link
          to="/medicines"
          className="text-xs font-bold text-teal-700 hover:underline flex items-center"
        >
          View All <ChevronRight className="w-4 h-4 ml-0.5" />
        </Link>
      </div>

      {medicines.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs italic">
          No active medicines recorded. Upload a prescription to extract medicines.
        </div>
      ) : (
        <div className="space-y-3">
          {medicines.slice(0, 4).map((med) => (
            <div
              key={med._id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-teal-200 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 font-bold">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{med.name}</h4>
                  <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
                    <span className="font-bold text-teal-800">{med.dosage}</span>
                    <span>•</span>
                    <span>{med.frequency}</span>
                    <span>•</span>
                    <span className="text-slate-500">{med.timing}</span>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                Active
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodayMedicinesWidget;
