const db = require("../models");
const User = db.user;
const Role = db.role;
const Project = db.project;
const Chatroom = db.chatroom;

exports.getUsers = (req, res) => {
  User.findAll({
    where: {
    },
  attributes: ["id","username","email","profile_image","createdAt"],
  include: [{model: db.role, attributes: ["name"]},{model: db.project, attributes: ["name"]}],
  }).then(users => {
    res.status(200).json(users)
  });
};


exports.getProjects = (req, res) => {
  Project.findAll({
    where: {
    },
  attributes: ["id","name","description","owner","createdAt"],
  include: [{model: db.user, attributes: ["username"]}]
  }).then(entries => {
    res.status(200).json(entries)
  });
};

exports.getChatrooms = (req, res) => {
  Chatroom.findAll({
    where: {
    },
  attributes: ["id","name","description","roomtype","createdAt"],
  include: [{model: db.user, attributes: ["username"]}]
  }).then(entries => {
    res.status(200).json(entries)
  });
};

exports.rmRole = (req, res) => {
  Role.findOne({
      where: { name: req.params.therole  }
  }).then(role => {
      role.removeUsers([req.params.theuserid]).then(() =>{
        User.findAll({
          where: {
          },
        attributes: ["id","username","email","profile_image","createdAt"],
        include: [{model: db.role, attributes: ["name"]},{model: db.project, attributes: ["name"]}],
        }).then(users => {
          res.status(200).json(users)
        });
    });
  }).catch(e => console.log(e));
};

exports.addRole = (req, res) => {
  Role.findOne({
      where: { name: req.params.therole  }
  }).then(role => {
    role.addUsers([req.params.theuserid]).then(() =>{
        User.findAll({
          where: {
          },
        attributes: ["id","username","email","profile_image","createdAt"],
        include: [{model: db.role, attributes: ["name"]},{model: db.project, attributes: ["name"]}],
        }).then(users => {
          res.status(200).json(users)
        });
    });
  }).catch(e => console.log(e));
};
