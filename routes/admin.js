const express = require('express');
const router = express.Router();
const moment = require('moment');

const Cinema = require('../models/cinema')
const Movie = require('../models/movie')
const Screening = require('../models/screening')
// -> /profile
router.get('/admin-home', (req, res, next) => {

  if (req.user.role == "ADMIN") {
    Cinema.find({}).then(cinemas => res.render('admin/admin-home', {
      cinemas: cinemas,
      user: req.user
    }))

  } else {
    res.render('auth/login');
  }

});

router.get('/edit-cinema/:id', (req, res, next) => {
  Cinema.findOne({
      _id: req.params.id
    })
    .then(cinema => res.render('admin/cinema-to-edit', cinema))
    .catch(error => console.log(error));

});

router.post('/edit-cinema/:id', (req, res, next) => {

  console.log(req.body);
  let arrayRooms = []

  if (Array.isArray(req.body.roomName)) {
    for (let i = 0; i < req.body.roomName.length; i++) {
      obj = {
        name: req.body.roomName[i],
        capacity: req.body.capacity[i],
        screenType: req.body.screenType[i]
      }

      arrayRooms.push(obj);
    }
  } else {
    arrayRooms = [{
      name: req.body.roomName,
      capacity: req.body.capacity,
      screenType: req.body.screenType
    }]
  }


  let updatedCinema = {
    name: req.body.name,
    address: {
      name: req.body.streetName,
      streetNumber: req.body.streetNumber,
      postcode: req.body.postcode,
      city: req.body.city
    },
    owner: req.body.owner,


    workingSchema: [{
        startTime: req.body.timeWeekdaysStart,
        endTime: req.body.timeWeekdaysEnd,
        day: "workingday"
      },
      {
        startTime: req.body.timeWeekendStart,
        endTime: req.body.timeWeekendEnd,
        day: "weekend"
      }
    ],
    transport: {
      auto: req.body.auto,
      publicTransport: req.body.publicTransport,
    },
    rooms: arrayRooms

  }

  Cinema.findByIdAndUpdate({
      _id: req.params.id
    }, {
      $set: updatedCinema
    }, {
      new: true
    })
    .then(cinema => res.redirect('/admin/admin-home'))
    .catch(error => console.log(error));

});

router.get('/add-cinema/', (req, res, next) => {
  res.render('admin/cinema-to-add')
});

router.post('/add-cinema/', (req, res, next) => {
  res.render('admin/cinema-to-add')
});

router.get('/add-screening/:id', (req, res, next) => {

  Cinema.findOne({
      _id: req.params.id
    })
    .then(cinema => {
      return cinema
    })
    .then(cinema => Movie.find().then(movie => res.render('admin/screening-to-add', {
        movie: movie,
        cinema: cinema
      }))
      .catch(error => console.log(error)))
    .catch(error => console.log(error));
});

router.post('/add-screening/:id', (req, res, next) => {

  let obj = req.body;
  // correct date format
  obj.date = moment().startOf('day').format();

  obj.cinemaID = req.params.id;

  // let roomId= req.body.roomID
  // console.log(roomId)
  //console.log(obj)
  Cinema.findOne({
      'rooms._id': req.body.roomID
    }).then(cinema => {
      return cinema.rooms.find(room => room._id == req.body.roomID)
    })
    .then(room => {
      return {
        capacity: room.capacity,
        rows: room.rows,
        cols: room.cols
      }
    })
  
    .then(seatPlan => {
      return createSeatPlan(seatPlan)
    })
    .then(seatPlanObj => {
      obj.seatPlan = seatPlanObj;
      return obj
    })
    .then(obj => Screening.create(obj))
    .then(()=>res.redirect('/admin/admin-home'))
    .catch(error=>console.log(error))

  // Screening.create(obj)
  // .then(()=>res.redirect('/admin/admin-home'))
  // .catch(error=>console.log(error));


  function createSeatPlan(obj) {
    let seatPlan = [];
    for (let i = 0; i < obj.rows; i++) {
      for (let j = 0; j < obj.cols; j++) {
        seatPlan.push({
          row: i + 1,
          seatNo: j + 1,
          available:true
      
        })
      }
    }
    return seatPlan;
  }

});



router.get('/movie', (req, res, next) => {
  Movie.find({})
    .then(movies => res.send(movies))
    .catch(error => console.log("error"))
});

router.get('/room/:id/:date', (req, res, next) => {
  Screening.find({
      'roomID': req.params.id,
      'date': req.params.date
    })
    .then(screenings => res.send(screenings))
});

module.exports = router;