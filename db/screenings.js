// Seeds file that remove all cinemas and create 2 new cinemas

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const Screening = require("../models/screening");



mongoose
  .connect('mongodb://localhost/fjcinema', {
    useNewUrlParser: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });




let screening = [{
  roomID: '5cb1b2fa99e7d338c1641275',
  timeStart: '10:00',
  movieID: '5cb0517f4ceb5225e8462110',
  seatPlan: [],
  date: '2019-04-17'
},
{
  roomID: '5cb1b2fa99e7d338c1641275',
  timeStart: '13:00',
  movieID: '5cb0517f4ceb5225e8462110',
  seatPlan: [],
  date: '2019-04-17'
}]

Screening.deleteMany()
  .then(() => {
    return Screening.create(screening)
  })
  .then(screeningsCreated => {
    console.log(`${screeningsCreated.length} screenings created with the following id:`);
    console.log(screeningsCreated.map(screenings => screenings._id));
  })
  .then(() => {
    // Close properly the connection to Mongoose
    mongoose.disconnect()
  })
  .catch(err => {
    mongoose.disconnect()
    throw err
  })