const express = require('express');
const router = express.Router();
const User = require('../models/User');

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// -> /profile
router.get('/', (req, res, next) => {
  res.render('profile/overview', { user: req.user });
});

// -> /profile/edit
router.get('/edit', (req, res, next) => {
  res.render('profile/edit', { user: req.user });
});

//==== EDIT USERNAME ====//

// -> /profile/edit/username
router.get('/edit/username', (req, res, next) => {
  res.render('profile/edit-username', { user: req.user });
});

// POST -> /profile/edit/username
router.post('/edit/username', (req, res, next) => {
  // check if it is free
  console.log(req.body);
  User.findOne({ username: req.body.username }, "username", (err, user) => {
    if (user !== null) {
      res.render("profile/edit-username", { message: "The username already exists", user: req.user });
      return;
    }
    // if free: update the username
    User.findOneAndUpdate({ username: req.user.username }, { username: req.body.username }, { new: true })
      .then(result => {
        // option {new: true} to return new updated user. Sending result as input for page to show new username
        res.render('profile/edit', { messagePos: `Correctly changed username to ${result.username}`, user: result });
      })
      .catch(err => {
        console.log(err);
      })
  })
});

// ==== EDIT PASSWORD ==== //

// -> /profile/edit/password
router.get('/edit/password', (req, res, next) => {
  res.render('profile/edit-password', { user: req.user });
});

// POST -> /profile/edit/password
router.post('/edit/password', (req, res, next) => {
  // check password
  bcrypt.compare(req.body.password, req.user.password)
    // update password
    .then(result => {
      if (!result) { throw new Error('Password incorrect') } // if false (incorrect password) throw error
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(req.body.newPassword, salt);
      return User.findOneAndUpdate({ username: req.user.username }, { password: hashPass })
    })
    // redirect user
    .then(updatedUser => {
      res.render('profile/edit', { messagePos: "Correctly changed password!", user: req.user });
    })
    // catch error
    .catch(err => {
      res.render("profile/edit-password", { message: "Incorrect password", user: req.user });
      // log if error != password incorrect
      if (err.message !== 'Password incorrect') { console.log(err) };
    })
});

// ==== EDIT E-MAIL ==== //

// -> /profile/edit/email
router.get('/edit/email', (req, res, next) => {
  res.render('profile/edit-email', { user: req.user });
});

// POST -> /profile/edit/email
router.post('/edit/email', (req, res, next) => {
  // check if it is free  
  User.findOne({ email: req.body.email })
    .then(result => { 
      if (result !== null) { throw new Error('email already exists') }
      return User.findOneAndUpdate({ username: req.user.username }, { email: req.body.email }, { new: true });
    })
    .then(result => {
      // option {new: true} to return new updated user. Sending result as input for page to show new e-mail
      res.render('profile/edit', { messagePos: `Correctly changed e-mail to ${result.email}`, user: result });
    })
    .catch(err => {
      res.render("profile/edit-email", { message: "This e-mail already exists for a user", user: req.user });
      // log if error != email already exists
      if (err.message !== 'email already exists') { console.log(err) };
    })
});

module.exports = router;
