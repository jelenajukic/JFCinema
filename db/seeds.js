// To execute this seed, run from the root of the project
// $ node db/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const User = require("../models/User");
const Movie = require('../models/Movie');


mongoose
  .connect('mongodb://localhost/fjcinema', { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

let users = [
  {
    username: "Fedde",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    email: "fedde@fedde.nl",
    role: "USER"
  },
  {
    username: "Fedde-admin",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    email: 'fedde@feddeadmin.nl',
    role: 'ADMIN'
  },
  {
    username: "Jelena",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    email: 'Jelena@jelena.nl',
    role: 'USER'
  },
  {
    username: "Jelena-admin",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    email: 'Jelena@jelenaadmin.nl',
    role: 'ADMIN'
  }
]

// api: https://www.themoviedb.org/movie/8587-the-lion-king?language=en-US
// omdb is not free anymore

let movies = [
  {
    title: 'The Lion King',
    plot: 'Will Simba become the new king?',
    releaseDate: '2000-01-01',
    genre: ['animation', 'adventure', 'disney'],
    rating: 9.0,
    imageUrl: 'https://www.barakashop.co.za/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/l/i/lion_king_poster.jpg',
    status: 'inactive'
  }, {
    title: 'Captain Marvel',
    plot: 'Can she defeat evil?',
    releaseDate: '2019-04-01',
    genre: ['superheroes', 'adventure', 'marvel'],
    rating: 8.0,
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTE0YWFmOTMtYTU2ZS00ZTIxLWE3OTEtYTNiYzBkZjViZThiXkEyXkFqcGdeQXVyODMzMzQ4OTI@._V1_.jpg',
    status: 'active'
  }, {
    title: 'The green book',
    plot: 'What will the crowd favor? The talent of this musician? Or will they be trapped in their own racism',
    releaseDate: '2018-04-22',
    genre: ['drama', 'adventure', 'arthouse', 'true story'],
    rating: 8.2,
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BYzIzYmJlYTYtNGNiYy00N2EwLTk4ZjItMGYyZTJiOTVkM2RlXkEyXkFqcGdeQXVyODY1NDk1NjE@._V1_.jpg',
    status: 'active'
  }, {
    title: 'Bohemian Rhapsody',
    plot: 'What was Freddy like? Did he enjoy performing or had no choice?',
    releaseDate: '2018-09-22',
    genre: ['drama', 'true story', 'music'],
    rating: 7.8,
    imageUrl: 'https://www.voto10.it/cinema/uploads/foto/bohemian-rapsody-poster.jpg',
    status: 'active'
  }
]


// var userCreate = User.create(users)
  // -> If you want to delete the current users, use this instead of User.create(users)
  var userCreate = User.deleteMany()
    .then(() => {
      return User.create(users)
    })
  .then(usersCreated => {
    console.log(`${usersCreated.length} users created with the following ids:`);
    console.log(usersCreated.map(u => u._id));
  })
  .catch(err => {
    console.log(err);
  })

// Seeds movie
// var movieCreate = Movie.create(movies)
  // -> If you want to delete the current movies, use this instead of Movie.create(movies)
  var movieCreate = Movie.deleteMany()
    .then(() => {
      return Movie.create(movies)
    })
  .then(moviesCreated => {
    console.log(`${moviesCreated.length} movies created with the following titles:`);
    console.log(moviesCreated.map(u => u.title));
  })
  .catch(err => {
    console.log(err);
  })

// -- Close connection -- //
// promise all to close connections
Promise.all([movieCreate, userCreate])
  .then(() => {
    mongoose.disconnect();
    console.log('DB: connection closed')
  })
  .catch(err => {
    mongoose.disconnect();
    console.log('DB connection closed with error: ', err);
  })