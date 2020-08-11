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
io.use(authorizer);
io.of('/viewport').use(authorizer);
io.of('/chatroom').use(authorizer);


// TODO add Namespaces with Rooms inside. One Namespace for service. eg viewport,
//test

//create 100 Player rooms
let players = [];
for (var i = 0; i <= 100; ++i) {
    players[i] =[] ;
}

//new NSP
//kskkskssjjss


var viewport = io.of("/viewport");
viewport.on('connection', function(socket) {
  console.log("Connect NSP/viewport UserID:",socket.decoded_token.id)//init
  socket.on('newplayer', (player)=>{
    User.findOne({
        where: {
          id: socket.decoded_token.id
        }
      })
      .then(user => {
      });
  });
  socket.on('getInfo', function(msg){
    socket.emit("info","response for printer.getInfo("+msg+")");
  });

  socket.on('disconnect', function(){
    //nsp.emit("chat message", name+": disconnection");
  });
});


var chatroom = io.of("/chatroom");
chatroom.on('connection', (socket) => {
    console.log("Connect NSP/chatroom UserID:",socket.decoded_token.id) //init
    socket.on('join_chatroom', function(room) {
        console.log("wants room to join:",room);
        socket.join(room);
    });
    socket.on('send_message', function(data) {
      console.log(data);
      data.userid = socket.decoded_token.id;
      data.time = new Date().toISOString().slice(0, 19).replace('T', ' ');
      // TODO check if User is allowed to post data in room
      if (data.chatroomId !== 0){
      Chatlog.create(data).then(result =>{
        chatroom.in(data.chatroomId).emit('message', result.id);
      });
      }
    });
});

// ssjjjdelete sishsksthis namespacse
// io.nsps[yourNamespace]sss.adapter.rooms[roomName]
//io.of("/deletethis").on("connect", socket => {
//  socket.on("new-player", (player, ack) => {
//    player.sID = socket.decoded_token.id;
//    User.findOne({
//        where: {
//          id: socket.decoded_token.id
//        }
//      })
//      .then(user => {
//        socket.join(player.chatroom);
//        console.log(socket);
//        player.username = user.username;
//        player.profile_image = user.profile_image;
//        players[player.chatroom].push(player);
//        io.of("/viewport").in(player.chatroom).emit("list-players", players[player.chatroom]);
//        ack(player);
//      });
//  });
//
//  socket.on("move-to", pos => {
//    players[pos.chatroom.toString()] = players[pos.chatroom.toString()].map(obj =>
//    obj.sID === socket.decoded_token.id ? { ...obj, camPos: pos.position } : obj );
//    io.of("/viewport").in(pos.chatroom).emit("list-players", players[pos.chatroom]);
//    // TODO remove duplicate player by sID, keep last !!!
//  });
//
//  socket.on("bye-bye", player => {
//    players[player.chatroom] = players[player.chatroom].filter(e => e.sID !== socket.decoded_token.id);
//    io.of("/viewport").in(player.chatroom).emit("list-players", players[player.chatroom]);
//  });
//});

//


// TODO implement second rountrip to improve security
// TODO implement jwt expire check

server.listen(3000, function() {
   console.log('listening on localhost:3000');
});

