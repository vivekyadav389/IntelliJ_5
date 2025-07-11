const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/user');
const Application = require('../models/application'); // adjust path as needed
const bcrypt = require('bcrypt');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the already created absolute path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/SignUp', upload.single('profilePic'), async (req, res) => {
  try {
    const { username, password, email, name, college, semester, year } = req.body;
    // Password validation
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    if (!passwordPattern.test(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters and include a letter, a number, and a symbol.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePic = req.file ? req.file.filename : null;

    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      name,
      college,
      semester,
      year,
      profilePic
    });

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      res.status(400).json({ error: err.errors[0].message });
    } else {
      res.status(400).json({ error: 'Registration failed' });
    }
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id;
    req.session.user = { id: user.id, isAdmin: user.isAdmin }; // <-- THIS IS REQUIRED
    return res.json({
      success: true,
      isAdmin: user.isAdmin,
    });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

router.get('/profile', async (req, res) => {
  const userId = req.session.userId; // <-- Use session
  if (!userId) return res.status(401).json({ error: 'Not logged in' });
  const user = await User.findByPk(userId);
  res.json(user);
});

// Update profile (with optional profilePic upload)
router.post('/profile/update', upload.single('profilePic'), async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  try {
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      college: req.body.college,
      semester: req.body.semester,
      year: req.body.year
    };
    if (req.file) updateData.profilePic = req.file.filename;

    console.log('Updating user:', userId, updateData);

    await User.update(updateData, { where: { id: userId } });
    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(400).json({ error: err.message });
  }
});

router.post('/profile/delete-pic', async (req, res) => {
  try {
    const userId = req.session.userId; // Use session for current user
    if (!userId) return res.status(401).json({ error: 'Not logged in' });
    await User.update({ profilePic: null }, { where: { id: userId } });
    res.json({ message: 'Profile picture removed' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// New route for applications
router.post('/api/applications', upload.single('resume'), async (req, res) => {
  try {
    const { internshipId, studentName, collegeName, semester, year, experience, bio } = req.body;
    const resumePath = req.file ? req.file.filename : '';
    const application = await Application.create({
      internshipId,
      studentName,
      collegeName,
      semester,
      year,
      experience,
      bio,
      resumePath
    });
    res.json({ success: true, application });
  } catch (err) {
    console.error('Application error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;