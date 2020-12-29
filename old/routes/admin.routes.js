const { authJwt } = require("../middleware");
const controller = require("../controllers/admin.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/admin/get_users",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getUsers
  );
  app.get(
    "/api/admin/get_projects",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getProjects
  );
  app.get(
    "/api/admin/get_chatrooms",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getChatrooms
  );
  app.post(
    "/api/admin/rm_role/:therole/:theuserid",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.rmRole
  );
  app.post(
    "/api/admin/add_role/:therole/:theuserid",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.addRole
  );
};

