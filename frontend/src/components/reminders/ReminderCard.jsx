import React from 'react';
import { Bell, Clock, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const ReminderCard = ({ reminder, onDelete, onToggle }) => {
  return (
    <div className="med-card p-5 bg-white border border-slate-200 shadow-xs rounded-2xl hover:border-teal-200 transition-all space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 font-bold">
            <Bell className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900">{reminder.title}</h4>
            <div className="flex items-center space-x-2 text-xs text-slate-600 mt-0.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-bold text-slate-900">{reminder.time}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onToggle(reminder)}
          className="text-slate-400 hover:text-teal-700 transition-colors"
          title={reminder.isActive ? 'Disable Reminder' : 'Enable Reminder'}
        >
          {reminder.isActive ? (
            <ToggleRight className="w-8 h-8 text-teal-600" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-slate-400" />
          )}
        </button>
      </div>

      <div className="flex items-center space-x-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
          const isSelected = reminder.days?.includes(day);
          return (
            <span
              key={day}
              className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                isSelected
                  ? 'bg-teal-50 text-teal-800 border-teal-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              {day}
            </span>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <span className="capitalize text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
          Category: {reminder.type || 'medicine'}
        </span>
        <button
          onClick={() => onDelete(reminder._id)}
          className="text-slate-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </button>
      </div>
    </div>
  );
};

export default ReminderCard;
