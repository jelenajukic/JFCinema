// Seeds file that remove all cinemas and create 2 new cinemas

const mongoose = require("mongoose");
const Cinema = require("../models/cinema");

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

let cinema = [{
  name: "JF Cinema UT",
  address: {
    name: "Utrechtstraat",
    streetNumber: 80,
    postcode: "3446AP",
    city: "Utrecht"
  },
  workingSchema: [{
    startTime: "09:00",
    endTime: "23:00",
    day: "working days"
  }, {
    startTime: "10:00",
    endTime: "23:00",
    day: "weekend"
  }],
  transport: {
    auto: "yes",
    publicTransport: "yes"
  },
  owner: "Fedde",
  rooms: [{
    rows: 7,
    cols: 10,
    capacity: 70,
    name: 'Room1_UTR',
    screenType: "2D"
  }, {
    rows: 8,
    cols: 10,
    capacity: 80,
    name: 'Room2_UTR',
    screenType: "3D"
  }]
},
{
  name: "JF Cinema Woerden",
  address: {
    name: "Amsterdaamsraat",
    streetNumber: 82,
    postcode: "7678AR",
    city: "Amsterdam"
  },
  workingSchema: [{
    startTime: "10:00",
    endTime: "23:00",
    day: "working days"
  }, {
    startTime: "10:00",
    endTime: "23:00",
    day: "weekend"
  }],
  transport: {
    auto: "yes",
    publicTransport: "yes"
  },
  owner: "Jelena",
  rooms: [{
    rows: 6,
    cols: 10,
    capacity: 60,
    name: 'Room1_AMS',
    screenType: "2D"
  }]
}
]

Cinema.deleteMany()
  .then(() => {
    return Cinema.create(cinema)
  })
  .then(cinemasCreated => {
    console.log(`${cinemasCreated.length} cinema created with the following id:`);
    console.log(cinemasCreated.map(cinema => cinema._id));
  })
  .then(() => {
    // Close properly the connection to Mongoose
    mongoose.disconnect()
  })
  .catch(err => {
    mongoose.disconnect()
    throw err
  })