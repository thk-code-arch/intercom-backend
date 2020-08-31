const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Chatroom = db.chatroom;
const Project = db.project;
var mail = require('../mail/mail.service');
var generator = require('generate-password');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  var SafePassword = generator.generate({length: 10,numbers:true});
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(SafePassword, 8),
    profile_image: "notset.jpg"
  })
    .then(user => {
        Chatroom.findAll().then(rooms =>{
          user.addChatrooms(rooms)
        });
        Project.findAll().then(proj =>{
          user.addProjects(proj)
        });
        Role.findOne({
          where: { name: "user"}
          }).then(roles => {
          user.setRoles(roles).then(() => {
            console.log(SafePassword);
            mail.sendMail(req.body.email,"InterCom:New User registered","Welcome "+req.body.username+", your password is: "+SafePassword);
            res.send({ message: "Registred. Check your Mails" });
          });
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Invalid User or Password!" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid User or Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var userprojects = [];
      user.getProjects().then(projects => {
        for (let i = 0; i < projects.length; i++) {
          userprojects.push("Assigned_Project:_" + projects[i].name);
        }
      });
      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          profile_image: "https://"+process.env.VIRTUAL_HOST+"/static/profile_image/"+user.profile_image,
          roles: authorities,
          projects: userprojects,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

