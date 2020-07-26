const db = require("../models");
const User = db.user;
const Project = db.project;

exports.getProjects = (req, res) => {
  console.log(req.userId);
  var userprojects = [];
  User.findByPk(req.userId).then(user => {
    user.getProjects().then(projects => {
    console.log(projects);
    for (let i = 0; i < projects.length; i++) {
        userprojects.push(projects[i].name);
    }
    console.log(userprojects);
    res.status(200).json({ projects: userprojects })
    });
  });
  };

exports.selectProject = (req, res) => {
  res.status(200).send("Project selected");
};

exports.addProject = (req, res) => {
  res.status(200).send("Project added");
};
