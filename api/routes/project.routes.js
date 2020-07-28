const { authJwt } = require("../middleware");
const controller = require("../controllers/project.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.get(
    "/api/project/get_projects/",
    [authJwt.verifyToken],
    controller.getProjects
  );

  app.post(
    "/api/project/select_project/",
    [authJwt.verifyToken],
    controller.selectProject
  );

  app.get(
    "/api/project/get_projectfile/",
    [authJwt.verifyToken],isProjectMember,
//TODO GLTF Loader muss token ubergeben sonst kein fproject select
    controller.getProjectfile
  );
};

