var URL = window.location.href;

// -- START document ready -- //
document.addEventListener('DOMContentLoaded', function () {
  var inputEditMovie = document.getElementById('inputEditMovie')

  var buttonEditMovie = document.getElementById('buttonEditMovie')
  buttonEditMovie.addEventListener('click', e => {
    var editThisMovieId = inputEditMovie.value;
    console.log(editThisMovieId);

    axios.get(`${URL}/check?id=${editThisMovieId}`)
      .then(movie => {
        if (movie.data == "") {
          // movie not found
          resetContent();
        } else {
          // movie found -> update prefilling
          updateFields(movie);
        }
      })
      .catch(err => {
        console.log(err);
      })
  })
}, false);
// -- END document ready -- //

function updateFields(movie) {
  console.log(movie.data)
  document.getElementById('movieId').value = movie.data._id;
  document.getElementById('title').value = movie.data.title;
  document.getElementById('plot').value = movie.data.plot;
  document.getElementById('releaseDate').value = moment(movie.releaseDate).format('YYYY-MM-DD');
  document.getElementById('rating').value = movie.data.rating;
  // img sizes:  "w92", "w154", "w185", "w342", "w500", "w780"
  document.getElementById('imageUrl').value = movie.data.imageUrl;
  document.getElementById('videoUrl').value = movie.data.videoUrl || '';
}

function resetContent() {
  document.getElementById('title').value = 'Movie not found';
  document.getElementById('plot').value = '';
  document.getElementById('releaseDate').value = '';
  document.getElementById('rating').value = '';
  document.getElementById('imageUrl').value = '';
  document.getElementById('movieImg').src = '';
}