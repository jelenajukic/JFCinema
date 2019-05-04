const express = require('express');
const router = express.Router();
const moment = require('moment');
const axios = require('axios');

const Cinema = require('../models/cinema')
const Movie = require('../models/movie')
const Screening = require('../models/screening')

// -> /admin/
router.get('/', (req, res, next) => {
  res.redirect('/admin/admin-home');
})

// -> /admin/admin-home
router.get('/admin-home', (req, res, next) => {
  if (req.user.role === "ADMIN") {
    Cinema.find({})
      .then(cinemas => res.render('admin/admin-home', {
        cinemas: cinemas,
        user: req.user
      }))
      .catch(err => {
        console.log(err);
      })
  } else {
    res.render('auth/login');
  }
});

// -----------------------
// Admin - Cinema 
// -----------------------

// -> /admin/edit-cinema/:cinemaID
router.get('/edit-cinema/:id', (req, res, next) => {
  if (req.user.role === "ADMIN") {
    Cinema.findOne({
      _id: req.params.id
    })
      .then(cinema => {
        res.render('admin/cinema-to-edit', cinema)
      })
      .catch(error => {
        console.log(error)
      });
  } else {
    res.render('auth/login');
  }
});

// -> (POST) /admin/edit-cinema/:cinemaID
router.post('/edit-cinema/:id', (req, res, next) => {
  if (req.user.role === "ADMIN") {
    let arrayRooms = []
    // multiple rooms
    if (Array.isArray(req.body.roomName)) {
      for (let i = 0; i < req.body.roomName.length; i++) {
        obj = {
          _id: req.body.roomID[i],
          name: req.body.roomName[i],
          // name: req.body.roomName[i],
          capacity: Number(req.body.cols[i]) * Number(req.body.rows[i]),
          cols: req.body.cols[i],
          rows: req.body.rows[i],
          screenType: req.body.screenType[i]
        }
        arrayRooms.push(obj);
      }
      // one room
    } else {
      arrayRooms = [{
        _id: req.body.roomID,
        name: req.body.roomName,
        capacity: Number(req.body.cols) * Number(req.body.rows),
        cols: req.body.cols,
        rows: req.body.rows,
        screenType: req.body.screenType
      }]
    }
    // create data for updating cinema
    let updatedCinema = {
      name: req.body.name,
      address: {
        name: req.body.streetName,
        streetNumber: req.body.streetNumber,
        postcode: req.body.postcode,
        city: req.body.city
      },
      owner: req.body.owner,
      workingSchema: [{
        startTime: req.body.timeWeekdaysStart,
        endTime: req.body.timeWeekdaysEnd,
        day: "workingday"
      },
      {
        startTime: req.body.timeWeekendStart,
        endTime: req.body.timeWeekendEnd,
        day: "weekend"
      }
      ],
      transport: {
        auto: req.body.auto,
        publicTransport: req.body.publicTransport,
      },
      rooms: arrayRooms
    }
    // update the cinema
    Cinema.findByIdAndUpdate({
      _id: req.params.id
    }, {
        $set: updatedCinema
      }, {
        new: true
      })
      .then(cinema => {
        res.redirect('/admin/admin-home')
      })
      .catch(error => {
        console.log(error)
      });
  } else { // not logged in as ADMIN
    res.render('auth/login');
  }
});

router.get('/add-cinema/', (req, res, next) => {
  res.render('admin/cinema-to-add')
});

router.post('/add-cinema/', (req, res, next) => {
  let arrayRooms = [];
  let location = {
    type: 'Point',
    coordinates: [req.body.longitude, req.body.latitude]
  };
  // multiple rooms
  if (Array.isArray(req.body.roomName)) {
    for (let i = 0; i < req.body.roomName.length; i++) {
      obj = {
        name: req.body.roomName[i],
        capacity: Number(req.body.cols[i]) * Number(req.body.rows[i]),
        cols: req.body.cols[i],
        rows: req.body.rows[i],
        screenType: req.body.screenType[i],

      }
      arrayRooms.push(obj);
    }
    // one room
  } else {
    arrayRooms = [{
      name: req.body.roomName,
      capacity: Number(req.body.cols) * Number(req.body.rows),
      cols: req.body.cols,
      rows: req.body.rows,
      screenType: req.body.screenType,

    }]
  }

  let cinemaToCreate = {
    name: req.body.name,
    address: {
      name: req.body.streetName,
      streetNumber: req.body.streetNumber,
      postcode: req.body.postcode,
      city: req.body.city
    },
    location: location,
    owner: req.body.owner,
    workingSchema: [{
      startTime: req.body.timeWeekdaysStart,
      endTime: req.body.timeWeekdaysEnd,
      day: "workingday"
    },
    {
      startTime: req.body.timeWeekendStart,
      endTime: req.body.timeWeekendEnd,
      day: "weekend"
    }
    ],
    transport: {
      auto: req.body.auto,
      publicTransport: req.body.publicTransport,
    },
    rooms: arrayRooms
  }
  Cinema.create(cinemaToCreate)
    .then(cinema => {
      res.redirect('/admin/admin-home')
    })
    .catch(error => {
      console.log(error)
    });

});

// -----------------------
// Admin - Screenings 
// -----------------------

// /Review
router.get('/add-screening/:id', (req, res, next) => {
  if (req.user.role === "ADMIN") {
    Cinema.findOne({
      _id: req.params.id
    })
      .then(cinema => {
        return cinema
      })
      .then(cinema => Movie.find({ status: 'active' }).then(movie => res.render('admin/screening-to-add', {
        movie: movie,
        cinema: cinema
      }))
        .catch(error => console.log(error)))
      .catch(error => console.log(error));
  } else {
    res.render('auth/login');
  }
});

router.post('/add-screening/:id', (req, res, next) => {
  let obj = req.body;
  // correct date format
  obj.date = moment.utc(obj.date).startOf('day').format();
  obj.cinemaID = req.params.id;
  Cinema.findOne({
    'rooms._id': req.body.roomID
  })
    .then(cinema => {
      return cinema.rooms.find(room => room._id == req.body.roomID)
    })
    .then(room => {
      return {
        capacity: room.capacity,
        rows: room.rows,
        cols: room.cols,
      }
    })
    .then(seatPlan => {
      return createSeatPlan(seatPlan, req.body.price)
    })
    .then(seatPlanObj => {
      obj.seatPlan = seatPlanObj;
      return obj
    })
    .then(obj => Screening.create(obj))
    .then(() => res.redirect('/admin/admin-home'))
    .catch(error => console.log(error))

  // Function create seatplan /Review (placement)
  function createSeatPlan(obj, price) {
    let seatPlan = [];
    for (let i = 0; i < obj.rows; i++) {
      for (let j = 0; j < obj.cols; j++) {
        seatPlan.push({
          row: i + 1,
          seatNo: j + 1,
          available: true,
          price: price
        })
      }
    }
    return seatPlan;
  }
});

// -----------------------
// Admin - Movies 
// -----------------------

// -> /admin/add-movie
router.get('/add-movie', (req, res, next) => {
  if (req.user.role === "ADMIN") {
    Movie.find({})
      .then(movies => {
        res.render('admin/movie-to-add', movies)
      })
      .catch(error => {
        console.log("error")
      })
  } else {
    res.render('auth/login');
  }
});

// -> (POST) /admin/add-movie
router.post('/add-movie', (req, res, next) => {
  if (req.user.role === "ADMIN") {
    req.body.releaseDate = moment.utc(req.body.releaseDate).startOf('day').format();
    Movie.create(req.body)
      .then(movieCreated => {
        console.log('movie added: ', movieCreated.title);
        res.redirect('/admin/admin-home');
      })
      .catch(err => {
        console.log(err);
        res.redirect('/admin/admin-home');
      })
  } else {
    res.render('auth/login');
  }
})

// -> axios call to prefill add movie form with the provided title
router.get('/add-movie/check', (req, res, next) => {
  var titleEnc = encodeURI(req.query.title);
  var movieObject;
  axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.KEY_MOVIE_DB}&language=en-US&query=${titleEnc}&page=1&include_adult=false`)
    .then(movie => {
      movieObject = movie.data.results[0];
      // find a video with the movie ID
      return axios.get(`https://api.themoviedb.org/3/movie/${movieObject.id}/videos?api_key=${process.env.KEY_MOVIE_DB}&language=en-US`)
    })
    .then(movieVid => {
      var findUrl = movieVid.data.results.find(movie => movie.site.toLowerCase() == "youtube" && movie.type.toLowerCase() == "trailer")
      movieObject.videoUrl = findUrl.key; //`https://www.youtube.com/watch?v=
      res.send(movieObject);
    })
    .catch(err => {
      console.log(err);
      res.send("")
    })
})

// -> /admin/edit-movie
router.get('/edit-movie', (req, res, next) => {
  if (req.user.role === "ADMIN") {
    Movie.find({})
      .then(movies => {
        res.render('admin/movie-to-edit', { movies: movies })
      })
      .catch(error => {
        console.log("error")
      })
  } else {
    res.render('auth/login');
  }
});

// -> (POST) /admin/add-movie
router.post('/edit-movie', (req, res, next) => {
  if (req.user.role === "ADMIN") {
    req.body.releaseDate = moment.utc(req.body.releaseDate).startOf('day').format();
    Movie.findByIdAndUpdate({ _id: req.body.movieId }, { $set: req.body })
      .then(movieUpdated => {
        console.log('movie updated: ', movieUpdated.title);
        res.redirect('/admin/admin-home');
      })
      .catch(err => {
        console.log(err);
        res.redirect('/admin/admin-home');
      })
  } else {
    res.render('auth/login');
  }
})

// -> axios call to prefill EDIT movie with current details
router.get('/edit-movie/check', (req, res, next) => {
  Movie.findById(req.query.id)
    .then(movie => {
      res.send(movie);
    })
    .catch(err => {
      console.log(err);
      res.send("")
    })
})

// Is this still used? /FT
router.get('/room/:id/:date', (req, res, next) => {
  Screening.find({
    'roomID': req.params.id,
    'date': req.params.date
  })
    .then(screenings => res.send(screenings))
});

module.exports = router;