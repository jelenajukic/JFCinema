const express = require('express');
const router  = express.Router();

const Cinema = require('../models/cinema');

// -> /movie (overview)
router.get('/', (req, res, next) => {
  Cinema.find({})
    .then(cinemas => {
      res.render('cinema/overview.hbs', {cinemas: cinemas});
    })
});

// -> /movie/ID (more information on cinema)
router.get('/:id', (req, res, next) => {
  Cinema.findById({_id: req.params.id})
    .then(cinema => {
      console.log(cinema);
      res.render('cinema/details', {cinema: cinema});
    })
});

module.exports = router;
