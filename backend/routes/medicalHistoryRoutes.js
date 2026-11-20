import express from 'express';
import { getMedicalHistory, updateMedicalHistory } from '../controllers/medicalHistoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getMedicalHistory)
  .put(protect, updateMedicalHistory);

export default router;
