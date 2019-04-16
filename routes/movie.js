const express = require('express');
const router  = express.Router();

const Movie = require('../models/movie');

// -> /movie (overview)
router.get('/', (req, res, next) => {
  Movie.find({status: 'active'}).sort({'releaseDate': -1}).limit(10)
    .then(movies => {
      res.render('movie/overview.hbs', {movies: movies});
    })
});

module.exports = router;
