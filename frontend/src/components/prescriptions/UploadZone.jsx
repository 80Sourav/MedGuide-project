import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

const UploadZone = ({ onFileSelect, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
        dragActive
          ? 'border-teal-600 bg-teal-50 scale-[1.01]'
          : 'border-slate-300 hover:border-teal-500 bg-slate-50/70'
      }`}
    >
      <input
        type="file"
        id="file-upload"
        accept="image/*,.pdf"
        onChange={handleChange}
        disabled={isProcessing}
        className="hidden"
      />
      <label htmlFor="file-upload" className="cursor-pointer block space-y-4">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 shadow-2xs">
          <UploadCloud className="w-8 h-8" />
        </div>

        <div>
          <p className="text-base font-bold text-slate-900">
            {selectedFile ? selectedFile.name : 'Drag & Drop prescription file here'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Upload clear PNG, JPG, JPEG, WEBP or PDF prescription document
          </p>
        </div>

        {!selectedFile && (
          <span className="inline-block px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors">
            Browse Document
          </span>
        )}

        {selectedFile && (
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200">
            <CheckCircle2 className="w-4 h-4 text-teal-700" />
            <span>File ready for Tesseract OCR scan</span>
          </div>
        )}
      </label>
    </div>
  );
};

export default UploadZone;
