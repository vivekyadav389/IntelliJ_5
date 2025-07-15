const express = require('express');
const router = express.Router();
const Internship = require('../models/internship');

// POST /api/internships
router.post('/', async (req, res) => {
  try {
    const { title, company, location, stipend, duration, description } = req.body;
    if (!title || !company || !location || !duration || !description) {
      return res.status(400).json({ error: 'All fields except stipend are required.' });
    }
    const internship = await Internship.create({ title, company, location, stipend, duration, description });
    res.status(201).json({ message: 'Internship posted!', internship });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all internships
router.get('/internships', async (req, res) => {
  try {
    const internships = await Internship.findAll({
      order: [['createdAt', 'DESC']] // Latest first
    });
    res.json(internships);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
});

module.exports = router;