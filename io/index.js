const app = require('express')();
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
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

io.use(socketioJwt.authorize({
  secret: process.env.IC_Secret,
  handshake: true
}));

io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('SEND_MESSAGE', function(data) {
    data.time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    data.userid = socket.decoded_token.id;
    console.log(data);
       io.emit('MESSAGE', data);
    });
});
//TODO implement second rountrip to improve security
//TODO implement jwt expire check
server.listen(3000);
