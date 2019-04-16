const express = require('express');
const router  = express.Router();

const Cinema = require('../models/cinema');
const Screening = require('../models/screening');
const moment = require('moment');

// -> /screening => redirect to cinemas
router.get('/', (req, res, next) => {
  res.redirect('/cinema')
});

// -> /screen/cinemaID/date
router.get('/:id/:date', (req, res, next) => {
  console.log('date params', req.params.date);
  // timezone fucks this up.. 
  // that's why i did GTE and LTE 
  const nextDay = moment(req.params.date).add(1, 'days').format();
  Screening.find({cinemaID: req.params.id, date: {'$gte': req.params.date, '$lte' : nextDay}})
    .populate('movieID') // add the movie details through the movieID
    .then(screenings => { 
      res.send(screenings);
    })
    .catch(err => {
      console.log(err);
    })
})

// -> /screening/cinemaID (more information on cinema)
router.get('/:id', (req, res, next) => { 
  const startdate = moment().format(); //moment().startOf('day');
  // const enddate = moment().add(14, 'days').format(); 
  // console.log(startdate, enddate);
  // Screening.find({cinemaID: req.params.id, date: {'$gte' : startdate, '$lt' : enddate}})
  Screening.find({cinemaID: req.params.id, date: startdate })
    // .populate('movieID') // add the movie details through the movieID
    .then(screenings => {
      // console.log(screenings);
      res.render('screenings/overview');
    })
    .catch(err => {
      console.log(err);
    })
});



module.exports = router;
