import User from '../models/User.js';
import MedicalHistory from '../models/MedicalHistory.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : 'usr_demo';
    const { name, phone, bloodGroup, allergies, emergencyContact } = req.body;

    if (mongoose.Types.ObjectId.isValid(userId)) {
      const user = await User.findById(userId);

      if (user) {
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (bloodGroup !== undefined) user.bloodGroup = bloodGroup;
        if (allergies !== undefined) user.allergies = Array.isArray(allergies) ? allergies : allergies.split(',').map(a => a.trim()).filter(Boolean);
        if (emergencyContact !== undefined) user.emergencyContact = emergencyContact;

        const updatedUser = await user.save();

        // Also sync to MedicalHistory profile if exists
        await MedicalHistory.findOneAndUpdate(
          { user: userId },
          {
            bloodGroup: updatedUser.bloodGroup,
            emergencyContact: updatedUser.emergencyContact,
            allergies: updatedUser.allergies,
          },
          { upsert: true }
        );

        return successResponse(res, 200, 'Profile updated successfully', {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          bloodGroup: updatedUser.bloodGroup,
          allergies: updatedUser.allergies,
          emergencyContact: updatedUser.emergencyContact,
        });
      }
    }

    // Demo Mode fallback
    return successResponse(res, 200, 'Profile updated successfully (Demo Mode)', {
      _id: userId,
      name: name || 'Demo Patient',
      email: req.user ? req.user.email : 'patient@mediguide.ai',
      phone: phone || '+1 555-0192',
      bloodGroup: bloodGroup || 'O+',
      allergies: allergies || ['Penicillin'],
      emergencyContact: emergencyContact || '+1 555-9988',
    });
  } catch (error) {
    next(error);
  }
};
