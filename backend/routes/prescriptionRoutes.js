import express from 'express';
import {
  uploadPrescription,
  getPrescriptions,
  getPrescriptionById,
  deletePrescription,
} from '../controllers/prescriptionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import chatRoutes from './chatRoutes.js';

const router = express.Router();

// Mount nested chat routes: /api/prescriptions/:id/chat
router.use('/:id/chat', chatRoutes);

router
  .route('/')
  .get(protect, getPrescriptions);

router
  .route('/upload')
  .post(protect, upload.single('prescription'), uploadPrescription);

router
  .route('/:id')
  .get(protect, getPrescriptionById)
  .delete(protect, deletePrescription);

export default router;
