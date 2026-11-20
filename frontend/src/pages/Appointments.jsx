import React, { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import AppointmentCard from '../components/appointments/AppointmentCard';
import AppointmentFormModal from '../components/appointments/AppointmentFormModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNotification } from '../context/NotificationContext';
import * as appointmentService from '../services/appointmentService';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState(null);

  const { addNotification } = useNotification();

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingAppt) {
        await appointmentService.updateAppointment(editingAppt._id, formData);
        addNotification('Appointment updated successfully', 'success');
      } else {
        await appointmentService.createAppointment(formData);
        addNotification('Doctor appointment scheduled!', 'success');
      }
      fetchAppointments();
    } catch (err) {
      console.error('Failed to save appointment:', err);
      addNotification('Failed to save appointment', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await appointmentService.deleteAppointment(id);
      addNotification('Appointment cancelled', 'info');
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error('Failed to delete appointment:', err);
      addNotification('Failed to delete appointment', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-teal-600" />
            Doctor Appointments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage upcoming consultations, clinic visits, and health checkups
          </p>
        </div>

        <button
          onClick={() => {
            setEditingAppt(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Visit
        </button>
      </div>

      {loading ? (
        <LoadingSpinner size="large" message="Loading appointment schedule..." />
      ) : appointments.length === 0 ? (
        <div className="p-12 text-center med-card bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
          No appointments scheduled. Click "Schedule Visit" to add one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {appointments.map((appt) => (
            <AppointmentCard
              key={appt._id}
              appointment={appt}
              onDelete={handleDelete}
              onEdit={(a) => {
                setEditingAppt(a);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <AppointmentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingAppt}
      />
    </div>
  );
};

export default Appointments;
