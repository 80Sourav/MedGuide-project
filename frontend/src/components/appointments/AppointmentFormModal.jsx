import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const AppointmentFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    doctorName: '',
    specialization: 'General Physician',
    hospitalLocation: '',
    appointmentDate: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      const formattedDate = initialData.appointmentDate
        ? new Date(initialData.appointmentDate).toISOString().slice(0, 16)
        : '';
      setFormData({
        doctorName: initialData.doctorName || '',
        specialization: initialData.specialization || 'General Physician',
        hospitalLocation: initialData.hospitalLocation || '',
        appointmentDate: formattedDate,
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        doctorName: '',
        specialization: 'General Physician',
        hospitalLocation: '',
        appointmentDate: '',
        notes: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Appointment' : 'Schedule Doctor Visit'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Doctor Name *
          </label>
          <input
            type="text"
            required
            value={formData.doctorName}
            onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
            placeholder="e.g. Dr. Sarah Jenkins"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Specialization
            </label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g. Cardiologist"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Hospital / Clinic Location
          </label>
          <input
            type="text"
            value={formData.hospitalLocation}
            onChange={(e) => setFormData({ ...formData, hospitalLocation: e.target.value })}
            placeholder="e.g. City General Hospital, Room 402"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Notes / Symptoms
          </label>
          <textarea
            rows="3"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g. Bring recent blood test reports"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-600"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-xs"
          >
            {initialData ? 'Update Appointment' : 'Confirm Appointment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AppointmentFormModal;
