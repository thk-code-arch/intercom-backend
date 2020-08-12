var roomdata = require('roomdata');
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

var authorizer = socketioJwt.authorize({
  secret: process.env.IC_Secret,
  handshake: true
});
//
// JWT auth
io.use(authorizer);
io.of('/viewport').use(authorizer);
io.of('/chatroom').use(authorizer);

var viewport = io.of("/viewport");
viewport.on('connection', function(socket) {
  User.findOne({
    where: {
      id: socket.decoded_token.id
    }
    })
    .then(user => {
      socket.userName = user.username;
      socket.userImage = user.profile_image;
    });
  console.log("Connect NSP/viewport UserID:",socket.decoded_token.id)//init
  socket.on('join_viewport',  function(room) {
    if (room.oldRoom !== 0){
    socket.leave(room.oldRoom);
    }
    socket.join(room.newRoom);
    console.log("/viewport user joins:",socket.rooms);
  });
  socket.on('moveTo', function(data){
    data.userid = socket.decoded_token.id;
    data.username = socket.userName;
    data.profile_image = socket.userImage;
    console.log(data);
	if (data.chatroomId !== 0){
	  viewport.in(data.chatroomId).emit('getplayers', data);
	}
  });

  socket.on('disconnect', function(){
    // TODO emit disconnet message to Viewport NSP
    //nsp.emit("chat message", name+": disconnection");
  });
});


var chatroom = io.of("/chatroom");
chatroom.on('connection', (socket) => {
  console.log("Connect NSP/chatroom UserID:",socket.decoded_token.id) //init
  socket.on('join_chatroom', function(room) {
    if (room.oldRoom !== 0){
    socket.leave(room.oldRoom);
    }
    socket.join(room.newRoom);
    console.log("/chatroom user joins:",socket.rooms);
  });
  socket.on('send_message', function(data) {
    console.log(data);
    data.userid = socket.decoded_token.id;
    data.time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // TODO check if User is allowed to post data in room.
    if (data.chatroomId !== 0){
    Chatlog.create(data).then(result =>{
      chatroom.in(data.chatroomId).emit('message', result.id);
    });
    }
  });
  socket.on('disconnect', function(){
    //nsp.emit("chat message", name+": disconnection");
  });
});


// TODO implement second rountrip to improve security,
// TODO implement jwt expire check

server.listen(3000, function() {
   console.log('listening on localhost:3000');
});

