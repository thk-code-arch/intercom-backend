const db = require("../models");
const User = db.user;
const Chatlog = db.chatlog;
const Chatroom = db.chatroom;

exports.chatlog = (req, res) => {
   Chatroom.findOne({
	where: { id: req.params.chatroomid
	},
    include: [{// Notice `include` takes an ARRAY
    model: db.chatlog, attributes: ["message","time"] , required: true,
    include: [{model: db.user, attributes: ["username","profile_image"]}]
    }]
  }).then(function(entries){
    res.status(200).json(entries)
    });
};
// TODO fix search for msgid
exports.msgbyid = (req, res) => {
   Chatlog.findOne({
     where: { id: req.params.msgid
	},
     attributes: ["message","time"],
     include: [{model: db.user, attributes: ["username","profile_image"]}]
  }).then(function(entries){
    res.status(200).json(entries)
    });
};
exports.getprojectroom = (req, res) => {
   Chatroom.findOne({
	where: {
    projectid: req.currProject
	}
  }).then(function(entries){
    res.status(200).json(entries)
    });
};
