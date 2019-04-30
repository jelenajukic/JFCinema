const express = require('express');
const router = express.Router();
const Movie = require('../models/movie')

/* GET home page */
router.get('/', (req, res, next) => {
  Movie.find({status: 'active'})
    .then(movies => {
      res.render('index', {movies: movies});
    })
    .catch(err => {
      res.render('index');
      console.log(err);
    })
});

router.get('/about', (req, res, next) => {
  res.render('about');
})

router.get('/contact', (req, res, next) => {
  res.render('contact');
})

module.exports = router;
