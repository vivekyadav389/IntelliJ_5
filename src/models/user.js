const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  email:    { type: DataTypes.STRING, allowNull: false, unique: true },
  name:     { type: DataTypes.STRING, allowNull: false },
  college:  { type: DataTypes.STRING, allowNull: false },
  semester: { type: DataTypes.STRING, allowNull: false },
  year:     { type: DataTypes.STRING, allowNull: false },
  profilePic: { type: DataTypes.STRING },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = User;