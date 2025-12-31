import express from 'express';
import Appointment from '../models/Appointment.js';
import { authenticate, authorize, authorizePatientOrSelf } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all appointments
router.get('/', authenticate, async (req, res) => {
  try {
    const { patientId, doctorId, status, upcoming, past } = req.query;
    const query = {};

    if (patientId) {
      if (req.user.role === 'patient' && req.user._id.toString() !== patientId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      query.patientId = patientId;
    } else if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    }

    if (doctorId) {
      query.doctorId = doctorId;
    } else if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    let appointments = await Appointment.find(query)
      .populate('patientId', 'name email contactNo')
      .populate('doctorId', 'name specialty')
      .sort({ date: -1 });

    // Filter upcoming/past if requested
    const now = new Date();
    if (upcoming === 'true') {
      appointments = appointments.filter(apt => new Date(apt.date) >= now);
    } else if (past === 'true') {
      appointments = appointments.filter(apt => new Date(apt.date) < now);
    }

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get single appointment
router.get('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email contactNo')
      .populate('doctorId', 'name specialty');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && 
        appointment.patientId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'doctor' && 
        appointment.doctorId && 
        appointment.doctorId._id.toString() !== req.user._id.toString()) {
      // Doctors can view appointments even if not assigned, but we'll allow it
    }

    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Create new appointment
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      specialty,
      date,
      time,
      duration,
      type,
      location,
      reason,
    } = req.body;

    // Use authenticated user's ID if patientId not provided and user is patient
    const finalPatientId = patientId || (req.user.role === 'patient' ? req.user._id : null);

    if (!finalPatientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    // Check authorization
    if (req.user.role === 'patient' && req.user._id.toString() !== finalPatientId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!specialty || !date || !time || !type) {
      return res.status(400).json({ 
        message: 'Please provide specialty, date, time, and type' 
      });
    }

    const appointment = await Appointment.create({
      patientId: finalPatientId,
      doctorId,
      specialty,
      date,
      time,
      duration: duration || 30,
      type,
      location,
      reason,
      status: 'pending',
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'name email contactNo')
      .populate('doctorId', 'name specialty');

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: populatedAppointment,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update appointment
router.put('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && 
        appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update appointment
    Object.assign(appointment, req.body);
    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'name email contactNo')
      .populate('doctorId', 'name specialty');

    res.json({
      message: 'Appointment updated successfully',
      appointment: populatedAppointment,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Confirm appointment (doctor/admin)
router.put('/:id/confirm', authenticate, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'confirmed';
    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'name email contactNo')
      .populate('doctorId', 'name specialty');

    res.json({
      message: 'Appointment confirmed',
      appointment: populatedAppointment,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Cancel appointment
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && 
        appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    appointment.status = 'cancelled';
    appointment.cancelledAt = new Date();
    if (cancellationReason) {
      appointment.cancellationReason = cancellationReason;
    }

    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'name email contactNo')
      .populate('doctorId', 'name specialty');

    res.json({
      message: 'Appointment cancelled',
      appointment: populatedAppointment,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Delete appointment (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

export default router;

