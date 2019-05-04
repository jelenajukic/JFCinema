const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/user");
const nodemailer = require('nodemailer');
const templates = require('../templates/welcome-email');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  if (req.user) {
    res.redirect("/profile")
  } else {
    res.render("auth/login", {
      "message": req.flash("error")
    })
  };
});


router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "auth/login",
  failureFlash: true,
  passReqToCallback: true
}));


//ADMIN-LOGIN

router.get("/admin-login", (req, res, next) => {

  res.render("auth/admin-login", {
    "message": req.flash("error")
  });
});


router.post("/admin-login", passport.authenticate("local", {

  successRedirect: "/admin/admin-home",
  failureRedirect: "/auth/admin-login",
  failureFlash: true,
  passReqToCallback: true
}));


router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role || 'USER'; // take role when provided or USER
  const email = req.body.email;
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, password and e-mail" });
    return;
  }

  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        message: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      role: role,
      email: email
    });

    newUser.save()
      .then((newUser) => {
        res.redirect("/auth/login");
        sendWelcomeEmail(newUser);
      })
      .catch(err => {
        console.log(err);
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

var sendWelcomeEmail = (newUser) => {
  console.log(newUser);
  let subject = `Welcome ${newUser.username}, to JFCinema`
  let message =
    `<h2>Dear ${newUser.username} </h2>
      <p>Welcome to JFCinema!</p><br/>`
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'JFCinema2019',
      pass: process.env.GMAIL_PASS
    }
  });
  transporter.sendMail({
    from: '"JF Cinema 👻" <JFCinema2019@gmail.com>',
    to: newUser.email,
    subject: subject,
    text: message,
    html: templates.welcomeEmail(message)
  }, (error, info) => {
    if (error) {
      console.log(error);
    }
  })
}

module.exports = router;