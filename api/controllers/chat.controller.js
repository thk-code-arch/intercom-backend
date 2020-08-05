const db = require("../models");
const User = db.user;
const Chatlog = db.chatlog;

exports.chatlog = (req, res) => {
  var messages = [];
   Chatlog.findAll({
	where: {
	},
    include: [{// Notice `include` takes an ARRAY
    model: db.user, attributes: ["username","profile_image"] , required: true
    }]
  }).then(function(entries){
    console.log(entries);
    res.status(200).json(entries)
    });  
};
