const mongoose = require("mongoose");
const Screening = require("../models/screening");
const Cinema = require('../models/cinema');
const Movie = require('../models/movie');
const User = require('../models/user');
const moment = require('moment');

// INSTRUCTIONS //
// Create cinema seeds first
// Nr. of Rooms for a cinema has to be > number of movies in total
// Cinema needs at least 2 rooms! (array)

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


var movieArr;
var movieArrCopy;
var cinemaArr;
var userArr;
var rooms;
var screenings = [];
var startdate = moment().startOf('day').format();
var dateArr = createDates(startdate);
var timeArr = ['10:00', '13:00', '16:00', '19:00', '22:00'];

// retreive movie ID
var findMovies = Movie.find({})
  .then(movies => {
    movieArr = movies;
  })
  .catch(err => {
    mongoose.disconnect()
    throw err
  })
// find cinemas
var findCinemas = Cinema.find({})
  .then(cinemas => {
    cinemaArr = cinemas;
  })
  .catch(err => {
    mongoose.disconnect()
    throw err
  })
// find users
var findUsers = User.find({})
  .then(users => {
    userArr = users;
  })
  .catch(err => {
    mongoose.disconnect()
    throw err
  })
// delete current ones
var deleteCurScreen = Screening.deleteMany({})
  .then((x) => {
    console.log(`deleted current screenings`);
  })
  .catch(err => {
    mongoose.disconnect()
    throw err
  })

// after creating arrays and deleting current screenings
Promise.all([findMovies, findCinemas, deleteCurScreen, findUsers])
  .then(() => {
    cinemaArr.forEach(cinema => {
      rooms = cinema.rooms;
      dateArr.forEach(date => {
        timeArr.forEach(time => {
          movieArrCopy = movieArr.slice(); // slice needed. otherwise it is referenced
          rooms.forEach(room => {
            let randomMovie = movieArrCopy[Math.floor(Math.random() * movieArrCopy.length)];
            // 20% chance that we display no movie at this time
            if (Math.random() < 0.2) {
              return
            } else {
              // console.log(`${date}, ${time}, ${movieArrCopy.length}`);
              let randomMovieId = randomMovie._id;
              // console.log(cinema._id, date, time, room._id, randomMovieId);
              screenings.push({
                cinemaID: cinema._id,
                roomID: room._id,
                timeStart: time,
                movieID: randomMovieId,
                seatPlan: createSeatPlan(room),
                date: date
              })
              movieArrCopy.splice(movieArrCopy.indexOf(randomMovie), 1);
            }
          })
        })
      })
    })
    return Screening.create(screenings);
  })
  .then(screeningsCreated => {
    console.log(`${screeningsCreated.length} screenings created`);
    // console.log(screeningsCreated.map(screenings => screenings._id));
  })
  .then(() => {
    // Close properly the connection to Mongoose
    mongoose.disconnect()
  })
  .catch(err => {
    mongoose.disconnect()
    throw err
  })

// Create dates. Today + 13 days (2 weeks)
function createDates(startdate) {
  var i;
  var datesArray = [];
  for (i = 0; i <= 13; i++) { // 0-13 (14 records) 
    datesArray.push(moment(startdate).add(i, 'days').format())
  }
  // console.log(datesArray);
  return datesArray;
};

// create seatplan for the room (same code as in admin.js)
function createSeatPlan(obj) {
  let seatPlan = [];
  for (let i = 0; i < obj.rows; i++) {
    for (let j = 0; j < obj.cols; j++) {
      // 30% chance it is taken already
      if (Math.random() < 0.05) {
        var availOrNot = false;
        var randomUserId = randomUser()
      } else {
        var availOrNot = true;
        var randomUserId = null;
      }
      seatPlan.push({
        row: i + 1,
        seatNo: j + 1,
        available: availOrNot,
        userID: randomUserId
      })
    }
  }
  return seatPlan;
}

// get a random user for the taken seat
function randomUser() {
  var userId = userArr[Math.floor(Math.random() * userArr.length)]._id;
  return userId;
}