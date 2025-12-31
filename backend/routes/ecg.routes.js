import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import ECG from '../models/ECG.js';
import { authenticate, authorize, authorizePatientOrSelf } from '../middleware/auth.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/ecg'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.dat', '.hea'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only .dat and .hea files are allowed'));
    }
  },
});

const router = express.Router();

// Get all ECG records
router.get('/', authenticate, async (req, res) => {
  try {
    const { patientId, doctorId, status, riskLevel } = req.query;
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
    }

    if (status) {
      query.status = status;
    }

    if (riskLevel) {
      query['analysis.riskLevel'] = riskLevel;
    }

    const ecgs = await ECG.find(query)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialty')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ ecgs });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get single ECG record
router.get('/:id', authenticate, async (req, res) => {
  try {
    const ecg = await ECG.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialty')
      .populate('reviewedBy', 'name');

    if (!ecg) {
      return res.status(404).json({ message: 'ECG record not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && ecg.patientId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ ecg });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Upload and analyze ECG
router.post('/analyze', authenticate, authorize('doctor', 'admin'), upload.fields([
  { name: 'dat_file', maxCount: 1 },
  { name: 'hea_file', maxCount: 1 }
]), async (req, res) => {
  try {
    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    if (!req.files || !req.files.dat_file || !req.files.hea_file) {
      return res.status(400).json({ message: 'Both .dat and .hea files are required' });
    }

    // Check authorization
    if (req.user.role === 'patient' && req.user._id.toString() !== patientId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const datFile = req.files.dat_file[0].path;
    const heaFile = req.files.hea_file[0].path;

    // TODO: Implement actual ECG analysis logic here
    // For now, we'll create a mock analysis
    const mockAnalysis = {
      rhythm: 'normal',
      interpretation: 'Normal sinus rhythm detected',
      findings: ['Regular rhythm', 'Normal QRS complex'],
      riskLevel: 'low',
      aiConfidence: 95,
    };

    const ecg = await ECG.create({
      patientId,
      doctorId: req.user.role === 'doctor' ? req.user._id : undefined,
      datFile,
      heaFile,
      analysis: mockAnalysis,
      status: 'analyzed',
    });

    const populatedEcg = await ECG.findById(ecg._id)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialty');

    res.status(201).json({
      message: 'ECG analyzed successfully',
      ecg: populatedEcg,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update ECG analysis (doctor review)
router.put('/:id/review', authenticate, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const { analysis, notes } = req.body;

    const ecg = await ECG.findById(req.params.id);

    if (!ecg) {
      return res.status(404).json({ message: 'ECG record not found' });
    }

    if (analysis) {
      ecg.analysis = { ...ecg.analysis, ...analysis };
    }

    if (notes) {
      ecg.notes = notes;
    }

    ecg.status = 'reviewed';
    ecg.reviewedBy = req.user._id;
    ecg.reviewedAt = new Date();

    await ecg.save();

    const populatedEcg = await ECG.findById(ecg._id)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialty')
      .populate('reviewedBy', 'name');

    res.json({
      message: 'ECG review updated successfully',
      ecg: populatedEcg,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get critical ECG alerts
router.get('/alerts/critical', authenticate, authorize('doctor', 'nurse', 'admin'), async (req, res) => {
  try {
    const criticalEcgs = await ECG.find({
      'analysis.riskLevel': { $in: ['high', 'critical'] }
    })
      .populate('patientId', 'name email contactNo')
      .populate('doctorId', 'name specialty')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ alerts: criticalEcgs });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Delete ECG record (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const ecg = await ECG.findByIdAndDelete(req.params.id);

    if (!ecg) {
      return res.status(404).json({ message: 'ECG record not found' });
    }

    res.json({ message: 'ECG record deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

export default router;

