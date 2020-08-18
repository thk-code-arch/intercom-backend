var bcrypt = require("bcryptjs");
const db = require("./models");
const Role = db.role;
const User = db.user;
const Project = db.project;
const Projectfile = db.projectfile;
const Chatlog = db.chatlog;
const Chatroom = db.chatroom;


var demochatrooms = [
  {id:1, name: "General",roomtype: "PUBLIC", description:"entrance hall"},
  {id:2, name: "CODE ARCH",roomtype: "PUBLIC", description:"dev"},
  {id:3, name: "OffTopic",roomtype: "PUBLIC", description:"chitchat"},
  {id:4, name: "InterACT",roomtype: "PROJECT", projectid:1, description:"Project chat"},
  {id:5, name: "Haus",roomtype: "PROJECT", projectid:2, description:"Project chat"}
];
var demoprojects = [
  {id:1,name: "InterACT",owner:1, description:"InterACT project description"},
  {id:2,name: "Haus",owner:1, description:"Haus project description"}
];
var demoprojectfiles = [
  {id:1, filename: "interact.gltf",path: "/files/", uploadedby: 1, projectId:1},
  {id:2, filename: "koelner-dom.gltf",path: "/files/", uploadedby: 1, projectId:2}
];
var demoadmins = [
  {id:1, username:"admin",email:"admin@bim-cloud.org",profile_image:"admin.jpg",password: bcrypt.hashSync("123456", 8)},
  {id:2, username:"steffen",email:"steffen@bim-cloud.org",profile_image:"steffen.jpg",password: bcrypt.hashSync("123456", 8)},
];
var demousers = [
  {id:3, username:"demo",email:"demo@bim-cloud.org",profile_image:"demo.jpg",password: bcrypt.hashSync("123456", 8)},
  {id:4, username:"student",email:"student@bim-cloud.org",profile_image:"student.jpg",password: bcrypt.hashSync("123456", 8)},
];

module.exports = {
  initial: function () {
  Role.create({
    id: 1,
    name: "user"
  });
  Role.create({
    id: 2,
    name: "admin"
  });
// dev only adding DEMO data
    Chatroom.bulkCreate(demochatrooms)
      .then(() => {

  console.log('\x1b[33m%s\x1b[0m',"step 1");
    Project.bulkCreate(demoprojects)
  console.log('\x1b[33m%s\x1b[0m',"step2. demoprojects found",demoprojects.length);
      }).then(() => {
    Projectfile.bulkCreate(demoprojectfiles)
      }).then(() => {
    User.bulkCreate(demoadmins).then(() => {
      User.findAll({where: {username: "admin"}}).then(user =>{
   console.log('\x1b[33m%s\x1b[0m',"step4. adding admins",user.length);
        for (let i = 0; i < user.length; i++) {
          Role.findAll({where: {name: "admin"}}).then(roles =>{
            user[i].addRoles(roles);
          });
        }
      });
    })
    }).then(() => {
    User.bulkCreate(demousers).then(() => {
      User.findAll().then(user =>{
   console.log('\x1b[33m%s\x1b[0m',"step5. adding all users",user.length);
        for (let i = 0; i < user.length; i++) {
          Role.findAll({where: {name: "user"}}).then(roles =>{
            user[i].addRoles(roles);
          });
          Chatroom.findAll().then(rooms =>{
            user[i].addChatrooms(rooms)
          });
          Project.findAll().then(proj =>{
            user[i].addProjects(proj)
          });
        }
      });
	});
    }).then(() => {
      Chatroom.findAll().then(crooms =>{
        console.log('\x1b[33m%s\x1b[0m',"step 6 Chatroooms found",crooms.length);
        for (let i = 0; i < crooms.length; i++) {
          Chatlog.create({
            userid : 1,
            message : "Welcome @ InterCom !",
            chatroomId : crooms[i].id,
            time : new Date().toISOString().slice(0, 19).replace('T', ' ')
          })
        }
      });
    })
}
}

