config = {
      HOST: "icweb-db",
      USER: "root",
      PASSWORD: process.env.IC_DBPassword,
      DB: process.env.IC_Database,
      dialect: "mysql",
      pool: {
              max: 20,
              min: 0,
              acquire: 30000,
              idle: 10000
            }
};
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.chatlog = require("../models/chat.model.js")(sequelize, Sequelize);

module.exports = db;
