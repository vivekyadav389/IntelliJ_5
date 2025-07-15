const { Sequelize } = require('sequelize');

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, { dialect: 'mysql' })
  : new Sequelize(
      'internship',
      'root',
      '@Vivekyadav389',
      {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306,
      }
    );

module.exports = sequelize;