const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cinemaSchema = new Schema({
  name: {type: String, required: true, unique: true},
  address: {
    name: String,
    streetNumber: Number,
    postcode: String,
    city: {type: String, required: true}
  },
  location: { type: { type: String }, coordinates: [Number] }, //geolocation, GeoJSON field
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
  rooms: [{
    rows: Number,
    cols: Number,
    capacity: Number,
    name: {type: String, required: true},
    screenType: {type: String, enum: ["2D", "3D"]},
    timeSlots: { type: Array, default: ['10:00', '13:00', '16:00', '19:00', '22:00'] }
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

cinemaSchema.index({ location: '2dsphere' });
const Cinema = mongoose.model("Cinema", cinemaSchema);
module.exports = Cinema;