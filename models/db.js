const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('internship', 'root', '@Vivekyadav389', {
  host: 'localhost',
  dialect: 'mysql'
});
module.exports = sequelize;