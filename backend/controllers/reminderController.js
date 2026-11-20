import Reminder from '../models/Reminder.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

let mockReminders = [
  {
    _id: 'rem_1',
    user: 'usr_demo',
    title: 'Morning Amoxicillin Dosage',
    type: 'medicine',
    time: '08:00 AM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    isActive: true,
  },
  {
    _id: 'rem_2',
    user: 'usr_demo',
    title: 'Afternoon Paracetamol Check',
    type: 'medicine',
    time: '02:00 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    isActive: true,
  },
];

export const getReminders = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : 'usr_demo';

    if (isValidObjectId(userId)) {
      const reminders = await Reminder.find({ user: userId }).sort({ createdAt: -1 });
      return successResponse(res, 200, 'Reminders list retrieved', reminders);
    }

    return successResponse(res, 200, 'Reminders list retrieved (Demo Mode)', mockReminders);
  } catch (error) {
    next(error);
  }
};

export const createReminder = async (req, res, next) => {
  try {
    const { title, type, time, days } = req.body;
    const userId = req.user ? req.user._id : 'usr_demo';

    if (!title || !time) {
      return errorResponse(res, 400, 'Title and time are required for a reminder');
    }

    const reminderData = {
      user: userId,
      title,
      type: type || 'medicine',
      time,
      days: days && days.length > 0 ? days : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      isActive: true,
    };

    if (isValidObjectId(userId)) {
      const reminder = await Reminder.create(reminderData);
      return successResponse(res, 201, 'Reminder created successfully', reminder);
    }

    const mockObj = {
      _id: 'rem_' + Date.now(),
      ...reminderData,
      createdAt: new Date().toISOString(),
    };
    mockReminders.unshift(mockObj);
    return successResponse(res, 201, 'Reminder created (Demo Mode)', mockObj);
  } catch (error) {
    next(error);
  }
};

export const updateReminder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isValidObjectId(id)) {
      const reminder = await Reminder.findById(id);
      if (reminder) {
        // Ownership verification
        if (req.user && reminder.user.toString() !== req.user._id.toString()) {
          return errorResponse(res, 403, 'Forbidden: You do not have permission to update this reminder');
        }

        Object.assign(reminder, req.body);
        const updated = await reminder.save();
        return successResponse(res, 200, 'Reminder updated successfully', updated);
      }
    }

    const index = mockReminders.findIndex((r) => r._id === id);
    if (index !== -1) {
      mockReminders[index] = { ...mockReminders[index], ...req.body };
      return successResponse(res, 200, 'Reminder updated (Demo Mode)', mockReminders[index]);
    }

    return errorResponse(res, 404, 'Reminder not found');
  } catch (error) {
    next(error);
  }
};

export const deleteReminder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isValidObjectId(id)) {
      const reminder = await Reminder.findById(id);
      if (reminder) {
        // Ownership verification
        if (req.user && reminder.user.toString() !== req.user._id.toString()) {
          return errorResponse(res, 403, 'Forbidden: You do not have permission to delete this reminder');
        }

        await reminder.deleteOne();
        return successResponse(res, 200, 'Reminder deleted successfully');
      }
    }

    mockReminders = mockReminders.filter((r) => r._id !== id);
    return successResponse(res, 200, 'Reminder deleted');
  } catch (error) {
    next(error);
  }
};
