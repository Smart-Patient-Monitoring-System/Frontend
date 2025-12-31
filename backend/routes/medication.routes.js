import express from 'express';
import Medication from '../models/Medication.js';
import { authenticate, authorize, authorizePatientOrSelf } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all medications
router.get('/', authenticate, async (req, res) => {
  try {
    const { patientId, status } = req.query;
    const query = {};

    if (patientId) {
      if (req.user.role === 'patient' && req.user._id.toString() !== patientId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      query.patientId = patientId;
    } else if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    const medications = await Medication.find(query)
      .populate('patientId', 'name email')
      .populate('prescribedBy', 'name specialty')
      .sort({ startDate: -1 });

    res.json({ medications });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get single medication
router.get('/:id', authenticate, async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate('prescribedBy', 'name specialty');

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && 
        medication.patientId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ medication });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Create new medication (doctor/nurse/admin only)
router.post('/', authenticate, authorize('doctor', 'nurse', 'admin'), async (req, res) => {
  try {
    const {
      patientId,
      name,
      dosage,
      frequency,
      startDate,
      endDate,
      instructions,
    } = req.body;

    if (!patientId || !name || !dosage || !frequency || !startDate) {
      return res.status(400).json({ 
        message: 'Please provide patientId, name, dosage, frequency, and startDate' 
      });
    }

    const medication = await Medication.create({
      patientId,
      prescribedBy: req.user._id,
      name,
      dosage,
      frequency,
      startDate,
      endDate,
      instructions,
      status: 'active',
    });

    const populatedMedication = await Medication.findById(medication._id)
      .populate('patientId', 'name email')
      .populate('prescribedBy', 'name specialty');

    res.status(201).json({
      message: 'Medication prescribed successfully',
      medication: populatedMedication,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update medication
router.put('/:id', authenticate, authorize('doctor', 'nurse', 'admin'), async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    Object.assign(medication, req.body);
    await medication.save();

    const populatedMedication = await Medication.findById(medication._id)
      .populate('patientId', 'name email')
      .populate('prescribedBy', 'name specialty');

    res.json({
      message: 'Medication updated successfully',
      medication: populatedMedication,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Discontinue medication
router.put('/:id/discontinue', authenticate, authorize('doctor', 'nurse', 'admin'), async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    medication.status = 'discontinued';
    await medication.save();

    res.json({
      message: 'Medication discontinued',
      medication,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Delete medication (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const medication = await Medication.findByIdAndDelete(req.params.id);

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    res.json({ message: 'Medication deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

export default router;

