const { DataTypes } = require('sequelize');
const sequelize = require('./db'); 

const Internship = sequelize.define('Internship', {
  title: { type: DataTypes.STRING, allowNull: false },
  company: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false }
});

module.exports = Internship;