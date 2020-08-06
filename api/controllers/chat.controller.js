const db = require("../models");
const User = db.user;
const Chatlog = db.chatlog;
const Chatroom = db.chatroom;

exports.chatlog = (req, res) => {
  var messages = [];
   Chatroom.findOne({
	where: {
	},
    include: [{// Notice `include` takes an ARRAY
    model: db.chatlog, attributes: ["message","time"] , required: true,
    include: [{model: db.user, attributes: ["username","profile_image"]}]
    }]
  }).then(function(entries){
    res.status(200).json(entries)
    });
};
exports.getprojectroom = (req, res) => {
  var messages = [];
   Chatroom.findOne({
	where: {
    projectid: req.currProject
	}
  }).then(function(entries){
    res.status(200).json(entries)
    });
};
