const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'internship',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '@Vivekyadav389',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
  }
);

module.exports = sequelize;