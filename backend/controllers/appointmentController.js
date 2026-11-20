import Appointment from '../models/Appointment.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

let mockAppointments = [
  {
    _id: 'app_1',
    user: 'usr_demo',
    doctorName: 'Dr. Sarah Jenkins',
    specialization: 'Cardiologist',
    hospitalLocation: 'St. Jude Heart Institute, Room 302',
    appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    notes: 'Routine ECG checkup and blood pressure review',
    status: 'scheduled',
  },
  {
    _id: 'app_2',
    user: 'usr_demo',
    doctorName: 'Dr. Robert Vance',
    specialization: 'Internal Medicine',
    hospitalLocation: 'City General Hospital',
    appointmentDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    notes: 'Follow-up on antibiotic prescription course',
    status: 'scheduled',
  },
];

export const getAppointments = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : 'usr_demo';

    if (isValidObjectId(userId)) {
      const appointments = await Appointment.find({ user: userId }).sort({ appointmentDate: 1 });
      return successResponse(res, 200, 'Appointments list retrieved', appointments);
    }

    return successResponse(res, 200, 'Appointments list retrieved (Demo Mode)', mockAppointments);
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (req, res, next) => {
  try {
    const { doctorName, specialization, hospitalLocation, appointmentDate, notes } = req.body;
    const userId = req.user ? req.user._id : 'usr_demo';

    if (!doctorName || !appointmentDate) {
      return errorResponse(res, 400, 'Doctor name and appointment date are required');
    }

    const apptData = {
      user: userId,
      doctorName,
      specialization: specialization || 'General Physician',
      hospitalLocation: hospitalLocation || '',
      appointmentDate,
      notes: notes || '',
      status: 'scheduled',
    };

    if (isValidObjectId(userId)) {
      const appt = await Appointment.create(apptData);
      return successResponse(res, 201, 'Appointment scheduled successfully', appt);
    }

    const mockObj = {
      _id: 'app_' + Date.now(),
      ...apptData,
      createdAt: new Date().toISOString(),
    };
    mockAppointments.push(mockObj);
    return successResponse(res, 201, 'Appointment scheduled (Demo Mode)', mockObj);
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isValidObjectId(id)) {
      const appt = await Appointment.findById(id);
      if (appt) {
        // Ownership verification
        if (req.user && appt.user.toString() !== req.user._id.toString()) {
          return errorResponse(res, 403, 'Forbidden: You do not have permission to update this appointment');
        }

        Object.assign(appt, req.body);
        const updated = await appt.save();
        return successResponse(res, 200, 'Appointment updated successfully', updated);
      }
    }

    const index = mockAppointments.findIndex((a) => a._id === id);
    if (index !== -1) {
      mockAppointments[index] = { ...mockAppointments[index], ...req.body };
      return successResponse(res, 200, 'Appointment updated (Demo Mode)', mockAppointments[index]);
    }

    return errorResponse(res, 404, 'Appointment not found');
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isValidObjectId(id)) {
      const appt = await Appointment.findById(id);
      if (appt) {
        // Ownership verification
        if (req.user && appt.user.toString() !== req.user._id.toString()) {
          return errorResponse(res, 403, 'Forbidden: You do not have permission to delete this appointment');
        }

        await appt.deleteOne();
        return successResponse(res, 200, 'Appointment deleted successfully');
      }
    }

    mockAppointments = mockAppointments.filter((a) => a._id !== id);
    return successResponse(res, 200, 'Appointment deleted');
  } catch (error) {
    next(error);
  }
};
