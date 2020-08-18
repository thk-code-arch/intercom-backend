config = {
      HOST: process.env.IC_DBHost,
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
    operatorsAliases: 0,

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
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.project = require("../models/project.model.js")(sequelize, Sequelize);
db.projectfile = require("../models/projectfile.model.js")(sequelize, Sequelize);
db.chatlog = require("../models/chatlog.model.js")(sequelize, Sequelize);
db.chatroom = require("../models/chatroom.model.js")(sequelize, Sequelize);

/////////////////////User may has many Roles
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});
/////////////////////User has many Projects
db.project.belongsToMany(db.user, {
  through: "user_projects",
  foreignKey: "projectId",
  otherKey: "userId"
});
db.user.belongsToMany(db.project, {
  through: "user_projects",
  foreignKey: "userId",
  otherKey: "projectId"
});
/////////////////////User is assigned to many Public & Private Chatrooms
db.chatroom.belongsToMany(db.user, {
  through: "user_chatrooms",
  foreignKey: "chatroomId",
  otherKey: "userId"
});
db.user.belongsToMany(db.chatroom, {
  through: "user_chatrooms",
  foreignKey: "userId",
  otherKey: "chatroomId"
});
/////////////////////A Projectfile (e.g. IFC) belongs to one Project
db.projectfile.belongsTo(db.project, {
  foreignKey: "projectId",
});
/////////////////////A Chat message is emited by one User
db.chatlog.belongsTo(db.user, {
  foreignKey: "userid"
});
///////////////////// One Chatroom has  many messages
db.chatroom.hasMany(db.chatlog, {
  targetKey: "roomid"
});
// TODO adding subprojects
// TODO add table for files belongs to projects
db.ROLES = ["user", "admin"];

module.exports = db;

