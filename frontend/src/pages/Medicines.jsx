import React, { useState, useEffect } from 'react';
import { Pill, Plus, Search } from 'lucide-react';
import MedicineCard from '../components/medicines/MedicineCard';
import MedicineFormModal from '../components/medicines/MedicineFormModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNotification } from '../context/NotificationContext';
import * as medicineService from '../services/medicineService';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  const { addNotification } = useNotification();

  const fetchMedicines = async () => {
    try {
      const data = await medicineService.getMedicines();
      setMedicines(data || []);
    } catch (err) {
      console.error('Failed to load medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingMedicine) {
        await medicineService.updateMedicine(editingMedicine._id, formData);
        addNotification('Medicine updated successfully', 'success');
      } else {
        await medicineService.createMedicine(formData);
        addNotification('New medicine added to schedule', 'success');
      }
      fetchMedicines();
    } catch (err) {
      console.error('Failed to save medicine:', err);
      addNotification('Failed to save medicine', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await medicineService.deleteMedicine(id);
      addNotification('Medicine removed from inventory', 'info');
      setMedicines((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error('Failed to delete medicine:', err);
      addNotification('Failed to delete medicine', 'error');
    }
  };

  const filteredMedicines = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Pill className="w-6 h-6 text-teal-600" />
            Medicine Inventory & Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track active dosages, refill stocks, and timing instructions
          </p>
        </div>

        <button
          onClick={() => {
            setEditingMedicine(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medicine
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter medicines by name..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-teal-600"
        />
      </div>

      {loading ? (
        <LoadingSpinner size="large" message="Loading medicine inventory..." />
      ) : filteredMedicines.length === 0 ? (
        <div className="p-12 text-center med-card bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
          No medicines found. Click "Add Medicine" or upload a prescription to extract items automatically!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMedicines.map((med) => (
            <MedicineCard
              key={med._id}
              medicine={med}
              onDelete={handleDelete}
              onEdit={(m) => {
                setEditingMedicine(m);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <MedicineFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingMedicine}
      />
    </div>
  );
};

export default Medicines;
