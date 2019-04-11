const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({

  name: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  screeType: {
    type: String,
    enum : ['2D', '3D']
  },
  cinema: [{
    type: Schema.ObjectId,
    ref: 'Cinema'
  }]

});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;