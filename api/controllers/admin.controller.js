const db = require("../models");
const User = db.user;


exports.getUsers = (req, res) => {
  User.findAll({
    where: {
    }
  }).then(users => {
    res.status(200).json(users)
  });
};
