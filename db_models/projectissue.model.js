module.exports = (sequelize, Sequelize) => {
  const Projectissue = sequelize.define("projectissues", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    status: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.TEXT
    },
    area: {
      type: Sequelize.STRING
    },
    priority: {
      type: Sequelize.STRING
    },
    comment: {
      type: Sequelize.TEXT
    },
    owner: {
      type: Sequelize.INTEGER
    },
    assignedTo: {
      type: Sequelize.INTEGER
    }
  });

  return Projectissue;
};
