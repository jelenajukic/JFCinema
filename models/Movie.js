// Movie
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const movieSchema = new Schema({
  title: {type: String, required: true},
  plot: {type: String},
  releaseDate: {type: Date},
  genre: {type: Array},
  rating: {type: Number},
  imageUrl: {type: String} 
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;