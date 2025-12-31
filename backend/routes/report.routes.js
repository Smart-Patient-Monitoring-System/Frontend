import express from 'express';
import Report from '../models/Report.js';
import { authenticate, authorize, authorizePatientOrSelf } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all reports
router.get('/', authenticate, async (req, res) => {
  try {
    const { patientId, type, isCritical } = req.query;
    const query = {};

    if (patientId) {
      if (req.user.role === 'patient' && req.user._id.toString() !== patientId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      query.patientId = patientId;
    } else if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    }

    if (type) {
      query.type = type;
    }

    if (isCritical !== undefined) {
      query.isCritical = isCritical === 'true';
    }

    const reports = await Report.find(query)
      .populate('patientId', 'name email')
      .populate('createdBy', 'name specialty')
      .sort({ createdAt: -1 });

    res.json({ reports });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get single report
router.get('/:id', authenticate, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate('createdBy', 'name specialty');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && 
        report.patientId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ report });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Create new report (doctor/nurse/admin only)
router.post('/', authenticate, authorize('doctor', 'nurse', 'admin'), async (req, res) => {
  try {
    const {
      patientId,
      type,
      title,
      description,
      fileUrl,
      findings,
      recommendations,
      isCritical,
    } = req.body;

    if (!patientId || !type || !title) {
      return res.status(400).json({ 
        message: 'Please provide patientId, type, and title' 
      });
    }

    const report = await Report.create({
      patientId,
      createdBy: req.user._id,
      type,
      title,
      description,
      fileUrl,
      findings,
      recommendations,
      isCritical: isCritical || false,
    });

    const populatedReport = await Report.findById(report._id)
      .populate('patientId', 'name email')
      .populate('createdBy', 'name specialty');

    res.status(201).json({
      message: 'Report created successfully',
      report: populatedReport,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update report
router.put('/:id', authenticate, authorize('doctor', 'nurse', 'admin'), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    Object.assign(report, req.body);
    await report.save();

    const populatedReport = await Report.findById(report._id)
      .populate('patientId', 'name email')
      .populate('createdBy', 'name specialty');

    res.json({
      message: 'Report updated successfully',
      report: populatedReport,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Delete report (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

export default router;

