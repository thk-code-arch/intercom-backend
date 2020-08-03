module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define("projects", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
    owner: {
      type: Sequelize.INTEGER
    },
    parentProject: {
      type: Sequelize.INTEGER
    }
  });

  return Project;
};
