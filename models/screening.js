const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const screeningSchema = new Schema({
  rooms: [{
    type: Schema.ObjectId,
    ref: 'Room'
  }],
  timeStart: String,
  movies: {
    type: Schema.ObjectId,
    ref: 'Movie'
  },
  plot: [{
    row: Number,
    seatNo: Number,
    available: Boolean
  }],
  price: {
    priceKid: String,
    priceAdult: String
  }

});

const Screening = mongoose.model("Screening", screeningSchema);
module.exports = Screening;