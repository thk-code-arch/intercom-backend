const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

//TODO get currentproject
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

//TODO isProjectMember "check if User is projectmember"

isProjectMember = (req, res, next) => {
  let currentProjct = req.params.theprojectId;
  User.findByPk(req.userId).then(user => {
    user.getProjects().then(projects => {
    console.log(currentProjct);
      for (let i = 0; i < projects.length; i++) {
        console.log(projects[i].id);
        if (projects[i].id == currentProjct) {
          req.currProject = currentProjct;
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Not a project member!"
      });
      return;
    });
  });
};
//TODO isProjectOwner "check if User is projectowner"

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
    });
  });
};



const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isProjectMember: isProjectMember,
};
module.exports = authJwt;

