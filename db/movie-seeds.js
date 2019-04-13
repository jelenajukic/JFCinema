const mongoose = require("mongoose"); 
const Movie = require('../models/Movie');


mongoose
  .connect('mongodb://localhost/fjcinema', {
    useNewUrlParser: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

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
 
// Seeds movie
//  Movie.create(movies)
  // -> If you want to delete the current movies, use this instead of Movie.create(movies)
 Movie.deleteMany()
    .then(() => {
      console.log('deleted movies');
      return Movie.create(movies);
    })
  .then(moviesCreated => {
    console.log(`${moviesCreated.length} movies created with the following titles:`);
    console.log(moviesCreated.map(u => u.title));
    mongoose.disconnect();
    console.log('DB: connection closed')
  })
  .catch(err => {
    mongoose.disconnect();
    console.log('DB connection closed with error: ', err);
  })
 