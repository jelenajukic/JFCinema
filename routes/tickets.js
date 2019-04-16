const express = require('express');
const router  = express.Router();
const Cinema = require('../models/cinema')
const Screening = require('../models/screening');

// -> /screening (overview)
router.get('/', (req, res, next) => {

  
  Screening.find().populate('movieID')
    .then(screening => {
      res.render('tickets/all-screenings', {screening: screening});
    })
});

// router.get('/:id/:roomId', (req, res, next) => {

//   Screening.findOne({_id:req.params.id}).populate('movieID').populate('cinemaID')
//   .then(screening=>Cinema.findOne({_id:screening.cinemaID}))
//   .then(cinema=>{ return cinema.rooms.filter(room=>room._id==req.params.roomId)})
//   .then(room =>res.render('tickets/ticket-selection',screening))
//   .catch(error=>console.log(error));
 
// });

// router.get('/:id', (req, res, next) => { 
//   Screening.findOne({_id:req.params.id}).populate('movieID').populate('cinemaID')
//   .then(screening=>res.render('tickets/ticket-selection',screening))
 
// });
router.get('/:id/:roomId', (req, res, next) => { 
  Cinema.findOne({'rooms._id':req.params.roomId})
  .then(cinema=>{return cinema.rooms.find(room=>room._id==req.params.roomId)})
  .then(room=>Screening.findOne({_id:req.params.id}).populate('movieID').populate('cinemaID').then(screening=>{return {screening:screening, roomName:room.name, rows:room.rows, cols:room.cols}}))
  .then(result=>res.render('tickets/ticket-selection',result))
  .catch(error=>console.log(error));
});
module.exports = router;