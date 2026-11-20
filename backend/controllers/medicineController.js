import Medicine from '../models/Medicine.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

let mockMedicines = [
  {
    _id: 'med_1',
    user: 'usr_demo',
    name: 'Amoxicillin',
    dosage: '500mg',
    frequency: '3 times daily',
    timing: 'After meals',
    duration: '7 days',
    purpose: 'Antibiotic for bacterial infection',
    refillStock: 21,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'med_2',
    user: 'usr_demo',
    name: 'Paracetamol',
    dosage: '650mg',
    frequency: 'Every 6 hours',
    timing: 'With water',
    duration: '5 days',
    purpose: 'Fever and pain relief',
    refillStock: 10,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const getMedicines = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : 'usr_demo';

    if (isValidObjectId(userId)) {
      const medicines = await Medicine.find({ user: userId }).sort({ createdAt: -1 });
      return successResponse(res, 200, 'Medicines list retrieved', medicines);
    }

    return successResponse(res, 200, 'Medicines list retrieved (Demo Mode)', mockMedicines);
  } catch (error) {
    next(error);
  }
};

export const createMedicine = async (req, res, next) => {
  try {
    const { name, dosage, frequency, timing, duration, purpose, refillStock } = req.body;
    const userId = req.user ? req.user._id : 'usr_demo';

    if (!name || !name.trim()) {
      return errorResponse(res, 400, 'Medicine name is required');
    }

    const medicineData = {
      user: userId,
      name: name.trim(),
      dosage: dosage ? dosage.trim() : 'Not specified',
      frequency: frequency ? frequency.trim() : 'Not specified',
      timing: timing ? timing.trim() : 'Not specified',
      duration: duration ? duration.trim() : 'Not specified',
      purpose: purpose ? purpose.trim() : 'Not specified',
      refillStock: refillStock !== undefined ? Number(refillStock) : 30,
      isActive: true,
    };

    if (isValidObjectId(userId)) {
      const medicine = await Medicine.create(medicineData);
      return successResponse(res, 201, 'Medicine added successfully', medicine);
    }

    const mockObj = {
      _id: 'med_' + Date.now(),
      ...medicineData,
      createdAt: new Date().toISOString(),
    };
    mockMedicines.unshift(mockObj);
    return successResponse(res, 201, 'Medicine added (Demo Mode)', mockObj);
  } catch (error) {
    next(error);
  }
};

export const updateMedicine = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isValidObjectId(id)) {
      const medicine = await Medicine.findById(id);
      if (medicine) {
        // Ownership verification
        if (req.user && medicine.user.toString() !== req.user._id.toString()) {
          return errorResponse(res, 403, 'Forbidden: You do not have permission to update this medicine');
        }

        Object.assign(medicine, req.body);
        const updated = await medicine.save();
        return successResponse(res, 200, 'Medicine updated successfully', updated);
      }
    }

    const index = mockMedicines.findIndex((m) => m._id === id);
    if (index !== -1) {
      mockMedicines[index] = { ...mockMedicines[index], ...req.body };
      return successResponse(res, 200, 'Medicine updated (Demo Mode)', mockMedicines[index]);
    }

    return errorResponse(res, 404, 'Medicine not found');
  } catch (error) {
    next(error);
  }
};

export const deleteMedicine = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isValidObjectId(id)) {
      const medicine = await Medicine.findById(id);
      if (medicine) {
        // Ownership verification
        if (req.user && medicine.user.toString() !== req.user._id.toString()) {
          return errorResponse(res, 403, 'Forbidden: You do not have permission to delete this medicine');
        }

        await medicine.deleteOne();
        return successResponse(res, 200, 'Medicine deleted successfully');
      }
    }

    mockMedicines = mockMedicines.filter((m) => m._id !== id);
    return successResponse(res, 200, 'Medicine deleted');
  } catch (error) {
    next(error);
  }
};
