
const app = require('express')();
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
    serveClient: false,
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});
const socketioJwt = require('socketio-jwt');
const db = require("./models");
const User = db.user;
const Chatlog = db.chatlog;

io.use(socketioJwt.authorize({
  secret: process.env.IC_Secret,
  handshake: true
}));


io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('SEND_MESSAGE', function(data) {
      data.userid = socket.decoded_token.id;
      data.chatroomId = 1,
      data.time = new Date().toISOString().slice(0, 19).replace('T', ' ');
      Chatlog.create(data);
      User.findOne({
        where: {
          id: socket.decoded_token.id
        }
      })
        .then(user => {
          console.log("Userid found");
          data.username = user.username;
          //TODO Profile url from ENV Url
          data.profile_image = user.profile_image;
          console.log(data);
          io.emit('MESSAGE', data);
        });
    });
    socket.on('camPos', function(data) {
      data.userid = socket.decoded_token.id;
      data.chatroomId = 1,
      io.emit('usercamPos', data);
    });
});
//TODO implement second rountrip to improve security
//TODO implement jwt expire check
server.listen(3000);
