const { Sequelize } = require('sequelize');

const config = {
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT
};

// Add SSL configuration for Aiven MySQL
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  ...(process.env.NODE_ENV === 'production' ? {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  } : {
  
  }),
  logging: process.env.NODE_ENV !== 'production' ? console.log : false,
});

// Import models
const User = require('./User-model')(sequelize, Sequelize.DataTypes);
const Material = require('./Material-model')(sequelize, Sequelize.DataTypes);
const Request = require('./Request-model')(sequelize, Sequelize.DataTypes);
const Notification = require('./Notification-model')(sequelize, Sequelize.DataTypes);
const Trade = require('./Trade-model')(sequelize, Sequelize.DataTypes);
// Setup associations
User.associate({ Request, Notification });
Material.associate({ Request, Trade }); // Add Trade here
Request.associate({ User, Material });
Notification.associate({ User });
Trade.associate({ Material }); // Add 


// Add models to db object
const db = {
  User,
  Material,
  Trade,
  Request,
  Notification,
  sequelize,
  Sequelize
};

// Sync the database with Sequelize
sequelize.sync({ alter: process.env.NODE_ENV == 'production', force: false })
  .then(() => console.log('Database synced successfully'))
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

module.exports = db;