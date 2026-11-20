import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileUp,
  Pill,
  ClipboardList,
  Calendar,
  Bell,
  User,
  ShieldCheck,
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Upload Prescription', path: '/upload', icon: FileUp },
    { name: 'Medicines', path: '/medicines', icon: Pill },
    { name: 'Medical History', path: '/medical-history', icon: ClipboardList },
    { name: 'Appointments', path: '/appointments', icon: Calendar },
    { name: 'Reminders', path: '/reminders', icon: Bell },
    { name: 'Patient Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block border-r border-slate-200 bg-white/50 p-4 space-y-6">
      <div className="px-3 py-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Patient Portal
        </h2>
      </div>

      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 border border-teal-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Trust & Safety Callout Box */}
      <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-2">
        <div className="flex items-center space-x-2 text-teal-800">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <span className="text-xs font-bold uppercase tracking-wider">Secure Health Hub</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Prescriptions are scanned with Tesseract OCR & parsed cleanly for patient clarity.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
