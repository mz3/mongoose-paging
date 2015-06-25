var mongoose = require("mongoose");

var Person = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

Person.plugin(require("../index.js"));

module.exports = mongoose.model("Person", Person);
