module.exports = (sequelize, Sequelize) => {
  const Chatroom = sequelize.define("chatroom", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    projectid: {
      type: Sequelize.INTEGER
    },
    roomtype: {
      type: Sequelize.STRING
    }
  });

  return Chatroom;
};
