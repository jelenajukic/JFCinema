const mongoose = require("mongoose"); 
const Movie = require('../models/movie');


mongoose
  .connect(process.env.MONGODB_URI, {
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
    title: 'The Green Book: Guide to Freedom',
    plot: 'In the 1930s, a black postal carrier from Harlem named Victor Green published a book that was part travel guide and part survival guide. It was called The Negro Motorist Green Book, and it helped African-Americans navigate safe passage across America well into the 1960s. Explore some of the segregated nation\'s safe havens and notorious "sundown towns" and witness stories of struggle and indignity as well as opportunity and triumph.',
    releaseDate: '2019-02-24T22:00:00.000+00:00',
    // genre: ['drama', 'adventure', 'arthouse', 'true story'],
    rating: 7.5,
    imageUrl: 'http://image.tmdb.org/t/p/w185//9JQmPWE8ZCGx6D3Z2ZIy1MU6ZSU.jpg',
    videoUrl: 'QkZxoko_HC0',
    status: 'active'
  }, {
    title: 'Aquaman',
    plot: "Once home to the most advanced civilization on Earth, Atlantis is now an underwater kingdom ruled by the power-hungry King Orm. With a vast army at his disposal, Orm plans to conquer the remaining oceanic people and then the surface world. Standing in his way is Arthur Curry, Orm's half-human, half-Atlantean brother and true heir to the throne.",
    releaseDate: '2018-12-06T22:00:00.000+00:00',
    // genre: 
    rating: 6.8,
    imageUrl: 'http://image.tmdb.org/t/p/w185//5Kg76ldv7VxeX9YlcQXiowHgdX6.jpg',
    videoUrl: 'WDkg3h8PCVU',
    status: 'active'
}, {
  title: 'Bohemian Rhapsody',
  plot: `Singer Freddie Mercury, guitarist Brian May, drummer Roger Taylor and bass guitarist John Deacon take the music world by storm when they form the rock 'n' roll band Queen in 1970. Hit songs become instant classics. When Mercury's increasingly wild lifestyle starts to spiral out of control, Queen soon faces its greatest challenge yet – finding a way to keep the band together amid the success and excess.`,
  releaseDate: '2018-10-23T22:00:00.000+00:00',
  // genre: 
  rating: 8.1,
  imageUrl: 'http://image.tmdb.org/t/p/w185//lHu1wtNaczFPGFDTrjCSzeLPTKN.jpg',
  videoUrl:  'mP0VHJYFOAU',
  status: 'active'
}, {
  title: 'Avatar',
  plot: `In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.`,
  releaseDate: '2009-12-09T22:00:00.000+00:00',
  // genre: 
  rating: 7.4,
  imageUrl: 'http://image.tmdb.org/t/p/w185//kmcqlZGaSh20zpTbuoF0Cdn07dT.jpg',
  videoUrl: '6ziBFh3V1aM',
  status: 'active'
}, {
  title: 'A Star Is Born',
  plot: `Seasoned musician Jackson Maine discovers — and falls in love with — struggling artist Ally. She has just about given up on her dream to make it big as a singer — until Jack coaxes her into the spotlight. But even as Ally's career takes off, the personal side of their relationship is breaking down, as Jack fights an ongoing battle with his own internal demons.`,
  releaseDate: '2018-10-02T22:00:00.000+00:00',
  // genre: 
  rating: 7.5,
  imageUrl: 'http://image.tmdb.org/t/p/w185//wrFpXMNBRj2PBiN4Z5kix51XaIZ.jpg',
  videoUrl: 'nSbzyEJ8X9E',
  status: 'active'
}, 
]
 
// {
//   title:
//   plot:
//   releaseDate:
//   // genre: 
//   rating:
//   imageUrl:
//   status: 
// }, 

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
 