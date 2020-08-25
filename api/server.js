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
require('./routes/projectview.routes')(app);
require('./routes/fetch.routes')(app);
// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

var dbdemodata = require('./db.demo.data');
const db = require("./models");
//test db
db.sequelize.sync(
{force: true}

).then(() => {
  console.log('Drop and Resync Db');
  dbdemodata.initial();
});

