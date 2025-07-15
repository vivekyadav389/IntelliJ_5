const { User } = require('../models/user');

// Registration handler
exports.SignUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Add validation and hashing as needed
    const user = await User.create({ username, password });
    res.status(201).json({ message: 'User SignUped!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login handler (optional, for future use)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username, password } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', isAdmin: user.isAdmin });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};