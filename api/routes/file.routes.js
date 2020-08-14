const { authJwt } = require("../middleware");
const controller = require("../controllers/file.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.post(
    "/upload-file",
    [authJwt.verifyToken],
    controller.uploadFile
  );

  app.post(
    "/api/uploadifc/:theprojectId",
    [authJwt.verifyToken, authJwt.isProjectMember],
    controller.uploadIFC
  );
};

