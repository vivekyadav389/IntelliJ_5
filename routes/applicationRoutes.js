const express = require('express');
const multer = require('multer');
const path = require('path');
const { Application, Internship } = require('../models');
const router = express.Router();
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/applications', upload.single('resume'), async (req, res) => {
    try {
        const { internshipId, studentName, collegeName, semester, year, experience, bio } = req.body;
        const resumePath = req.file ? req.file.filename : '';
        await Application.create({
            userId: req.session.userId, // or wherever you get the userId
            internshipId,
            studentName,
            collegeName,
            semester,
            year,
            experience,
            bio,
            resumePath
        });
        res.json({ message: 'Application received!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all applications for the logged-in user
router.get('/applications', async (req, res) => {
    try {
        const applications = await Application.findAll({
          include: [{ model: Internship }]
        });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// New route to get all applications (admin view)
router.get('/api/applications', async (req, res) => {
    try {
        const applications = await Application.findAll({
            include: [{ model: Internship }]
        }); // No include
        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;