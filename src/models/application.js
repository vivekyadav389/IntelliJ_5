const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Application = sequelize.define('Application', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  internshipId: { type: DataTypes.INTEGER, allowNull: false },
  studentName: { type: DataTypes.STRING, allowNull: false },
  collegeName: { type: DataTypes.STRING, allowNull: false },
  semester: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.STRING, allowNull: false },
  experience: { type: DataTypes.STRING, allowNull: false },
  bio: { type: DataTypes.TEXT, allowNull: false },
  resumePath: { type: DataTypes.STRING, allowNull: false },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending'
  },
}, {
  tableName: 'Applications', // <-- Add this line to force correct table name
  timestamps: true
});

module.exports = Application;