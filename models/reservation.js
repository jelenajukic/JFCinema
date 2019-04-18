const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema({

  seats: [{
    row: Number,
    seatNo: Number,
    typeOfSeat: String
  }],
  users: {type: Schema.ObjectId, ref: 'User'},
  screenings: {type: Schema.ObjectId, ref: 'Screening'}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;