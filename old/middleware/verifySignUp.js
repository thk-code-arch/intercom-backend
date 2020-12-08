const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
  });
};

//TODO  invitecode for register add Invite to DB and admin Backend
checkInviteCode = (req, res, next) => {
  if (req.body.invitecode != "code-arch" ) {
        res.status(400).send({
          message: "Failed! InviteCode wrong"
        });
        return;
  }
  next();
};
const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkInviteCode: checkInviteCode,
};

module.exports = verifySignUp;

