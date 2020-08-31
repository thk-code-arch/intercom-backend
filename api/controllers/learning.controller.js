const db = require("../models");
const Learning = db.learning;

exports.addLearning = (req, res) => {
  Learning.create({
    category: req.body.category,
    url: req.body.url,
    thumbnail: req.body.thumbnail,
    title:req.body.title,
    description:req.body.description,
    type: req.body.type,
    projectId: req.body.projectId,
    userId: req.userId
  }).then(post=>{
    res.status(200).json(post)
  });
};

exports.listAllPublic = (req, res) => {
  Learning.findAll({
    where: { type: "PUBLIC"}
  }).then(entries =>{
    res.status(200).json(entries)
  })
};

exports.showOne = (req, res) => {
  Learning.findOne({
    where: { id: req.params.learningId}
  }).then(entries =>{
    Learning.increment({views: 1}, { where: { id: entries.id }});
    res.status(200).json(entries)
  })
};
