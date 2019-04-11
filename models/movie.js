const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({

  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true
  },
  actors: {
    type: Array,
    required: true
  },
  duration: {
    type: Number,
    min: 45,
    max: 360,
    required: true
  },
  disclaimer: {
    type:Array,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },

});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;