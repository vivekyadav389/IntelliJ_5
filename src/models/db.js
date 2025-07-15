const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  // Railway or cloud: use full connection string
  sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: 'mysql' });
} else {
  // Local development: use individual env vars or defaults
  sequelize = new Sequelize(
    process.env.DB_NAME || 'internship',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '@Vivekyadav389',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
      port: process.env.DB_PORT || 3306,
    }
  );
}

module.exports = sequelize;