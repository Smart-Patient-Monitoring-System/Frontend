import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      name,
      dateOfBirth,
      address,
      nic,
      gender,
      contactNo,
      guardianName,
      guardianContactNo,
      bloodType,
      specialty,
      licenseNumber,
      department,
    } = req.body;

    // Validation - check for missing, empty, or whitespace-only values
    if (!username || !email || !password || !role ||
        typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string' ||
        username.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0) {
      return res.status(400).json({ 
        message: 'Please provide username, email, password, and role' 
      });
    }

    // Trim whitespace
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: trimmedEmail }, { username: trimmedUsername }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Validate password length
    if (trimmedPassword.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Validate username length
    if (trimmedUsername.length < 3) {
      return res.status(400).json({ 
        message: 'Username must be at least 3 characters long' 
      });
    }

    // Create user
    const userData = {
      username: trimmedUsername,
      email: trimmedEmail,
      password: trimmedPassword,
      role,
    };

    // Add role-specific fields
    if (role === 'patient') {
      userData.name = name;
      userData.dateOfBirth = dateOfBirth;
      userData.address = address;
      userData.nic = nic;
      userData.gender = gender;
      userData.contactNo = contactNo;
      userData.guardianName = guardianName;
      userData.guardianContactNo = guardianContactNo;
      userData.bloodType = bloodType;
    } else if (role === 'doctor' || role === 'nurse') {
      userData.name = name;
      userData.specialty = specialty;
      userData.licenseNumber = licenseNumber;
      userData.department = department;
      userData.contactNo = contactNo;
    } else if (role === 'admin') {
      userData.name = name;
      userData.contactNo = contactNo;
    }

    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input - check for missing, empty, or whitespace-only values
    if (!username || !password || 
        typeof username !== 'string' || typeof password !== 'string' ||
        username.trim().length === 0 || password.trim().length === 0) {
      return res.status(400).json({ 
        message: 'Please provide username and password' 
      });
    }

    // Trim whitespace
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Find user and include password for comparison
    const user = await User.findOne({
      $or: [{ username: trimmedUsername }, { email: trimmedUsername.toLowerCase() }]
    }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(trimmedPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Logout (client-side token removal, but we can track it)
router.post('/logout', authenticate, async (req, res) => {
  try {
    // In a more advanced setup, you could blacklist the token
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

export default router;

