const mongoose = require("mongoose");
const Screening = require("../models/screening");
const Cinema = require('../models/cinema');
const Movie = require('../models/movie');

// !! Create cinema seeds first!! //

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

var screening; // global var
var movieID;
var movieID2;

// retreive movie ID
Movie.find({})
  .then(movies => {
    movieID = movies[1]._id;
    movieID2 = movies[2]._id;
    // retreive a real cinema id and room id for testing :)
    return Cinema.find({})
  })
  .then(cinemas => {
    let cinemaID = cinemas[0]._id;
    let roomID = cinemas[0].rooms[0]._id;
    console.log(cinemaID, roomID)
    screening = [{
      cinemaID: cinemaID,
      roomID: roomID,
      timeStart: '10:00',
      movieID: movieID,
      seatPlan: [],
      date: '2019-04-22'
    },
    {
      cinemaID: cinemaID,
      roomID: roomID,
      timeStart: '13:00',
      movieID: movieID,
      seatPlan: [],
      date: '2019-04-22'
    },
    {
      cinemaID: cinemaID,
      roomID: roomID,
      timeStart: '18:00',
      movieID: movieID2,
      seatPlan: [],
      date: '2019-04-22'
    }]

    return Screening.deleteMany()
  })
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