const express = require('express');
const router = express.Router();
const Cinema = require('../models/cinema')
const Screening = require('../models/screening');

// -> /screening (overview)
// router.get('/', (req, res, next) => {


//   Screening.find().populate('movieID')
//     .then(screening => {
//       res.render('tickets/all-screenings', {screening: screening});
//     })
// });

// router.get('/:id/:roomId', (req, res, next) => {

//   Screening.findOne({_id:req.params.id}).populate('movieID').populate('cinemaID')
//   .then(screening=>Cinema.findOne({_id:screening.cinemaID}))
//   .then(cinema=>{ return cinema.rooms.filter(room=>room._id==req.params.roomId)})
//   .then(room =>res.render('tickets/ticket-selection',screening))
//   .catch(error=>console.log(error));

// });

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
      // var x = screening.cinemaID.rooms.find(room => {
      //   console.log(room._id);
      //   console.log(screeningRoom)
      //   room._id===screeningRoom})
      screening.roomName = x
      console.log(x);
      console.log(screening.roomName);
      // res.send(screening)
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
      // var x = screening.cinemaID.rooms.find(room => {
      //   console.log(room._id);
      //   console.log(screeningRoom)
      //   room._id===screeningRoom})
      screening.roomName = x
      console.log(x);
      console.log(screening.roomName);
      res.send(screening)

    })
    .catch(error => error)
});


router.post("/:id", (req, res, next) => {
  console.log(req.params.id);
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
        'seatPlan.$.available': false
      }
    }))
})

module.exports = router;


//  Screening.findOne({_id:req.params.id})
//   .then(screening => console.log(screening))
//   .then(screening=>{ 
//     return screening.seatPlan.filter(seat=>seat.available==true).slice(0,noOfTickets);
//    })
//   .then(reservedSeats=> reservedSeats.forEach(seat => var updatePromise = Model.update({_id: req.params._id, 'seatPlan._id':seat._id}, {"$set": {"value": item.value }});