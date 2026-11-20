import React, { useState, useEffect } from 'react';
import { ClipboardList, ShieldAlert, Heart, Activity, Plus, X, Save, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNotification } from '../context/NotificationContext';
import * as medicalHistoryService from '../services/medicalHistoryService';

const MedicalHistory = () => {
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [conditions, setConditions] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [pastSurgeries, setPastSurgeries] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [notes, setNotes] = useState('');

  // Inputs for adding tags
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newSurgery, setNewSurgery] = useState('');
  const [newVaccine, setNewVaccine] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await medicalHistoryService.getMedicalHistory();
        if (data) {
          setConditions(data.conditions || []);
          setAllergies(data.allergies || []);
          setPastSurgeries(data.pastSurgeries || []);
          setVaccinations(data.vaccinations || []);
          setBloodGroup(data.bloodGroup || 'O+');
          setEmergencyContact(data.emergencyContact || '');
          setNotes(data.notes || '');
        }
      } catch (err) {
        console.error('Failed to load medical history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await medicalHistoryService.updateMedicalHistory({
        conditions,
        allergies,
        pastSurgeries,
        vaccinations,
        bloodGroup,
        emergencyContact,
        notes,
      });
      addNotification('Medical history updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to save medical history:', err);
      addNotification('Failed to update medical history', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addTag = (list, setList, val, setVal) => {
    if (!val || !val.trim()) return;
    if (!list.includes(val.trim())) {
      setList([...list, val.trim()]);
    }
    setVal('');
  };

  const removeTag = (list, setList, idx) => {
    setList(list.filter((_, i) => i !== idx));
  };

  if (loading) {
    return <LoadingSpinner size="large" message="Loading medical history profile..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-teal-600" />
          Patient Medical History
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Maintain an up-to-date record of your conditions, allergies, surgeries, and vaccinations
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Health Vitals */}
        <div className="med-card p-6 bg-white border border-slate-200 shadow-xs rounded-2xl space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" /> Vitals & Emergency
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:border-teal-600"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="Not specified">Not specified</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Emergency Contact Phone
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="+1 555-0199"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>
        </div>

        {/* Chronic Conditions */}
        <div className="med-card p-6 bg-white border border-slate-200 shadow-xs rounded-2xl space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" /> Chronic Medical Conditions
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="Add condition (e.g. Hypertension, Type 2 Diabetes)"
              className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-teal-600"
            />
            <button
              type="button"
              onClick={() => addTag(conditions, setConditions, newCondition, setNewCondition)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {conditions.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No chronic conditions listed.</span>
            ) : (
              conditions.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeTag(conditions, setConditions, i)}
                    className="ml-2 text-rose-500 hover:text-rose-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Known Allergies */}
        <div className="med-card p-6 bg-white border border-slate-200 shadow-xs rounded-2xl space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" /> Known Allergies & Sensitivities
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              placeholder="Add allergy (e.g. Penicillin, Peanuts, Aspirin)"
              className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-teal-600"
            />
            <button
              type="button"
              onClick={() => addTag(allergies, setAllergies, newAllergy, setNewAllergy)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {allergies.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No allergies listed.</span>
            ) : (
              allergies.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeTag(allergies, setAllergies, i)}
                    className="ml-2 text-amber-600 hover:text-amber-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Past Surgeries & Vaccinations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="med-card p-6 bg-white border border-slate-200 shadow-xs rounded-2xl space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Past Surgeries & Procedures</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSurgery}
                onChange={(e) => setNewSurgery(e.target.value)}
                placeholder="e.g. Appendectomy (2020)"
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-teal-600"
              />
              <button
                type="button"
                onClick={() => addTag(pastSurgeries, setPastSurgeries, newSurgery, setNewSurgery)}
                className="px-3 py-1.5 bg-teal-600 text-white rounded-xl font-bold text-xs"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {pastSurgeries.map((item, i) => (
                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                  {item}
                  <button type="button" onClick={() => removeTag(pastSurgeries, setPastSurgeries, i)} className="ml-1.5 text-slate-400 hover:text-slate-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="med-card p-6 bg-white border border-slate-200 shadow-xs rounded-2xl space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Immunizations & Vaccinations</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newVaccine}
                onChange={(e) => setNewVaccine(e.target.value)}
                placeholder="e.g. Tetanus Booster (2024)"
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-teal-600"
              />
              <button
                type="button"
                onClick={() => addTag(vaccinations, setVaccinations, newVaccine, setNewVaccine)}
                className="px-3 py-1.5 bg-teal-600 text-white rounded-xl font-bold text-xs"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {vaccinations.map((item, i) => (
                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200">
                  {item}
                  <button type="button" onClick={() => removeTag(vaccinations, setVaccinations, i)} className="ml-1.5 text-teal-600 hover:text-teal-800">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Doctor Notes */}
        <div className="med-card p-6 bg-white border border-slate-200 shadow-xs rounded-2xl space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Additional Patient & Doctor Notes
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Specify any relevant health notes or physician preferences..."
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-teal-600"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center space-x-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Medical History...' : 'Save Medical History'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicalHistory;
