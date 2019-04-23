const express = require('express');
const router = express.Router();
const Cinema = require('../models/cinema')
const Screening = require('../models/screening');


router.get('/:id', (req, res, next) => {
  Screening.findOne({
      _id: req.params.id
    })
    .populate('movieID')
    .populate('cinemaID')
    .then(screening => {
      var screeningRoom = screening.roomID
      var x = screening.cinemaID.rooms.forEach(room => {
        if (room._id == screeningRoom) {
          console.log("ok")
          return room.name
        }
      })
      screening.roomName = x
      console.log(x);
      console.log(screening.roomName);
      res.render('tickets/ticket-selection_sp', screening)

    })
    .catch(error => error)
});

//added to get only data for javacripts/ticket-reservation.js
router.get('/:id/data', (req, res, next) => {
  Screening.findOne({
      _id: req.params.id
    })
    .populate('movieID')
    .populate('cinemaID')
    .then(screening => {
      var screeningRoom = screening.roomID
      var x = screening.cinemaID.rooms.forEach(room => {
        if (room._id == screeningRoom) {
          console.log("ok")
          return room.name
        }
      })
      screening.roomName = x
      console.log(x);
      console.log(screening.roomName);
      res.send(screening)

    })
    .catch(error => error)
});


router.post("/:id", (req, res, next) => {
  console.log(req.params.id);
  console.log(req.user)
  Screening.findOne({
      _id: req.params.id,

    })
    .then(screening => screening.seatPlan.find(seat => seat.row == req.body.row && seat.seatNo == req.body.seatNo))
    .then(seat => {
      return seat._id
    })
    .then(seatRef => Screening.findOneAndUpdate({
      _id: req.params.id,
      'seatPlan._id': seatRef
    }, {
      $set: {
        'seatPlan.$.available': false,
        'seatPlan.$.userID': req.user
      }
    }))
})

module.exports = router;