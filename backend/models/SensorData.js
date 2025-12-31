import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  heartRate: {
    type: Number,
    min: 0,
    max: 300,
  },
  temperature: {
    type: Number,
    min: 0,
    max: 120,
  },
  oxygenSaturation: {
    type: Number,
    min: 0,
    max: 100,
  },
  bloodPressure: {
    systolic: {
      type: Number,
      min: 0,
    },
    diastolic: {
      type: Number,
      min: 0,
    },
  },
  // Additional sensor readings
  receivedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  deviceId: {
    type: String,
    trim: true,
  },
  isCritical: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
sensorDataSchema.index({ patientId: 1, receivedAt: -1 });
sensorDataSchema.index({ receivedAt: -1 });

const SensorData = mongoose.model('SensorData', sensorDataSchema);

export default SensorData;

