const fs = require('fs');
const db = require("../models");
const User = db.user;
const Project = db.project;

exports.getProjects = (req, res) => {
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

exports.getProjectfile = (req, res) => {
  console.log(req.headers["x-current-project"])
  const filePath =  "/files/interact.gltf" // or any file format
  // Check if file specified by the filePath exists 
  fs.exists(filePath, function(exists){
      if (exists) {     
        // Content-type is very interesting part that guarantee that
        // Web browser will handle response in an appropriate manner.
        res.writeHead(200, {
          "Content-Type": "model/gltf+json",
        });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(400, {"Content-Type": "text/plain"});
        res.end("ERROR File does not exist");
      }
    });
};
exports.addProject = (req, res) => {
  res.status(200).send("Project added");
};
