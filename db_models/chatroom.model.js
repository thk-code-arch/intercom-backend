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
    projectid: {
      type: Sequelize.INTEGER
    },
    roomtype: {
      // eg PUBLIC PRIVATE or PROJECT 
      type: Sequelize.STRING
    }
  });

  return Chatroom;
};
