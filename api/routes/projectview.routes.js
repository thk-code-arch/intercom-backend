const { authJwt } = require("../middleware");
const controller = require("../controllers/projectview.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/projectview/list_views/:theprojectId",
    [authJwt.verifyToken, authJwt.isProjectMember],
    controller.listviews
  );
  app.post(
    "/api/projectview/add_view/:theprojectId",
    [authJwt.verifyToken, authJwt.isProjectMember],
    controller.addview
  );
};

