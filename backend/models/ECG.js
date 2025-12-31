import mongoose from 'mongoose';

const ecgSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // File paths
  datFile: {
    type: String,
    required: true,
  },
  heaFile: {
    type: String,
    required: true,
  },
  // Analysis results
  analysis: {
    rhythm: {
      type: String,
      enum: ['normal', 'atrial_fibrillation', 'atrial_flutter', 'ventricular_tachycardia', 'bradycardia', 'tachycardia', 'other'],
    },
    interpretation: {
      type: String,
      trim: true,
    },
    findings: [{
      type: String,
      trim: true,
    }],
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low',
    },
    aiConfidence: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  // ECG parameters
  heartRate: {
    type: Number,
  },
  prInterval: {
    type: Number,
  },
  qrsDuration: {
    type: Number,
  },
  qtInterval: {
    type: Number,
  },
  // Status
  status: {
    type: String,
    enum: ['pending', 'analyzed', 'reviewed'],
    default: 'pending',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: {
    type: Date,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Indexes
ecgSchema.index({ patientId: 1, createdAt: -1 });
ecgSchema.index({ doctorId: 1 });
ecgSchema.index({ 'analysis.riskLevel': 1 });

const ECG = mongoose.model('ECG', ecgSchema);

export default ECG;

