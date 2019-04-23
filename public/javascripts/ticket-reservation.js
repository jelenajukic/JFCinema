let myScreening; //object which will conatin roomName
var URL = window.location.href;
let alreadyPrintedRow = [];
let alreadyPrintedSeat = [];

let alreadySelected;
document.addEventListener('DOMContentLoaded', () => {
  //var URL = window.location.href;

  //console.log(URL)


  axios.get(`${URL}/data`)
    .then(screening => {
      return findRoomName(screening.data, screening.data.cinemaID.rooms)
    })
    .then(screening => {
      myScreening = screening;
      return myScreening
    })
    .then(myScreening => {
      infoAboutMovie(myScreening);

      return myScreening
    })
    .then(myScreening => loadSeatPlan(myScreening))
    .then(() => document.getElementById("room").innerHTML = myScreening.roomName)
    // .then(()=>setEventListeners())
    .catch(error => console.log(error))
})



function findRoomName(screening, cinemaRoomsArray) {
  let room = cinemaRoomsArray.find(room => room._id == screening.roomID)
  screening.roomName = room.name;
  screening.roomCapacity = room.capacity;
  screening.roomRows = room.rows;
  screening.roomCols = room.cols;
  return screening;
}



function infoAboutMovie(screening) {

  //movie title on the page
  var movieTitleHolder = document.createElement("h1");
  var movieTitle = document.createTextNode(screening.movieID.title);
  movieTitleHolder.appendChild(movieTitle);
  document.getElementById("movie-name").appendChild(movieTitleHolder);

  //movie picture on the page

  document.getElementById("movie-img").src = screening.movieID.imageUrl;


  //place-time info on the page
  var roomName = document.createTextNode(screening.roomName);
  document.getElementById("room-name").appendChild(roomName);
  var cinemaName = document.createTextNode(screening.cinemaID.name);
  document.getElementById("cinema-name").appendChild(cinemaName);
  var time = document.createTextNode(screening.timeStart);
  document.getElementById("time").appendChild(time);
}

function loadSeatPlan(screening) {
  let counter = 0
  let parentNode = document.getElementById("chairs");
  parentNode.innerHTML = "<div id='screen'>SCREEN<div><br>"
  for (var i = 1; i <= screening.roomRows; i++) {
    for (var j = 1; j <= screening.roomCols; j++) {
      if (j == 1) {
        parentNode.innerHTML += `<div class="row" id="row-${i}"><div>`
        document.getElementById(`row-${i}`).innerHTML += `<div class="col ${screening.seatPlan[counter].available}" row="${screening.seatPlan[counter].row}" seatNo="${screening.seatPlan[counter].seatNo}" id="col-${i}${j}"></div>`

      } else {
        document.getElementById(`row-${i}`).innerHTML += `<div class="col ${screening.seatPlan[counter].available}" row="${screening.seatPlan[counter].row}" seatNo="${screening.seatPlan[counter].seatNo}" id="col-${i}${j}"></div>`
      }
      counter++
    }
  }
  parentNode.innerHTML +=
    "<div id='legend'><div><div class='legend-cube' id='red'></div><span>Busy</span></div><div><div class='legend-cube' id='green'></div><span>Free</span></div><div><div class='legend-cube' id='blue'></div><span>Your reservation</span></div><br>"

  let htmlCollection = document.getElementsByClassName("col");
  var arrCol = Array.from(htmlCollection);

  arrCol.forEach(col => {
    if (col.classList.contains("true")) {
      //col.classList.add("not-selected");
      col.addEventListener("click", function () {
        //col.textContent = "";
        col.classList.toggle("selected");
        reservationInfoOnScreen()
        //addInInfo(m);
      })
    } else {
      col.classList.add("booked"); //these seats are already booked by some other user. Add no listener on them
    }
  })
}

document.getElementById('book-movie').addEventListener("click", () => {

  let reservation = [];
  arrSelectedSeats = Array.from(document.getElementsByClassName("selected"));

  for (var i = 0; i < arrSelectedSeats.length; i++) {
    reservation.push({
      row: arrSelectedSeats[i].getAttribute("row"),
      seatNo: arrSelectedSeats[i].getAttribute("seatno")
    })
  }

  console.log(URL)
  for (var i = 0; i < reservation.length; i++) {
    axios.post(`${URL}`, reservation[i])
  }
})


function reservationInfoOnScreen() {

  arrSelectedSeats = Array.from(document.getElementsByClassName("selected"));
  console.log(arrSelectedSeats);

  document.getElementById("number-of-tickets").innerHTML = arrSelectedSeats.length
  document.getElementById("selected-seats").innerHTML = "";

  for (var i = 0; i < arrSelectedSeats.length; i++) {


  document.getElementById("selected-seats").innerHTML +=
  `<div><span>Row:${arrSelectedSeats[i].getAttribute("row")}</span><span>Seat:${arrSelectedSeats[i].getAttribute("seatno")}</span></div>`

  }
}



// function checkIfExists(text) {
//   var spanTags = document.getElementsByTagName("span");
//   var searchText = text;
//   var found;

//   for (var i = 0; i < spanTags.length; i++) {
//     if (spanTags[i].textContent == searchText) {
//       found = spanTags[i];
//       return found;
//     }else{
//       return false;
//     }
//   }
// }