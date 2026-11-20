import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true,
      default: 'Not specified',
    },
    dosage: {
      type: String,
      default: 'Not specified',
    },
    frequency: {
      type: String,
      default: 'Not specified',
    },
    timing: {
      type: String,
      default: 'Not specified',
    },
    duration: {
      type: String,
      default: 'Not specified',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    purpose: {
      type: String,
      default: 'Not specified',
    },
    refillStock: {
      type: Number,
      default: 30,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;
