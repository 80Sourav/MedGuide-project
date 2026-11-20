import React from 'react';
import { FileText, Calendar, Sparkles, Trash2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';

const PrescriptionCard = ({ prescription, onDelete }) => {
  return (
    <div className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-teal-500/30 transition-all flex flex-col justify-between space-y-4 group">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                {prescription.title}
              </h4>
              <p className="text-xs text-slate-400">{prescription.doctorName || 'Prescribing Doctor'}</p>
            </div>
          </div>

          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Analyzed
          </span>
        </div>

        {prescription.aiSummary?.simpleSummary && (
          <p className="text-xs text-slate-300 line-clamp-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
            "{prescription.aiSummary.simpleSummary}"
          </p>
        )}

        <div className="flex items-center text-xs text-slate-400 gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Uploaded {formatDate(prescription.createdAt || prescription.datePrescribed)}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <button
          onClick={() => onDelete(prescription._id)}
          className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>

        <Link
          to={`/prescriptions/${prescription._id}`}
          className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
        >
          View Full AI Analysis <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default PrescriptionCard;
