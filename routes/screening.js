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

// -> /screen/cinemaID/date
router.get('/:id/:date', (req, res, next) => {
  // const nextDay = moment(req.params.date).add(1, 'days').format();
  Screening.find({cinemaID: req.params.id, date: req.params.date})
  // Screening.find({cinemaID: req.params.id, date: {'$gte': req.params.date, '$lte' : nextDay}})
    .sort({movieID: 1, timeStart: 1})
    .populate('movieID') // add the movie details through the movieID
    // .populate('roomID')
    .then(screenings => { 
      // console.log(screenings)
      res.send(screenings);
    })
    .catch(err => {
      console.log(err);
    })
})



// -> /screening/cinemaID (more information on cinema)
// router.get('/:id', (req, res, next) => { 
//   res.render('screenings/overview');
  // const startdate = moment().format(); //moment().startOf('day');
  // // const enddate = moment().add(14, 'days').format();  
  // // Screening.find({cinemaID: req.params.id, date: {'$gte' : startdate, '$lt' : enddate}})
  // Screening.find({cinemaID: req.params.id, date: startdate })
  //   // .populate('movieID') // add the movie details through the movieID
  //   .then(screenings => {
  //     // console.log(screenings);
  //     res.render('screenings/overview');
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   })
// });



module.exports = router;
