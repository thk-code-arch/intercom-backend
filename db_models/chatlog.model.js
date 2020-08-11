module.exports = (sequelize, Sequelize) => {
  const Chatlog = sequelize.define("chatlog", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    message: {
      type: Sequelize.TEXT
    },
    userid: {
      type: Sequelize.INTEGER
    },
    time: {
      type: Sequelize.STRING
    }
  });

  return Chatlog;
};
