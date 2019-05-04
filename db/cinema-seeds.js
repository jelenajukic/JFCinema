// Seeds file that remove all cinemas and create 2 new cinemas

// node db/user-seeds.js && node db/cinema-seeds.js && node db/movie-seeds.js && node db/screening-seeds.js


const mongoose = require("mongoose");
const Cinema = require("../models/cinema");

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

let cinema = [{
  name: "JF Cinema UT",
  address: {
    name: "Utrechtstraat",
    streetNumber: 80,
    postcode: "3446AP",
    city: "Utrecht"
  },
  location: {
    coordinates: [5.088090, 52.087210],
    type: 'Point'
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
    auto: "Parking during the day is 2.50 an hour. After 21:00 parking is free",
    publicTransport: "Take bus 28 from central station or walk 5 minutes from station Leidsche Rijn Utrecht"
  },
  owner: "Fedde",
  rooms: [{
    rows: 7,
    cols: 10,
    capacity: 70,
    name: 'Room 1',
    screenType: "2D"
  }, {
    rows: 8,
    cols: 10,
    capacity: 80,
    name: 'Room 2',
    screenType: "3D"
  }]
},
{
  name: "JF Cinema Woerden",
  address: {
    name: "Woerdense straat",
    streetNumber: 82,
    postcode: "7678AR",
    city: "Woerden"
  },
  location: {
    coordinates: [4.884459, 52.086216],
    type: 'Point'
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
    auto: "Park at P+R Woerden for 3 euros",
    publicTransport: "Take bus 12 from station Woerden"
  },
  owner: "Jelena",
  rooms: [{
    rows: 6,
    cols: 10,
    capacity: 60,
    name: 'Room 1',
    screenType: "2D"
  }, {
    rows: 12,
    cols: 10,
    capacity: 120,
    name: 'Room 2',
    screenType: "2D"
  }]
},
{
  name: "JF Cinema Rotterdam",
  address: {
    name: "van Ghentstraat",
    streetNumber: 1,
    postcode: "3012EA",
    city: "Rotterdam"
  },
  location: {
    coordinates: [4.476087, 51.921610],
    type: 'Point'
  },
  workingSchema: [{
    startTime: "10:00",
    endTime: "23:30",
    day: "working days"
  }, {
    startTime: "10:00",
    endTime: "23:00",
    day: "weekend"
  }],
  transport: {
    auto: "Free parking below the cinema",
    publicTransport: "Take metro 3 from central station. Or take a 10 minute walk from central station"
  },
  owner: "Jelena",
  rooms: [{
    rows: 9,
    cols: 10,
    capacity: 90,
    name: 'Room 1',
    screenType: "2D"
  }, {
    rows: 12,
    cols: 10,
    capacity: 120,
    name: 'Room 2',
    screenType: "2D"
  }]
},
{
  name: "JF Cinema The Hague",
  address: {
    name: "Rederserf",
    streetNumber: 1,
    postcode: "2586KM",
    city: "The Hague"
  },
  location: {
    coordinates: [4.4279336, 52.111986],
    type: 'Point'
  },
  workingSchema: [{
    startTime: "10:00",
    endTime: "23:30",
    day: "working days"
  }, {
    startTime: "10:00",
    endTime: "23:00",
    day: "weekend"
  }],
  transport: {
    auto: "Free parking at P+R",
    publicTransport: "Take bus 33 from central station. Or take a 10 minute walk from the beach"
  },
  owner: "Fedde",
  rooms: [{
    rows: 9,
    cols: 10,
    capacity: 90,
    name: 'Room 1',
    screenType: "2D"
  }, {
    rows: 16,
    cols: 10,
    capacity: 160,
    name: 'Room 2',
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