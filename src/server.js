const express = require('express');
const { sequelize } = require('./models');
const internshipRoutes = require('./routes/internshipRoutes');
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const path = require('path');
const session = require('express-session');

const app = express();
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' https://intellij5-production.up.railway.app; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; font-src 'self';"
  );
  next();
});

app.use('/api', internshipRoutes);
app.use('/api', authRoutes);
app.use('/api', applicationRoutes);

// Serve static files from the views directory
app.use(express.static(path.join(__dirname, 'views')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Define the home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Example middleware
function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.isAdmin) {
    return next();
  }
  res.status(401).redirect('/src/views/home.html');
}

// Use this middleware on admin routes


sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});