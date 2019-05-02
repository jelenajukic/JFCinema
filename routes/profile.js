const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Screening = require('../models/screening')
const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
  // set destination for the images
  destination: function (req, file, cb) {
    cb(null, 'public/profile-pictures')
  },
  // add the extension to the file name (default is without extension)
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage, fileFilter: function (req, file, callback) {
    // check file extension = image
    var ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
  }
})



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
  User.findOne({ username: req.body.username })
    .then(user => {
      if (user !== null) { throw new Error('username already exists') };
      return User.findOneAndUpdate({ username: req.user.username }, { username: req.body.username }, { new: true })
    })
    // if free: update the username 
    .then(result => {
      // option {new: true} to return new updated user. Sending result as input for page to show new username
      res.render('profile/edit', { messagePos: `Correctly changed username to ${result.username}`, user: result });
    })
    .catch(err => {
      res.render("profile/edit-username", { message: "The username already exists", user: req.user });
      // log if error != username already exists
      if (err.message !== 'username already exists') { console.log(err) };
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

// ==== UPLOAD PROFILE PICTURE ==== //
router.post('/upload', upload.single('profile-image'), (req, res, next) => {
  console.log('loaded picture?');
  console.log(req.file);
  res.render('profile/overview', { user: req.user });
});

// === TICKET OVERVIEW IN PROFILE === //
// router.get('/tickets', (req, res, next) => {
//   Screening.find({ 'seatPlan.userID': req.user._id })
//     .sort({ 'date': -1 })
//     .populate('movieID')
//     .then(tickets => {
//       tickets.map(ticket => {
//         // ticket.seatPlanNew = ticket.seatPlan.filter(element => { return req.user._id == element.userID })
//         // console.log(`user: ${req.user._id} | element: ${element.userID}`)
//         // console.log(ticket.seatPlanNew)
//         return ticket.seatPlan = ticket.seatPlan.filter(seatPlan => seatPlan.userID == req.user._id)

//         // // old syntax
//         // var check = function(seat){
//         //     return seat.userID == req.user._id;
//         // }

//         // return ticket.seatPlan.filter(check);


//       })
//       // var seats = tickets.seatPlan.filter(seatPlan => seatPlan.userID == req.user._id)
//       // console.log(seats);
//       console.log(tickets[0]);
//       console.log(tickets[0].seatPlanNew);
//       res.render('profile/tickets', { tickets: tickets })
//     })
// })

router.get('/tickets', (req, res, next) => {
  Screening.aggregate(
    // change seatplan array to seperate rows
    [{ $unwind: "$seatPlan" },
    // only take the seatplan objects that belong to this user
    { $match: { "seatPlan.userID": req.user._id } }
      // populate the movie details (not possible with .populate due to aggregate)
      , { $lookup: { from: 'movies', localField: 'movieID', foreignField: '_id', as: 'movieDetails' } }
      // change the array of movieDetails to an object with unwind
      , { $unwind: '$movieDetails' }
      // make it an array again
      , {
      $group: {
        _id: "$_id",
        seatPlan: { $push: "$seatPlan" },
        movieDetails: { $first: '$movieDetails' },
        date: { $first: '$date' },
        timeStart: { $first: '$timeStart' },
        nrTicket: { $sum: 1 }
      }
    }
    , { "$sort": { "date": -1 } }
    ]
  )
    .then(tickets => {
      console.log(req.user._id)
      res.render('profile/tickets', { tickets: tickets })
    })
})

module.exports = router;
