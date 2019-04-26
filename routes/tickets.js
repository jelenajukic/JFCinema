const express = require('express');
const router = express.Router();
const Cinema = require('../models/cinema')
const Screening = require('../models/screening');
const nodemailer = require("nodemailer");

router.get('/confirmation', (req, res, next) => {
  console.log("open it")
  res.render('tickets/confirmation')
});

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
    .then(result => console.log(result))
    .catch(error => console.log(error))
})



/**
 * Send e-mail route
 */
router.post('/:id/send-email', (req, res, next) => {
  let messageSeats = "";
  for (var i = 0; i < req.body.reservation.length; i++) {
    messageSeats += `Seat:${req.body.reservation[i].seatNo} in Row: ${req.body.reservation[i].row} //`
  }


  let subject = `Reservation for ${req.user.username} in JFCinema - ${req.body.screening.movieID.title}`

  console.log(subject)
  let message = `Dear ${req.user.username} thanks for your reservation.
  
  Your reservation :
  
  ${messageSeats}`;

  console.log(message);
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'JFCinema2019',
      pass: process.env.GMAIL_PASS
    }
  });
  transporter.sendMail({
    from: '"JF Cinema - movie reservation 👻" <JFCinema2019@gmail.com>',
    to: req.user.email,
    subject: subject,
    text: message,
    html: `<b>${message}</b>`
  })
    .then(info => {
      debugger
      res.redirect('/tickets/confirmation')
      //res.render('cinema/details')
      console.log("Works!")
      // console.log(info)

    })
    .catch(error => console.log(error));
});




module.exports = router;