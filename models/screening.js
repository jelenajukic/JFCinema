const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const screeningSchema = new Schema({
  //cinemaID: {type: Schema.ObjectId, ref: 'Cinema', required: true},
  roomID: {
    type: Schema.ObjectId,
    ref: 'Cinema',
    required: true
  }, // not sure if this works or should be Cinema.Room
  // roomName: {type: 'String'},
  timeStart: {
    type: String,
    required: true
  },
  movieID: {
    type: Schema.ObjectId,
    ref: 'Movie',
    required: true
  },
  cinemaID: {
    type: Schema.ObjectId,
    ref: 'Cinema',
    required: true
  },
  seatPlan: [{
    row: {
      type: Number
    },
    seatNo: {
      type: Number
    },
    available: {
      type: Boolean,
      default: true
    },
    userID: {
      type: Schema.ObjectId,
      ref: 'User',
      default: null
    }, //deafult value for ObjectId type is null
  }],
  date: {
    type: Date,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }

});

const Screening = mongoose.model("Screening", screeningSchema);
module.exports = Screening;