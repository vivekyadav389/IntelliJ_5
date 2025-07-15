const { Internship } = require('../models/internship');

exports.getAll = async (req, res) => {
  try {
    const internships = await Internship.findAll();
    res.json(internships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, company, location, stipend, duration, description } = req.body;
    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }
    const internship = await Internship.create({
      title,
      company,
      location,      
      stipend,
      duration,
      description
    });
    res.status(201).json(internship);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};