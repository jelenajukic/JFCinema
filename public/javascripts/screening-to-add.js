let radVal;
let divWithTimeSlots = document.getElementById("time-slot");
let rad = document.getElementById("add-screening").roomID;
for (let i = 1; i < rad.length; i++) {
  rad[i].addEventListener('change', function () {
    document.getElementById("screening-date").disabled = false;
    document.getElementById("screening-date").value = "";
    radVal = rad[i].value;
    divWithTimeSlots.innerHTML = "";
  });
}

document.getElementById("screening-date").addEventListener('change', function () {
  divWithTimeSlots.innerHTML = '';
  let dateVal = document.getElementById("screening-date").value;
  // console.log(dateVal);
  let date = moment(dateVal).startOf('day').format();
  // console.log(date);
  axios.get(`/admin/room/${radVal}/${date}`)
    // .then(cinema => cinema.data.rooms.filter(room => room._id == radVal))
    .then(screenings => {
      var timesTaken = [];
      for (var i = 0; i < screenings.data.length; i++) {
        timesTaken.push(screenings.data[i].timeStart);
      }

      let screeningTimes = ['10:00', '13:00', '16:00', '19:00', '22:00'].filter(element => {
        return timesTaken.indexOf(element) === -1;
      })
      // console.log(screeningTimes);

      screeningTimes.forEach(element=> {
        divWithTimeSlots.innerHTML+=`<input type="radio" name="timeStart" required value=${element}>${element}<br>`
      })
      
    })


});