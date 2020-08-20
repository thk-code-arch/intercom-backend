const db = require("../models");
const Projectview = db.projectview;

exports.listviews = (req, res) => {
  Projectview.findAll({
    where: {
      projectId: req.currProject
    },
  attributes: ["id","camPos","description","projectId","createdAt","uploadedby"],
  }).then(views => {
    res.status(200).json(views)
  });
};

exports.addview = (req, res) => {
  Projectview.create({
    camPos: req.camPos,
    description: req.description,
    uploadedby: req.userId,
    projectId: entries.id
  }).then(() =>{
      Projectview.findAll({
        where: {
          projectId: req.currProject
        },
      attributes: ["id","camPos","description","projectId","createdAt","uploadedby"],
      }).then(views => {
        res.status(200).json(views)
      });
});
};
