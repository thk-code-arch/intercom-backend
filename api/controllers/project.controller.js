const fs = require('fs');
const db = require("../models");
const User = db.user;
const Project = db.project;
const Projectfile = db.projectfile;

exports.getProjects = (req, res) => {
  var userprojects = [];
  User.findByPk(req.userId).then(user => {
    user.getProjects().then(projects => {
    console.log(projects);
    for (let i = 0; i < projects.length; i++) {
        userprojects.push(projects[i].name);
    }
    console.log(userprojects);
    //res.status(200).json({ projects: userprojects })
    res.status(200).json(projects)
    });
  });
  };

exports.getProjectinfo = (req, res) => {
  Project.findOne({
    where: {
      id: req.currProject
    }
  })
    .then(project => {
        res.status(200).send({
          id: project.id,
          name: project.name,
          description: project.description,
          parentProject: project.parentProject,
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  };

exports.getProjectfile = (req, res) => {
  console.log(req.currProject);
   Projectfile.findAll({
	limit: 1,
	where: {
      projectId: req.currProject
	},
	order: [ [ 'createdAt', 'DESC' ]]
  }).then(function(entries){
    const filePath = entries[0].path + entries[0].filename;
    // Check if file specified by the filePath exists 
    fs.exists(filePath, function(exists){
        if (exists) {     
          const Filelastmodified = entries[0].updatedAt.toUTCString();
          console.log(Filelastmodified);
          // Content-type is very interesting part that guarantee that
          // Web browser will handle response in an appropriate manner.
          res.writeHead(200, {
            "Last-Modified": Filelastmodified,
            "Content-Type": "model/gltf+json"
          });
          fs.createReadStream(filePath).pipe(res);
        } else {
          res.writeHead(400, {"Content-Type": "text/plain"});
          res.end("ERROR File does not exist");
        }
      });
      //only difference is that you get users list limited to 1
      //entries[0]
    });  
//TODO get latest GLTF by Project
};
exports.selectProject = (req, res) => {
  Project.findOne({
    where: {
      id: req.body.projectid
    }
  })
    .then(project => {
    var projctowner = false;
     if (project.owner == req.userId){
          projctowner = true};
        res.status(200).send({
          id: project.id,
          name: project.name,
          owner: projctowner,
          parentProject: project.parentProject,
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.addProject = (req, res) => {
    Project.create({
        name: "New Project",
        owner: req.userId,
    })
    .then(project => {
    User.findByPk(req.userId).then(user => {
    user.addProjects(project)
    });
    var projctowner = false;
     if (project.owner == req.userId){
          projctowner = true};
        res.status(200).send({
          id: project.id,
          name: project.name,
          owner: projctowner,
          parentProject: project.parentProject,
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
