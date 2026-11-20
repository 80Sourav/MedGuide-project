import React, { useEffect, useState } from 'react';
import { FileText, Pill, Calendar, Bell, Sparkles, UploadCloud, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import UpcomingAppointmentsWidget from '../components/dashboard/UpcomingAppointmentsWidget';
import TodayMedicinesWidget from '../components/dashboard/TodayMedicinesWidget';
import LoadingSpinner from '../components/common/LoadingSpinner';

import * as prescriptionService from '../services/prescriptionService';
import * as medicineService from '../services/medicineService';
import * as appointmentService from '../services/appointmentService';
import * as reminderService from '../services/reminderService';

const Dashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [prescRes, medRes, apptRes, remRes] = await Promise.allSettled([
          prescriptionService.getPrescriptions(),
          medicineService.getMedicines(),
          appointmentService.getAppointments(),
          reminderService.getReminders(),
        ]);

        if (prescRes.status === 'fulfilled') setPrescriptions(prescRes.value || []);
        if (medRes.status === 'fulfilled') setMedicines(medRes.value || []);
        if (apptRes.status === 'fulfilled') setAppointments(apptRes.value || []);
        if (remRes.status === 'fulfilled') setReminders(remRes.value || []);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="large" message="Loading patient health dashboard..." />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-teal-700 to-teal-800 text-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>MedGuide Healthcare Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Patient Overview</h1>
          <p className="text-sm text-teal-50 leading-relaxed font-medium">
            Upload actual prescriptions to run OCR text extraction and AI breakdown of your medicines, dosages, and doctor visits.
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex items-center px-6 py-3.5 rounded-xl text-sm font-bold text-teal-900 bg-white hover:bg-teal-50 shadow-sm transition-all flex-shrink-0"
        >
          <UploadCloud className="w-5 h-5 mr-2 text-teal-700" />
          Upload Prescription
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Prescriptions"
          value={prescriptions.length}
          icon={FileText}
          color="teal"
          subtitle="Scanned & Analyzed"
        />
        <StatCard
          title="Active Medicines"
          value={medicines.length}
          icon={Pill}
          color="cyan"
          subtitle="Current daily schedule"
        />
        <StatCard
          title="Appointments"
          value={appointments.length}
          icon={Calendar}
          color="emerald"
          subtitle="Scheduled doctor visits"
        />
        <StatCard
          title="Reminders"
          value={reminders.length}
          icon={Bell}
          color="amber"
          subtitle="Medication alarms"
        />
      </div>

      {/* Recent Prescriptions List */}
      {prescriptions.length > 0 && (
        <div className="med-card p-6 bg-white border border-slate-200 shadow-xs rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              Recent Prescriptions
            </h2>
            <Link to="/upload" className="text-xs font-bold text-teal-700 hover:underline">
              + Upload New
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prescriptions.slice(0, 3).map((p) => (
              <Link
                key={p._id}
                to={`/prescriptions/${p._id}`}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-teal-50/50 hover:border-teal-200 transition-all block space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{p.title || 'Prescription'}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                    Processed
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Dr: {p.doctorName || 'Not specified'}</p>
                <p className="text-[11px] text-slate-400">
                  {new Date(p.datePrescribed || p.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TodayMedicinesWidget medicines={medicines} />
        <UpcomingAppointmentsWidget appointments={appointments} />
      </div>
    </div>
  );
};

export default Dashboard;
