import ChatHistory from '../models/ChatHistory.js';
import Prescription from '../models/Prescription.js';
import { chatAboutPrescription } from '../services/aiService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';

/**
 * Helper to check valid Mongo ObjectId
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get chat history for a specific prescription
// @route   GET /api/prescriptions/:id/chat
// @access  Private
export const getChatHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user._id : 'usr_demo';

    if (isValidObjectId(id)) {
      const prescription = await Prescription.findById(id);
      if (!prescription) {
        return errorResponse(res, 404, 'Prescription not found');
      }

      // Ownership security check
      if (req.user && prescription.user.toString() !== req.user._id.toString()) {
        return errorResponse(res, 403, 'Forbidden: You do not have permission to view this prescription chat');
      }

      const chatDoc = await ChatHistory.findOne({ user: userId, prescription: id });
      return successResponse(res, 200, 'Chat history retrieved', chatDoc ? chatDoc.messages : []);
    }

    // Demo Mode fallback for non-Mongo IDs
    return successResponse(res, 200, 'Chat history retrieved (Demo)', []);
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message to AI Chat Assistant for a prescription
// @route   POST /api/prescriptions/:id/chat
// @access  Private
export const sendChatMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user ? req.user._id : 'usr_demo';

    if (!message || !message.trim()) {
      return errorResponse(res, 400, 'Message text is required');
    }

    let prescriptionContext = {
      title: 'Medical Prescription',
      doctorName: 'Not specified',
      hospitalName: 'Not specified',
      extractedText: '',
      simpleSummary: 'General health prescription',
      medicines: [],
    };

    if (isValidObjectId(id)) {
      const prescription = await Prescription.findById(id);
      if (!prescription) {
        return errorResponse(res, 404, 'Prescription not found');
      }

      // Ownership security check
      if (req.user && prescription.user.toString() !== req.user._id.toString()) {
        return errorResponse(res, 403, 'Forbidden: You do not have permission to access this prescription chat');
      }

      prescriptionContext = {
        title: prescription.title || 'Medical Prescription',
        doctorName: prescription.doctorName || 'Not specified',
        hospitalName: prescription.hospitalName || 'Not specified',
        extractedText: prescription.extractedText || '',
        simpleSummary: prescription.aiSummary?.simpleSummary || '',
        medicines: prescription.aiSummary?.medicines || [],
      };
    }

    // Get existing chat messages to pass history context to AI
    let chatDoc = null;
    let existingMessages = [];

    if (isValidObjectId(id) && isValidObjectId(userId)) {
      chatDoc = await ChatHistory.findOne({ user: userId, prescription: id });
      if (chatDoc) {
        existingMessages = chatDoc.messages || [];
      }
    }

    // Generate AI response
    console.log(`[Chat Assistant] Processing message for prescription ${id}: "${message}"`);
    const aiAnswer = await chatAboutPrescription(prescriptionContext, message.trim(), existingMessages);

    const userMessageObj = { role: 'user', content: message.trim(), timestamp: new Date() };
    const assistantMessageObj = { role: 'assistant', content: aiAnswer, timestamp: new Date() };

    // Update MongoDB ChatHistory document with upsert
    if (isValidObjectId(id) && isValidObjectId(userId)) {
      if (!chatDoc) {
        chatDoc = new ChatHistory({
          user: userId,
          prescription: id,
          messages: [userMessageObj, assistantMessageObj],
        });
      } else {
        chatDoc.messages.push(userMessageObj, assistantMessageObj);
        // Truncate to retain only the latest 30 messages
        if (chatDoc.messages.length > 30) {
          chatDoc.messages = chatDoc.messages.slice(-30);
        }
      }
      await chatDoc.save();
    }

    return successResponse(res, 200, 'AI response generated successfully', {
      answer: aiAnswer,
      messages: chatDoc ? chatDoc.messages : [userMessageObj, assistantMessageObj],
    });
  } catch (error) {
    next(error);
  }
};
