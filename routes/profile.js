const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cinema = require('../models/cinema')

// -> /profile
router.get('/', (req, res, next) => {

  if (req.user.role == "ADMIN") {
    Cinema.find({}).then(cinemas => res.render('admin/admin-home', {
      cinemas: cinemas,
      user: req.user
    }))

  } else {
    res.render('profile/overview', req.user);
  }

});

// -> /profile/edit
router.get('/edit', (req, res, next) => {
  res.render('profile/edit', req.user);
});

// -> /profile/edit/username
router.get('/edit/username', (req, res, next) => {
  console.log(req.user);
  res.render('profile/editUsername', {
    user: req.user
  });
});

// POST -> /profile/edit/username
router.post('/edit/username', (req, res, next) => {
  // check if it is free
  console.log(req.body);
  User.findOne({
    username: req.body.username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("profile/editUsername", {
        message: "The username already exists",
        user: req.user
      });
      return;
    }
    // if free: update the username
    User.findOneAndUpdate({
        username: req.user.username
      }, {
        username: req.body.username
      })
      .then(result => {
        res.render('profile/edit', req.user);
      })
      .catch(err => {
        console.log(err);
      })
  })
});

module.exports = router;