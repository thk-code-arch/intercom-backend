module.exports = (sequelize, Sequelize) => {
  const Projectview = sequelize.define("projectviews", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    camPos: {
    // ifc files
      type: Sequelize.TEXT
    },
    description: {
    // ifc files
      type: Sequelize.TEXT
    },
    uploadedby: {
    // uploaded by user id
      type: Sequelize.INTEGER
    }
  });

  return Projectview;
};
