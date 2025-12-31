import express from 'express';
import SensorData from '../models/SensorData.js';
import { authenticate, authorize, authorizePatientOrSelf } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all sensor data (with optional patient filter)
router.get('/', authenticate, async (req, res) => {
  try {
    const { patientId, limit = 100, startDate, endDate } = req.query;
    const query = {};

    // If patientId is provided, filter by it
    if (patientId) {
      // Check authorization
      if (req.user.role === 'patient' && req.user._id.toString() !== patientId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      query.patientId = patientId;
    } else if (req.user.role === 'patient') {
      // Patients can only see their own data
      query.patientId = req.user._id;
    }

    // Date range filter
    if (startDate || endDate) {
      query.receivedAt = {};
      if (startDate) query.receivedAt.$gte = new Date(startDate);
      if (endDate) query.receivedAt.$lte = new Date(endDate);
    }

    const data = await SensorData.find(query)
      .populate('patientId', 'name email')
      .sort({ receivedAt: -1 })
      .limit(parseInt(limit));

    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get latest sensor data for a patient
router.get('/latest/:patientId', authenticate, authorizePatientOrSelf, async (req, res) => {
  try {
    const data = await SensorData.findOne({ patientId: req.params.patientId })
      .populate('patientId', 'name email')
      .sort({ receivedAt: -1 });

    if (!data) {
      return res.status(404).json({ message: 'No sensor data found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Create new sensor data
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      patientId,
      heartRate,
      temperature,
      oxygenSaturation,
      bloodPressure,
      deviceId,
      notes,
    } = req.body;

    // If patientId is provided, check authorization
    if (patientId && req.user.role === 'patient' && req.user._id.toString() !== patientId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Use authenticated user's ID if patientId not provided and user is patient
    const finalPatientId = patientId || (req.user.role === 'patient' ? req.user._id : null);

    if (!finalPatientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    // Determine if data is critical
    const isCritical = 
      (heartRate && (heartRate < 60 || heartRate > 100)) ||
      (temperature && (temperature < 95 || temperature > 104)) ||
      (oxygenSaturation && oxygenSaturation < 90);

    const sensorData = await SensorData.create({
      patientId: finalPatientId,
      heartRate,
      temperature,
      oxygenSaturation,
      bloodPressure,
      deviceId,
      notes,
      isCritical,
      receivedAt: new Date(),
    });

    const populatedData = await SensorData.findById(sensorData._id)
      .populate('patientId', 'name email');

    res.status(201).json({
      message: 'Sensor data created successfully',
      data: populatedData,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get critical alerts
router.get('/alerts/critical', authenticate, authorize('doctor', 'nurse', 'admin'), async (req, res) => {
  try {
    const criticalData = await SensorData.find({ isCritical: true })
      .populate('patientId', 'name email contactNo')
      .sort({ receivedAt: -1 })
      .limit(50);

    res.json({ alerts: criticalData });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Delete sensor data (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const data = await SensorData.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({ message: 'Sensor data not found' });
    }

    res.json({ message: 'Sensor data deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

export default router;

