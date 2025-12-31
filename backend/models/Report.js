import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['lab', 'imaging', 'diagnostic', 'summary', 'other'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  fileUrl: {
    type: String,
  },
  findings: {
    type: String,
    trim: true,
  },
  recommendations: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isCritical: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes
reportSchema.index({ patientId: 1, createdAt: -1 });
reportSchema.index({ type: 1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;

