
var URL = window.location.href;
window.onload = () => {
  
  const markers = []
  
  
  axios.get(`${URL}/api`).then(cinema => {
    const center = {
      lat: cinema.data.location.coordinates[1],
      lng: cinema.data.location.coordinates[0]
    };

    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: center
    });


    const pin = new google.maps.Marker({
      position: center,
      map: map,
      title: cinema.data.name
    });
    
    markers.push(pin);
  })

  
};



