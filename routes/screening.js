const express = require('express');
const router  = express.Router();

const Cinema = require('../models/cinema');
const Screening = require('../models/screening');
const moment = require('moment');

// -> /screening => redirect to cinemas
router.get('/', (req, res, next) => {
  res.redirect('/cinema')
});

// -> /screening/cinemaID (more information on cinema)
router.get('/:id', (req, res, next) => {    
  Cinema.findOne({_id: req.params.id}) 
    .then(cinema => {  
      res.render('screenings/overview', {cinema: cinema});
    })
    .catch(err => {
      console.log(err);
    })
});

// -> /screen/cinemaID/date (Axios)
router.get('/:id/:date', (req, res, next) => { 
  Screening.find({cinemaID: req.params.id, date: {$gte: req.params.date, $lt: req.params.date}}) 
    .sort({movieID: 1, timeStart: 1})
    .populate('movieID') // add the movie details through the movieID 
    .then(screenings => {  
      res.send(screenings);
    })
    .catch(err => {
      console.log(err);
    })
})

module.exports = router;
