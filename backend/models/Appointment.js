import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  specialty: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 30, // minutes
  },
  type: {
    type: String,
    enum: ['In-Person', 'Video Call', 'Phone Call'],
    required: true,
  },
  location: {
    type: String,
    trim: true,
  },
  reason: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending',
  },
  notes: {
    type: String,
    trim: true,
  },
  cancelledAt: {
    type: Date,
  },
  cancellationReason: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Indexes
appointmentSchema.index({ patientId: 1, date: -1 });
appointmentSchema.index({ doctorId: 1, date: -1 });
appointmentSchema.index({ status: 1, date: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;

