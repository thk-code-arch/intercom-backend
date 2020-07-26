module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define("projects", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    owner: {
      type: Sequelize.INTEGER
    }
      //TODO add subproject INTEGER id is parentProject
      
  });

  return Project;
};
