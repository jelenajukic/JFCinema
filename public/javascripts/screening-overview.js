var URL = window.location.href; ;
var screeningContent;

document.addEventListener('DOMContentLoaded', function () {
  console.log('loaded js screening')
 
  const startdate = moment().startOf('day').format();
  const datePicker = createDates(startdate);

  let datePickerDiv = document.getElementById('datePickerContainer');
  datePicker.forEach(date => {
    dispDate = moment(date).format('dd D MMM');
    // first date check
    console.log('date : ', date, 'startdate : ', startdate)
    if(date == startdate){
      datePickerDiv.innerHTML += `<input 
      type="radio" name="datepick" class="screeningDatePick" value="${date}" checked="checked">
      ${dispDate}
      </input>`
    } else {
      datePickerDiv.innerHTML += `<input 
      type="radio" name="datepick" class="screeningDatePick" value="${date}">
      ${dispDate}
      </input>`
    }
  })

  // update content once on-load (with current date selected)
  screeningContent = document.getElementById('screeningContainer')
  updateContent(startdate);

  // event listener to update content when picking another date
  datePickerDiv.addEventListener('change', e => { 
    updateContent(e.target.value);
  })


}, false);

// create 14 days array
function createDates(startdate) {
  var i;
  var datesArray = [];
  for (i = 0; i <= 13; i++) { // 0-13 (14 records) 
    datesArray.push(moment(startdate).add(i, 'days').format())
  }
  console.log(datesArray);
  return datesArray;
}

function updateContent(dateToday) {
    // reset content
    screeningContent.innerHTML = '';
    // get screenings on this date in this cinema
    axios.get(`${URL}/${dateToday}`) //e.target.value = date selected
      .then(screenings => {
        console.log(screenings.data);  
        screenings.data.forEach(screening => {
          screeningContent.innerHTML += `Time of the ${screening.movieID} is ${screening.timeStart}<br >`;
        })
      })
      .catch(err => {
        console.log(err);
      })
}