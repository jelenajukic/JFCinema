const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const User = require("../models/User"); 

mongoose
  .connect('mongodb://localhost/fjcinema', { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

let users = [
  {
    username: "Fedde",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    email: "fedde@fedde.nl",
    role: "USER"
  },
  {
    username: "Fedde-admin",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    email: 'fedde@feddeadmin.nl',
    role: 'ADMIN'
  },
  {
    username: "Jelena",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    email: 'Jelena@jelena.nl',
    role: 'USER'
  },
  {
    username: "Jelena-admin",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    email: 'Jelena@jelenaadmin.nl',
    role: 'ADMIN'
  }
] 

//  User.create(users)
  // -> If you want to delete the current users, use this instead of User.create(users)
 User.deleteMany()
    .then(() => {
      return User.create(users)
    })
  .then(usersCreated => {
    console.log(`${usersCreated.length} users created with the following ids:`);
    console.log(usersCreated.map(u => u._id));
    mongoose.disconnect();
    console.log('DB: connection closed')
  })
  .catch(err => { 
    mongoose.disconnect();
    console.log('DB connection closed with error: ', err);
  })
 
 