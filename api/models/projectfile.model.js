module.exports = (sequelize, Sequelize) => {
  const Projectfile = sequelize.define("projectfiles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    filename: {
    // ifc files
      type: Sequelize.STRING
    },
    path: {
    //web file path
      type: Sequelize.STRING
    },
    uploadedby: {
    // uploaded by user id
      type: Sequelize.INTEGER
    }
  });

  return Projectfile;
};
