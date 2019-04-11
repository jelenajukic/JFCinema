const express = require('express');
const router  = express.Router();

const Movie = require('../models/Movie');

// -> /movie
router.get('/', (req, res, next) => {
  Movie.find({})
  res.render('movie/overview.hbs');
});

module.exports = router;
