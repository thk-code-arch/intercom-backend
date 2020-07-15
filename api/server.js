const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome." });
});
// routes
app.use('/files', express.static('/files'));
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./models");
const Role = db.role;
const User = db.user;
const Project = db.project;

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
// TODO add users to projects
    Project.create({
        id: 1,
        name: "InterACT",
        owner: 1,
    });
    Project.create({
        id: 2,
        name: "Koelner-Dom",
        owner: 1,
    });
  User.create({
    username: "admin",
    email: "admin@bim-cloud.org",
    password: bcrypt.hashSync("123456", 8)
  })
    .then(user => {
        Role.findAll({
            where: {name: "admin"}
        }).then(roles => {
          user.setRoles(roles)
        });
});
  User.create({
    username: "demo",
    email: "demo@bim-cloud.org",
    password: bcrypt.hashSync("123456", 8)
  })
    .then(user => {
        Role.findAll({
            where: {name: "user"}
        }).then(roles => {
          user.setRoles(roles)
        });
});
}
