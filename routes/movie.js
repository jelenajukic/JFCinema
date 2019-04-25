const express = require('express');
const router  = express.Router();

const Movie = require('../models/movie');

// -> /movie (overview)
router.get('/', (req, res, next) => {
  Movie.find({status: 'active'}).sort({'releaseDate': -1}).limit(10)
    .then(movies => {
      res.render('movie/overview.hbs', {movies: movies});
    })
    .catch(err => {
      console.log(err);
    })
});

// -> /movie/:id
router.get('/:id', (req, res, next) => {
  Movie.findById(req.params.id)
    .then(movie => {
      res.render('movie/movie-details.hbs', movie);
    })
    .catch(err => {
      console.log(err);
    })
})

module.exports = router;
