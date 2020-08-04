module.exports = (sequelize, Sequelize) => {
  const Chatlog = sequelize.define("chatlog", {
    message: {
      type: Sequelize.STRING
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
