import MedicalHistory from '../models/MedicalHistory.js';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';

// @desc    Get user medical history
// @route   GET /api/medical-history
// @access  Private
export const getMedicalHistory = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : 'usr_demo';

    if (mongoose.Types.ObjectId.isValid(userId)) {
      let history = await MedicalHistory.findOne({ user: userId });
      if (!history) {
        // Create initial empty medical history document if missing
        history = await MedicalHistory.create({
          user: userId,
          conditions: [],
          allergies: req.user.allergies || [],
          pastSurgeries: [],
          vaccinations: [],
          bloodGroup: req.user.bloodGroup || 'Not specified',
          emergencyContact: req.user.emergencyContact || '',
          notes: '',
        });
      }
      return successResponse(res, 200, 'Medical history retrieved', history);
    }

    // Demo Mode fallback
    return successResponse(res, 200, 'Medical history retrieved (Demo Mode)', {
      _id: 'med_hist_demo',
      user: 'usr_demo',
      conditions: ['Hypertension', 'Mild Asthma'],
      allergies: ['Penicillin'],
      pastSurgeries: ['Appendectomy (2021)'],
      vaccinations: ['COVID-19 Vaccine (2 Doses)', 'Flu Shot (2025)'],
      bloodGroup: 'O+',
      emergencyContact: '+1 555-0199',
      notes: 'Patient prefers generic medication when available.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user medical history
// @route   PUT /api/medical-history
// @access  Private
export const updateMedicalHistory = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : 'usr_demo';
    const { conditions, allergies, pastSurgeries, vaccinations, bloodGroup, emergencyContact, notes } = req.body;

    if (mongoose.Types.ObjectId.isValid(userId)) {
      let history = await MedicalHistory.findOne({ user: userId });

      if (!history) {
        history = new MedicalHistory({ user: userId });
      }

      if (conditions !== undefined) history.conditions = Array.isArray(conditions) ? conditions : [];
      if (allergies !== undefined) history.allergies = Array.isArray(allergies) ? allergies : [];
      if (pastSurgeries !== undefined) history.pastSurgeries = Array.isArray(pastSurgeries) ? pastSurgeries : [];
      if (vaccinations !== undefined) history.vaccinations = Array.isArray(vaccinations) ? vaccinations : [];
      if (bloodGroup !== undefined) history.bloodGroup = bloodGroup;
      if (emergencyContact !== undefined) history.emergencyContact = emergencyContact;
      if (notes !== undefined) history.notes = notes;

      const updated = await history.save();

      // Sync bloodGroup and emergencyContact back to User model as well
      await User.findByIdAndUpdate(userId, {
        bloodGroup: history.bloodGroup,
        emergencyContact: history.emergencyContact,
        allergies: history.allergies,
      });

      return successResponse(res, 200, 'Medical history updated successfully', updated);
    }

    return successResponse(res, 200, 'Medical history updated (Demo Mode)', {
      _id: 'med_hist_demo',
      user: 'usr_demo',
      conditions: conditions || ['Hypertension'],
      allergies: allergies || ['Penicillin'],
      pastSurgeries: pastSurgeries || ['Appendectomy (2021)'],
      vaccinations: vaccinations || ['COVID-19 Vaccine'],
      bloodGroup: bloodGroup || 'O+',
      emergencyContact: emergencyContact || '+1 555-0199',
      notes: notes || '',
    });
  } catch (error) {
    next(error);
  }
};
