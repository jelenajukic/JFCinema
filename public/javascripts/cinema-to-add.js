window.onload = function() {
  document.getElementById("add-room").addEventListener("click",()=>{
    document.getElementById("rooms").innerHTML+=`<div>
    <label for="roomName">Roomname:</label>
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


