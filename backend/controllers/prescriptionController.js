import Prescription from '../models/Prescription.js';
import Medicine from '../models/Medicine.js';
import { extractTextFromImage } from '../services/ocrService.js';
import { simplifyMedicalText } from '../services/aiService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Demo fallback store for local testing
let mockPrescriptions = [
  {
    _id: 'presc_101',
    user: 'usr_demo',
    title: 'General Health & Antibiotics Prescription',
    doctorName: 'Dr. Robert Vance, M.D.',
    hospitalName: 'City General Hospital',
    datePrescribed: new Date().toISOString(),
    filePath: 'uploads/sample-prescription.png',
    extractedText: 'Rx:\n1. Amoxicillin 500mg\n2. Paracetamol 650mg',
    aiSummary: {
      simpleSummary: 'Prescription for bacterial infection and fever management.',
      medicines: [
        {
          name: 'Amoxicillin',
          dosage: '500mg',
          frequency: '3 times daily',
          timing: 'After meals',
          duration: '7 days',
          purpose: 'Antibiotic for bacterial infection',
        },
        {
          name: 'Paracetamol',
          dosage: '650mg',
          frequency: 'Every 6 hours',
          timing: 'With water',
          duration: '5 days',
          purpose: 'Fever and pain relief',
        },
      ],
      precautions: ['Finish full course of antibiotics', 'Stay hydrated'],
    },
    status: 'processed',
    aiProcessedAt: new Date(),
    createdAt: new Date().toISOString(),
  },
];

/**
 * Normalize and sanitize medicine objects before saving to MongoDB
 */
const normalizeMedicine = (med, userId, prescriptionId) => {
  return {
    user: userId,
    prescription: prescriptionId,
    name: med && med.name && String(med.name).trim() ? String(med.name).trim() : 'Not specified',
    dosage: med && med.dosage && String(med.dosage).trim() ? String(med.dosage).trim() : 'Not specified',
    frequency:
      med && (med.frequency || med.instructions) && String(med.frequency || med.instructions).trim()
        ? String(med.frequency || med.instructions).trim()
        : 'Not specified',
    timing: med && med.timing && String(med.timing).trim() ? String(med.timing).trim() : 'Not specified',
    duration: med && med.duration && String(med.duration).trim() ? String(med.duration).trim() : 'Not specified',
    purpose: med && med.purpose && String(med.purpose).trim() ? String(med.purpose).trim() : 'Not specified',
  };
};

// @desc    Upload & process prescription file
// @route   POST /api/prescriptions/upload
// @access  Private
export const uploadPrescription = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 400, 'Please upload a prescription image or PDF file');
    }

    const { title, doctorName, hospitalName } = req.body;
    const filePath = req.file.path.replace(/\\/g, '/');

    console.log('[Prescription Pipeline] Step 1: Running Tesseract OCR on uploaded file:', filePath);
    const extractedText = await extractTextFromImage(filePath);

    console.log('[Prescription Pipeline] Step 2: Running Gemini/Groq AI Analysis on extracted text...');
    const aiResult = await simplifyMedicalText(extractedText);

    const userId = req.user ? req.user._id : 'usr_demo';

    const prescriptionData = {
      user: userId,
      title: title && title.trim() ? title.trim() : (aiResult.doctorName !== 'Not specified' ? `Prescription from ${aiResult.doctorName}` : 'Medical Prescription'),
      doctorName: doctorName && doctorName.trim() ? doctorName.trim() : (aiResult.doctorName || 'Not specified'),
      hospitalName: hospitalName && hospitalName.trim() ? hospitalName.trim() : (aiResult.hospitalName || 'Not specified'),
      filePath,
      extractedText,
      aiSummary: aiResult,
      status: 'processed',
      aiProcessedAt: new Date(),
    };

    if (isValidObjectId(userId)) {
      try {
        const newPrescription = await Prescription.create(prescriptionData);

        // Safe Medicine insertion (Insert medicines into MongoDB, handle errors gracefully)
        if (aiResult.medicines && Array.isArray(aiResult.medicines) && aiResult.medicines.length > 0) {
          const medicineDocs = aiResult.medicines.map((med) => normalizeMedicine(med, userId, newPrescription._id));
          try {
            await Medicine.insertMany(medicineDocs);
            console.log(`[Prescription Pipeline] Successfully saved ${medicineDocs.length} medicines to MongoDB`);
          } catch (medErr) {
            console.error('[Prescription Pipeline Warning] Failed to insert medicines into MongoDB:', medErr.message);
          }
        }

        return successResponse(res, 201, 'Prescription uploaded and analyzed successfully', newPrescription);
      } catch (dbErr) {
        console.error('[Prescription Pipeline DB Error]:', dbErr.message);
      }
    }

    // Demo store fallback
    const mockObj = {
      _id: 'presc_' + Date.now(),
      ...prescriptionData,
      createdAt: new Date().toISOString(),
    };
    mockPrescriptions.unshift(mockObj);
    return successResponse(res, 201, 'Prescription uploaded and analyzed (Demo Mode)', mockObj);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all prescriptions for authenticated user
// @route   GET /api/prescriptions
// @access  Private
export const getPrescriptions = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : 'usr_demo';

    if (isValidObjectId(userId)) {
      const prescriptions = await Prescription.find({ user: userId }).sort({ createdAt: -1 });
      return successResponse(res, 200, 'Prescriptions list retrieved', prescriptions);
    }

    return successResponse(res, 200, 'Prescriptions list retrieved (Demo Mode)', mockPrescriptions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private
export const getPrescriptionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isValidObjectId(id)) {
      const prescription = await Prescription.findById(id);

      if (prescription) {
        // Ownership verification
        if (req.user && prescription.user.toString() !== req.user._id.toString()) {
          return errorResponse(res, 403, 'Forbidden: You do not have permission to view this prescription');
        }

        return successResponse(res, 200, 'Prescription details retrieved', prescription);
      }
    }

    const found = mockPrescriptions.find((p) => p._id === id);
    if (found) {
      return successResponse(res, 200, 'Prescription details retrieved (Demo Mode)', found);
    }

    return errorResponse(res, 404, 'Prescription not found');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private
export const deletePrescription = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isValidObjectId(id)) {
      const prescription = await Prescription.findById(id);

      if (prescription) {
        // Ownership verification
        if (req.user && prescription.user.toString() !== req.user._id.toString()) {
          return errorResponse(res, 403, 'Forbidden: You do not have permission to delete this prescription');
        }

        await prescription.deleteOne();
        await Medicine.deleteMany({ prescription: id });

        return successResponse(res, 200, 'Prescription deleted successfully');
      }
    }

    mockPrescriptions = mockPrescriptions.filter((p) => p._id !== id);
    return successResponse(res, 200, 'Prescription deleted');
  } catch (error) {
    next(error);
  }
};