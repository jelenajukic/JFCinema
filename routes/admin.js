const express = require('express');
const router = express.Router();
const Cinema = require('../models/cinema')

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

  if(Array.isArray(req.body.roomName)){
    for (let i = 0; i < req.body.roomName.length; i++) {
      obj = {
        name: req.body.roomName[i],
        capacity: req.body.capacity[i],
        screenType: req.body.screenType[i]
      }
  
      arrayRooms.push(obj);
    }
  }else {
    arrayRooms=[{
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
    },
    owner: req.body.owner,
    city: req.body.city,

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
    .then(cinema => res.redirect('/profile'))
    .catch(error => console.log(error));

});

router.get('/add-cinema/', (req, res, next) => {
  res.render('admin/cinema-to-add')
});

router.post('/add-cinema/', (req, res, next) => {
  res.render('admin/cinema-to-add')
});





module.exports = router;