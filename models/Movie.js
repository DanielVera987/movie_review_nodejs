'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  title: String,
  author: String,
  description: String,
  year: String,
  image: String,
});

module.exports = mongoose.model('Movies', MovieSchema);