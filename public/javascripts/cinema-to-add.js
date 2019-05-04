window.onload = function() {
  document.getElementById("add-room").addEventListener("click",()=>{
    document.getElementById("rooms").innerHTML+=`<div>
    <label for="roomName" style="color:#FE4A28">Room name:</label>
        <input type="text" name="roomName" id="roomName">
        <br><br>
        <label for="screenType">Screen Type:</label>
        <select name="screenType">
          <option value="2D">2D</option>
          <option value="3D">3D</option>
        </select>
        <br><br>
        <label for="rows"># of rows</label>
        <input type="number" name="rows" id="rows">
        <br><br>
        <label for="cols"># of columns</label>
        <input type="number" name="cols" id="cols">
      </div><br><br>`
  } )
};


// will set automatically longitude and langitude in cinema-to-add form (admin part)
const geocoder = new google.maps.Geocoder();

document.getElementById('street-name').addEventListener('blur', function () {
  geocodeAddress(geocoder);
});

document.getElementById('street-number').addEventListener('blur', function () {
  geocodeAddressNumber(geocoder);
});

function geocodeAddress(geocoder) {
  let address = document.getElementById('street-name').value;

  geocoder.geocode({ 'address': address }, function (results, status) {

    if (status === 'OK') {
      
      document.getElementById('latitude').value = results[0].geometry.location.lat();
      document.getElementById('longitude').value = results[0].geometry.location.lng();
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function geocodeAddressNumber(geocoder) {
  let address = `${document.getElementById('street-name').value} ${document.getElementById('street-number').value}`;

  geocoder.geocode({ 'address': address }, function (results, status) {

    if (status === 'OK') {
      
      document.getElementById('latitude').value = results[0].geometry.location.lat();
      document.getElementById('longitude').value = results[0].geometry.location.lng();
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
