const sequelize = require('./db');
const Internship = require('./internship');
const Application = require('./application');
const User = require('./user');

// Associations
Application.belongsTo(Internship, { foreignKey: 'internshipId' });
Internship.hasMany(Application, { foreignKey: 'internshipId' });

Application.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Application, { foreignKey: 'userId' });

module.exports = { sequelize, Internship, Application, User };