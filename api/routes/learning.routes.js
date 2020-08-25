const { authJwt } = require("../middleware");
const controller = require("../controllers/learning.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/learning/add",
    [authJwt.verifyToken],
    controller.addLearning
  );

  app.get(
    "/api/learning/public",
    [authJwt.verifyToken],
    controller.listAllPublic
  );

  app.get(
    "/api/learning/show/:learningId",
    [authJwt.verifyToken],
    controller.showOne
  );
};

