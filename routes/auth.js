const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
// var passwordValidator = require('password-validator');
// var passSchema = new passwordValidator();


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  });
});


router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/auth/login",
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
  // passSchema
  //   .is().min(8) // Minimum length 8
  //   .is().max(100) // Maximum length 100
  //   .has().uppercase() // Must have uppercase letters
  //   .has().lowercase() // Must have lowercase letters
  //   .has().digits() // Must have digits
  //   .has().not().spaces() // Should not have spaces
  //   .has().symbols()
  //   .is().not().oneOf(['Passw0rd', 'Password123', username]); // Blacklist these values

  // let listArray = passSchema.validate(password, {
  //   list: true
  // })

  // if(listArray.length!=0){
  //   res.render("auth/signup", {
  //     message: "Password is not strong enough. Valid passwor exp: MyCat345@"
  //   });
  //   return;
  // }


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
    .then(() => {
      res.redirect("/auth/login");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;