// Add to your authRoutes.js or a new profileRoutes.js
router.get('/profile', async (req, res) => {
  try {
    // Replace with your authentication logic
    const userId = req.user?.id || req.query.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});