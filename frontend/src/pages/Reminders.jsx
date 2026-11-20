import React, { useState, useEffect } from 'react';
import { Bell, Plus } from 'lucide-react';
import ReminderCard from '../components/reminders/ReminderCard';
import ReminderFormModal from '../components/reminders/ReminderFormModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNotification } from '../context/NotificationContext';
import * as reminderService from '../services/reminderService';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addNotification } = useNotification();

  const fetchReminders = async () => {
    try {
      const data = await reminderService.getReminders();
      setReminders(data || []);
    } catch (err) {
      console.error('Failed to load reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleCreate = async (formData) => {
    try {
      await reminderService.createReminder(formData);
      addNotification('Reminder configured successfully!', 'success');
      fetchReminders();
    } catch (err) {
      console.error('Failed to save reminder:', err);
      addNotification('Failed to save reminder', 'error');
    }
  };

  const handleToggle = async (reminder) => {
    try {
      await reminderService.updateReminder(reminder._id, {
        isActive: !reminder.isActive,
      });
      setReminders((prev) =>
        prev.map((r) => (r._id === reminder._id ? { ...r, isActive: !r.isActive } : r))
      );
      addNotification(
        `Reminder ${!reminder.isActive ? 'activated' : 'deactivated'}`,
        'info'
      );
    } catch (err) {
      console.error('Failed to toggle reminder:', err);
      addNotification('Failed to toggle status', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await reminderService.deleteReminder(id);
      addNotification('Reminder removed', 'info');
      setReminders((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error('Failed to delete reminder:', err);
      addNotification('Failed to delete reminder', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-teal-600" />
            Health Reminders & Daily Alarms
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure alarms for medicine doses, refills, and appointments
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reminder
        </button>
      </div>

      {loading ? (
        <LoadingSpinner size="large" message="Loading your health alarms..." />
      ) : reminders.length === 0 ? (
        <div className="p-12 text-center med-card bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
          No reminders configured. Click "Add Reminder" to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reminders.map((rem) => (
            <ReminderCard
              key={rem._id}
              reminder={rem}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      <ReminderFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default Reminders;
