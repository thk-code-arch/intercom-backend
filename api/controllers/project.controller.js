const db = require("../models");
const User = db.user;
const Project = db.project;
exports.getProjects = (req, res) => {
  res.status(200).send("ProjectList");
};
exports.selectProject = (req, res) => {
  res.status(200).send("Project selected");
};
exports.addProject = (req, res) => {
  res.status(200).send("Project added");
};
