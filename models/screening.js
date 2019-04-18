const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const screeningSchema = new Schema({
  cinemaID: {
    type: Schema.ObjectId,
    ref: 'Cinema'
  },
  roomID: {
    type: Schema.ObjectId,
    ref: 'Cinema' // not sure if this works or should be Cinema.Room
  },
  // roomName: {
  //   type: 'String'
  // },
  timeStart: String,
  movieID: {
    type: Schema.ObjectId,
    ref: 'Movie'
  },

  cinemaID:{
    type:Schema.ObjectId,
    ref: 'Cinema'
  },

  seatPlan: [{
    row: {
      type: Number,
      deafult: 0
    },
    seatNo: {
      type: Number,
      default: 0
    },
    available: {
      type: Boolean,
      deafult: true
    }
  }],
  date: Date
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }

});

const Screening = mongoose.model("Screening", screeningSchema);
module.exports = Screening;