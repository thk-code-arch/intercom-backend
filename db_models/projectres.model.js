module.exports = (sequelize, Sequelize) => {
  const Projectres = sequelize.define("projectresources", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    category: {
    // Link, File, ...
      type: Sequelize.STRING
    },
    url: {
      type: Sequelize.STRING
    },
    description: {
    //user added description
      type: Sequelize.STRING
    },
    addedby: {
    // uploaded by user id
      type: Sequelize.INTEGER
    }
  });

  return Projectres;
};
