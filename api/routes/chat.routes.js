const { authJwt } = require("../middleware");
const controller = require("../controllers/chat.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

// TODO lock chatroutes by checkin isChatmember
  app.get(
    "/api/chat/log/:chatroomid",
    [authJwt.verifyToken],
    controller.chatlog
  );

  app.get(
    "/api/chat/msgbyid/:msgid",
    [authJwt.verifyToken],
    controller.msgbyid
  );

  app.get(
    "/api/chat/get_projectroom/:theprojectId",
    [authJwt.verifyToken, authJwt.isProjectMember],
    controller.getprojectroom
  );
};

