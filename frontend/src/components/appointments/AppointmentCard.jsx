import React from 'react';
import { Calendar, Clock, MapPin, Trash2, Edit3, UserCheck } from 'lucide-react';
import { formatDateTime } from '../../utils/formatDate';

const AppointmentCard = ({ appointment, onDelete, onEdit }) => {
  return (
    <div className="med-card p-5 bg-white border border-slate-200 shadow-xs rounded-2xl hover:border-teal-200 transition-all space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900">{appointment.doctorName}</h4>
            <p className="text-xs text-teal-800 font-bold">{appointment.specialization}</p>
          </div>
        </div>

        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-teal-50 text-teal-800 border border-teal-200">
          {appointment.status || 'Scheduled'}
        </span>
      </div>

      <div className="space-y-2 text-xs text-slate-700">
        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <Clock className="w-4 h-4 text-teal-600" />
          <span className="font-bold text-slate-900">{formatDateTime(appointment.appointmentDate)}</span>
        </div>

        {appointment.hospitalLocation && (
          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span className="font-medium">{appointment.hospitalLocation}</span>
          </div>
        )}
      </div>

      {appointment.notes && (
        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 italic">
          "{appointment.notes}"
        </p>
      )}

      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onEdit(appointment)}
          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
          title="Edit Appointment"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(appointment._id)}
          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          title="Delete Appointment"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;
