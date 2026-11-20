import React from 'react';
import { HeartPulse } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <HeartPulse className="w-4 h-4 text-teal-600" />
          <span className="font-bold text-slate-800">MedGuide Platform</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="flex items-center space-x-4 font-medium">
          <span className="text-slate-600">Prescription OCR & Patient Healthcare OS</span>
          <span>•</span>
          <span className="text-teal-700">Encrypted Patient Data</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
