var URL = window.location.href;

// -- START document ready -- //
document.addEventListener('DOMContentLoaded', function () {
  var inputPrefillMovie = document.getElementById('inputPrefillMovie')

  var buttonPrefillMovie = document.getElementById('buttonPrefillMovie')
  buttonPrefillMovie.addEventListener('click', e => {
    var prefillTitle = inputPrefillMovie.value;
    console.log(prefillTitle);

    axios.get(`${URL}/check?title=${prefillTitle}`)
      .then(movie => {
        if (movie.data == "") {
          // movie not found
          resetContent();
        } else {
          // movie found -> update prefilling
          console.log(movie);
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
  document.getElementById('title').value = movie.data.title;
  document.getElementById('plot').value = movie.data.overview;
  document.getElementById('releaseDate').value = movie.data.release_date;
  document.getElementById('rating').value = movie.data.vote_average;
  // img sizes:  "w92", "w154", "w185", "w342", "w500", "w780"
  document.getElementById('imageUrl').value = `http://image.tmdb.org/t/p/w185/${movie.data.poster_path}`;
  document.getElementById('movieImg').src = `http://image.tmdb.org/t/p/w185/${movie.data.poster_path}`;
  document.getElementById('videoUrl').value = `${movie.data.videoUrl}`
}

function resetContent() {
  document.getElementById('title').value = 'Movie not found';
          document.getElementById('plot').value = '';
          document.getElementById('releaseDate').value = '';
          document.getElementById('rating').value = '';
          document.getElementById('imageUrl').value = '';
          document.getElementById('movieImg').src = '';
}