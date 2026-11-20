import React from 'react';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDateTime } from '../../utils/formatDate';

const UpcomingAppointmentsWidget = ({ appointments = [] }) => {
  return (
    <div className="med-card p-6 bg-white border border-slate-200 shadow-xs rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-600" />
          Doctor Appointments
        </h3>
        <Link
          to="/appointments"
          className="text-xs font-bold text-teal-700 hover:underline flex items-center"
        >
          View All <ChevronRight className="w-4 h-4 ml-0.5" />
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs italic">
          No upcoming appointments scheduled.
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.slice(0, 3).map((appt) => (
            <div
              key={appt._id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-teal-200 transition-colors"
            >
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">{appt.doctorName}</h4>
                <p className="text-xs text-teal-800 font-semibold">{appt.specialization}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {formatDateTime(appt.appointmentDate)}
                  </span>
                  {appt.hospitalLocation && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {appt.hospitalLocation}
                    </span>
                  )}
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Scheduled
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointmentsWidget;
