import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import UploadZone from '../components/prescriptions/UploadZone';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNotification } from '../context/NotificationContext';
import * as prescriptionService from '../services/prescriptionService';

const UploadPrescription = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      addNotification('Please select or drop a prescription file first', 'error');
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('prescription', file);
    formData.append('title', title);
    formData.append('doctorName', doctorName);

    try {
      addNotification('Running Tesseract OCR & AI Analysis pipeline...', 'info');
      const result = await prescriptionService.uploadPrescription(formData);
      addNotification('Prescription analyzed & saved successfully!', 'success');
      navigate(`/prescriptions/${result._id}`);
    } catch (err) {
      console.error('Upload Error:', err);
      addNotification(
        err.response?.data?.message || 'Failed to upload and process prescription.',
        'error'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Real OCR & AI Pipeline</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Upload Prescription Document</h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Upload your physician's prescription. MedGuide runs Tesseract OCR to read text and AI to organize medicine names, dosages, and schedules.
        </p>
      </div>

      <div className="med-card p-6 sm:p-8 bg-white border border-slate-200 shadow-xs rounded-2xl space-y-6">
        <UploadZone onFileSelect={(selected) => setFile(selected)} isProcessing={isProcessing} />

        <form onSubmit={handleUpload} className="space-y-4 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Prescription Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. General Health & Antibiotic Prescription"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Doctor Name (Optional)
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="e.g. Dr. Robert Vance"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!file || isProcessing}
            className={`w-full py-3.5 px-6 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center space-x-2 shadow-xs ${
              file && !isProcessing
                ? 'bg-teal-600 hover:bg-teal-700'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <LoadingSpinner size="small" message="Scanning OCR & Analyzing with AI..." />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Process & Save Prescription</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPrescription;
