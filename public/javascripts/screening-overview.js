var URL = window.location.href;
var screeningContent;

window.addEventListener('load', function () {
  initializeGlide();
});

// -- START document ready -- //
document.addEventListener('DOMContentLoaded', function () {

  const startdate = moment().startOf('day').format();
  const datePicker = createDates(startdate);

  // load date slots (today + 14 days)
  let datePickerDiv = document.getElementById('screening_glide_slides');
  let datePickerDivMobile = document.getElementById('datePickerContainer-mobile');
  datePicker.forEach(date => {
    dispDate = moment(date).format('dd D MMM');

    // desktop (glide)
    if (date == startdate) {
      datePickerDiv.innerHTML +=
        `<li class="glide__slide screeningDatePickGlide screeningSelectedDate" data="${date}">${dispDate}</li>`
    } else {
      datePickerDiv.innerHTML +=
        `<li class="glide__slide screeningDatePickGlide" data="${date}">${dispDate}</li>`
    }

    // mobile
    if (date == startdate) {
      datePickerDivMobile.innerHTML += `<option name="datepick" class="screeningDatePick" value="${date}" checked="checked">
      ${dispDate} (today)
      </option>`
    } else {
      datePickerDivMobile.innerHTML += `<option name="datepick" class="screeningDatePick" value="${date}">
      ${dispDate}
      </option>`
    }
  })

  // update content once on-load (with checked date (today))
  screeningContent = document.getElementById('screeningContainer')
  updateContent(startdate);

  // add event listener to update content when picking another date (desktop)
  datePickerDiv.addEventListener('click', e => {
    // not fired when you click on the <ul>
    if(e.target.getAttribute('data')) {
    updateContent(e.target.getAttribute('data'));
    updateSelectedDateColor(e.target);
    }
  })

  // event listener (mobile)
  datePickerDivMobile.addEventListener('change', e => {
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

// initialize Glide for dates
function initializeGlide() {
  // let glide = document.getElementById('screening_glide_container')
  new Glide('.glide', {
    // options
    startAt: 0,
    perView: 8,
    type: 'carousel',
    peek: {
      before: 0,
      after: 100
    },
    breakpoints: {
      700: {
        perView: 4
      },
      810: {
        perView: 5
      },
      920: {
        perView: 6
      },
      1030: {
        perView: 7
      }
    }
  }).mount() // .mount - load it
}

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
          picNode.innerHTML += `<img src="${screening.movieID.imageUrl}" class="screening-poster">`
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
          timeNode.innerHTML += `${screening.timeStart} tickets`; // + @ ${screening.roomID}
          timeNode.href = `/tickets/${screening._id}`
          timeNodeCont.appendChild(timeNode);
        } else {
          // just add time node
          var timeNode = document.createElement('a');
          timeNode.setAttribute('class', 'buttonTime');
          timeNode.innerHTML += `${screening.timeStart} tickets`; // + @ ${screening.roomID}
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

const updateSelectedDateColor = (e) => { 
  // delete class on previous selected
  e.parentElement.querySelectorAll(".screeningSelectedDate").forEach(e =>
    e.classList.remove("screeningSelectedDate"));
  // add class to selected
  e.classList.add('screeningSelectedDate')
}