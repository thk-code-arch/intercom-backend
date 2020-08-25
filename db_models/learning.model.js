module.exports = (sequelize, Sequelize) => {
  const Learning = sequelize.define("learnings", {
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
      type: Sequelize.STRING(4000)
    },
    thumbnail: {
      type: Sequelize.STRING
    },
    title: {
    //user added description
      type: Sequelize.STRING(400)
    },
    description: {
    //user added description
      type: Sequelize.TEXT
    },
    type: {
    // PUBLIC, PROJECT related
      type: Sequelize.STRING
    },
    projectId: {
    // when project related
      type: Sequelize.INTEGER
    },
    views: {
    // when project related
      type: Sequelize.INTEGER
    }
  });

  return Learning;
};
