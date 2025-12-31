import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  prescribedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  dosage: {
    type: String,
    required: true,
    trim: true,
  },
  frequency: {
    type: String,
    required: true,
    trim: true, // e.g., "twice daily", "once a day"
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  instructions: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'discontinued'],
    default: 'active',
  },
  sideEffects: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

// Indexes
medicationSchema.index({ patientId: 1, status: 1 });
medicationSchema.index({ patientId: 1, startDate: -1 });

const Medication = mongoose.model('Medication', medicationSchema);

export default Medication;

