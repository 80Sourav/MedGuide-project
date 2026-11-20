import mongoose from 'mongoose';

const medicalHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One medical history profile per user
    },
    conditions: {
      type: [String],
      default: [], // e.g. ["Hypertension", "Type 2 Diabetes"]
    },
    allergies: {
      type: [String],
      default: [], // e.g. ["Penicillin", "Peanuts"]
    },
    pastSurgeries: {
      type: [String],
      default: [], // e.g. ["Appendectomy (2020)"]
    },
    vaccinations: {
      type: [String],
      default: [], // e.g. ["COVID-19 Booster", "Tetanus (2023)"]
    },
    bloodGroup: {
      type: String,
      default: 'Not specified',
    },
    emergencyContact: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const MedicalHistory = mongoose.model('MedicalHistory', medicalHistorySchema);
export default MedicalHistory;
