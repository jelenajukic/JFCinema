var URL = window.location.href;
var screeningContent;

// -- START document ready -- //
document.addEventListener('DOMContentLoaded', function () {
  console.log('loaded js screening')

  const startdate = moment().startOf('day').format();
  const datePicker = createDates(startdate);

  // load date slots (today + 14 days)
  let datePickerDiv = document.getElementById('datePickerContainer');
  datePicker.forEach(date => {
    dispDate = moment(date).format('dd D MMM');
    // first date checked by default
    // console.log('date : ', date, 'startdate : ', startdate);
    if (date == startdate) {
      datePickerDiv.innerHTML += `<input 
      type="radio" name="datepick" class="screeningDatePick" value="${date}" checked="checked">
      ${dispDate} (today)
      </input>`
    } else {
      datePickerDiv.innerHTML += `<input 
      type="radio" name="datepick" class="screeningDatePick" value="${date}">
      ${dispDate}
      </input>`
    }
  })

  // update content once on-load (with checked date (today))
  screeningContent = document.getElementById('screeningContainer')
  updateContent(startdate);

  // add event listener to update content when picking another date
  datePickerDiv.addEventListener('change', e => {
    updateContent(e.target.value);
  })

}, false);
// -- END document ready -- //

// create 14 days array
function createDates(startdate) {
  var i;
  var datesArray = [];
  for (i = 0; i <= 13; i++) { // 0-13 (14 records) 
    datesArray.push(moment(startdate).add(i, 'days').format())
  }
  // console.log(datesArray);
  return datesArray;
};



function updateContent(dateInput) {
  var prevMovie = '';
  var curMovie = '';
  var timeNodeCont = '';
  // reset content
  screeningContent.innerHTML = '';
  // get screenings on this date in this cinema
  axios.get(`${URL}/${dateInput}`)
    .then(screenings => {
      // console.log(screenings.data);
      screenings.data.forEach(screening => {
        curMovie = screening.movieID._id;
        if (curMovie !== prevMovie) {
          // add div for this movie
          var node = document.createElement("div");
          node.setAttribute('class', 'movieTimesContainer');
          screeningContent.appendChild(node);
          // with picture container
          var picNode = document.createElement("div");
          picNode.setAttribute('class', 'movieTimesPicture');
          node.appendChild(picNode);
          picNode.innerHTML += `<img src="${screening.movieID.imageUrl}" class="movie-poster">`
          // timeslots container
          timeNodeCont = document.createElement('div');
          timeNodeCont.setAttribute('class', 'movieTimesTimes');
          node.appendChild(timeNodeCont);
          // title of movie
          var movieTitleNode = document.createElement('h3');
          movieTitleNode.innerHTML = screening.movieID.title;
          timeNodeCont.appendChild(movieTitleNode);
          // add this time
          var timeNode = document.createElement('a');
          timeNode.setAttribute('class', 'buttonTime');
          timeNode.innerHTML += `Time: ${screening.timeStart} + @ ${screening.roomID}`;
          timeNode.href = `/tickets/${screening._id}`
          timeNodeCont.appendChild(timeNode);
        } else {
          // just add time node
          var timeNode = document.createElement('a');
          timeNode.setAttribute('class', 'buttonTime');
          timeNode.innerHTML += `Time: ${screening.timeStart} + @ ${screening.roomID}`;
          timeNode.href = `/tickets/${screening._id}`
          timeNodeCont.appendChild(timeNode);
        };        
        prevMovie = screening.movieID._id;
      })
    })
    .catch(err => {
      console.log(err);
    })
};