import React from 'react';
import { Pill, Trash2, Edit3, CheckCircle2 } from 'lucide-react';

const MedicineCard = ({ medicine, onDelete, onEdit }) => {
  return (
    <div className="med-card p-5 bg-white border border-slate-200 shadow-xs rounded-2xl hover:border-teal-200 transition-all space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 font-bold">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900">{medicine.name}</h4>
            <p className="text-xs text-teal-800 font-bold">{medicine.dosage}</p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
            medicine.isActive
              ? 'bg-teal-50 text-teal-800 border-teal-200'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}
        >
          {medicine.isActive ? 'Active' : 'Completed'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Frequency</span>
          <span className="text-slate-800 font-semibold">{medicine.frequency}</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Timing</span>
          <span className="text-teal-800 font-semibold">{medicine.timing || 'Not specified'}</span>
        </div>
      </div>

      {medicine.purpose && (
        <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          "{medicine.purpose}"
        </p>
      )}

      <div className="flex items-center justify-between pt-2 text-xs">
        <span className="text-slate-500 font-medium">
          Stock: <span className="font-bold text-slate-800">{medicine.refillStock || 30}</span> units left
        </span>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onEdit(medicine)}
            className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
            title="Edit Medicine"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(medicine._id)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Medicine"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
