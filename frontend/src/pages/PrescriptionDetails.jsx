import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Pill,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  UserCheck,
  Building2,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PrescriptionChat from '../components/prescriptions/PrescriptionChat';
import { useNotification } from '../context/NotificationContext';
import { formatDate } from '../utils/formatDate';
import * as prescriptionService from '../services/prescriptionService';

const PrescriptionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await prescriptionService.getPrescriptionById(id);
        setPrescription(data);
      } catch (err) {
        console.error('Failed to load prescription details', err);
        addNotification('Failed to load prescription details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;
    setDeleting(true);
    try {
      await prescriptionService.deletePrescription(id);
      addNotification('Prescription deleted successfully', 'success');
      navigate('/');
    } catch (err) {
      console.error('Failed to delete prescription', err);
      addNotification('Failed to delete prescription', 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" message="Fetching prescription breakdown..." />;
  }

  if (!prescription) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-500 font-medium">Prescription not found or access denied.</p>
        <Link to="/" className="text-teal-700 font-bold hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const ai = prescription.aiSummary || {};
  const medicines = ai.medicines || [];

  // Determine image preview URL
  const backendBaseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:5000';
    
  const imageUrl = prescription.filePath
    ? prescription.filePath.startsWith('http')
      ? prescription.filePath
      : `${backendBaseUrl}/${prescription.filePath}`
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          {deleting ? 'Deleting...' : 'Delete Prescription'}
        </button>
      </div>

      {/* Header Info */}
      <div className="med-card p-6 sm:p-8 bg-white border border-slate-200 shadow-xs rounded-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 shadow-2xs">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{prescription.title || 'Medical Prescription'}</h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                <span className="flex items-center gap-1 text-slate-700">
                  <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                  Dr: {prescription.doctorName || 'Not specified'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {prescription.hospitalName || 'Not specified'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatDate(prescription.datePrescribed || prescription.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
            AI Analyzed
          </span>
        </div>

        {/* Prescription Image Preview (If available) */}
        {imageUrl && (
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 p-4 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
              <ImageIcon className="w-4 h-4 text-teal-600" />
              <span>Uploaded Prescription Image</span>
            </div>
            <div className="max-h-64 overflow-hidden rounded-xl border border-slate-200 bg-white flex justify-center">
              <img
                src={imageUrl}
                alt="Prescription Document"
                className="object-contain max-h-60 w-auto hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* AI Simple Explanation */}
        <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2">
          <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-700" />
            MedGuide AI Summary
          </h3>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            {ai.simpleSummary || 'Prescription processed. Review medicine breakdown below.'}
          </p>
        </div>
      </div>

      {/* Extracted Medicines List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Pill className="w-5 h-5 text-teal-600" />
          Extracted Medicines & Dosage Plan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medicines.length > 0 ? (
            medicines.map((med, idx) => (
              <div key={idx} className="med-card p-5 bg-white border border-slate-200 shadow-xs rounded-2xl space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-extrabold text-teal-900">{med.name}</h3>
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-xs font-bold text-teal-800">
                    {med.dosage || 'Not specified'}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <p>
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">Frequency:</span>
                    <span className="font-semibold">{med.frequency || 'Not specified'}</span>
                  </p>
                  <p>
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">Timing:</span>
                    <span className="font-semibold">{med.timing || 'Not specified'}</span>
                  </p>
                  <p>
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">Duration:</span>
                    <span className="font-semibold">{med.duration || 'Not specified'}</span>
                  </p>
                  {med.purpose && (
                    <p className="text-slate-600 italic pt-1.5 border-t border-slate-100">
                      <span className="font-bold not-italic text-slate-500">Purpose: </span>
                      {med.purpose}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 italic col-span-2">No medicines detected in prescription scan.</p>
          )}
        </div>
      </div>

      {/* Precautions */}
      {ai.precautions && ai.precautions.length > 0 && (
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
          <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            Important Precautions & Guidance
          </h3>
          <ul className="space-y-1.5 text-xs text-amber-900 font-medium list-disc list-inside">
            {ai.precautions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Interactive Prescription Chat Assistant */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-600" />
          Ask Questions About This Prescription
        </h2>
        <PrescriptionChat prescriptionId={id} />
      </div>

      {/* Raw Extracted OCR Text Tab */}
      <div className="med-card p-6 bg-white border border-slate-200 shadow-xs rounded-2xl space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Raw OCR Extracted Text
        </h3>
        <pre className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 overflow-x-auto whitespace-pre-wrap max-h-48">
          {prescription.extractedText || 'No raw text extracted.'}
        </pre>
      </div>
    </div>
  );
};

export default PrescriptionDetails;
