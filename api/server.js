const express = require("express");
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const cors = require("cors");
const morganBody = require('morgan-body');
const app = express();

var corsOptions = {
    origin: ["http://localhost:8080","https://"+process.env.IC_CORS]
};

app.use(cors(corsOptions));

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// debugig
//

// must parse body before morganBody as body will be logged
app.use(bodyParser.json());

// hook morganBody to express app (Unlike typical express middleware you're passing the actual app into the function)
morganBody(app);
// disable 304 cache
app.set('etag', 'strong');
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome." });
});
// routes
app.use('/files', express.static('/files'));
app.use('/static', express.static('/files/static'));
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/admin.routes')(app);
require('./routes/file.routes')(app);
require('./routes/project.routes')(app);
require('./routes/chat.routes')(app);
// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./models");
const Role = db.role;
const User = db.user;
const Project = db.project;
const Projectfile = db.projectfile;
const Chatlog = db.chatlog;
const Chatroom = db.chatroom;
//test db
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

var bcrypt = require("bcryptjs");
function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
  Role.create({
    id: 2,
    name: "admin"
  });
// dev only adding DEMO data
    Project.create({
        id: 1,
        name: "InterACT",
        owner: 1
    }).then((newProject) => {
    Chatroom.create({
    name: newProject.name,
    roomtype: "PROJECT",
    projectid: newProject.id
    });
    return Projectfile.create({
    filename: "interact.gltf",
    path: "/files/",
    uploadedby: 1,
    projectId: newProject.id
    })
    });

    Project.create({
        id: 2,
        name: "Koelner-Dom",
        owner: 1
    }).then((newProject) => {
    Chatroom.create({
    name: newProject.name,
    roomtype: "PROJECT",
    projectid: newProject.id
    });
    Chatlog.create({
      userid : 1,
      message : "Welcome @ InterCom !",
      chatroomId : 2,
      time : new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
    return Projectfile.create({
    filename: "koelner-dom.gltf",
    path: "/files/",
    uploadedby: 1,
    projectId: newProject.id
    })
    });

  User.create({
    id: 1,
    username: "admin",
    email: "admin@bim-cloud.org",
    profile_image: "admin.jpg",
    password: bcrypt.hashSync("123456", 8)
  }).then(user => {
      Chatlog.create({
        userid : user.id,
        message : "Welcome @ InterCom !",
        chatroomId : 1,
        time : new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
        Project.findAll()
			.then(projects => {
          user.setProjects(projects)
        });
        Role.findAll({
            where: {name: "admin"}
        }).then(roles => {
          user.setRoles(roles)
        });
  });

  User.create({
    id: 2,
    username: "demo",
    email: "demo@bim-cloud.org",
    profile_image: "demo.jpg",
    password: bcrypt.hashSync("123456", 8)
  })
    .then(user => {
        Project.findAll()
			.then(projects => {
          user.setProjects(projects)
        });
        Role.findAll({
            where: {name: "user"}
        }).then(roles => {
          user.setRoles(roles)
        });
});
}
