const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cinemaSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    name: String,
    streetNumber: Number,
    postcode: String,
  },
  
  workingSchema: [{
      startTime: String,
      endTime: String,
      day: String
    }],
  transport: {
      auto: String,
      publicTransport: String
    },

  owner: String,
  city: {
    type: String,
    required: true
  },
  rooms: [{
    capacity: {
      type: Number,
      min: 40,
      max: 500
    },
    name: {
      type: String,
      required: true
    },
    screenType: {
      type: String,
      enum: ["2D", "3D"]
    }
  }]

});

const Cinema = mongoose.model("Cinema", cinemaSchema);
module.exports = Cinema;