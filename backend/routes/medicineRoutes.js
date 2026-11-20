import express from 'express';
import {
  getMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from '../controllers/medicineController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getMedicines)
  .post(protect, createMedicine);

router
  .route('/:id')
  .put(protect, updateMedicine)
  .delete(protect, deleteMedicine);

export default router;
