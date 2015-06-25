process.env.NODE_ENV = "test";

var should    = require("should");
var assert    = require("assert");
var mongoose  = require("mongoose");
var Person    = require("./model.js");

mongoose.connect("mongodb://localhost/mongoose-paging-test", {});

var toCreate = 100;

describe("mongoose-paging", function() {
  this.timeout(10000);

  before(function(done) {
    var persons = [];
    for (var i = 1; i < toCreate; i++) { persons.push({name: "Person" + String(i)}); };
    Person.create(persons, done);
  });

  after(function(done) {
    mongoose.connection.db.dropCollection('persons', function(err, result) {
      done();
    });
  });

  it("summing page totals should equal collection length", function(done) {
    total = 0;
    Person.findPaged({}, null, {step: 10}, function(persons, next) {
      total += persons.length;
      setTimeout(next, 10);
    }, function(err) {
      if(err) console.error(err);
      console.log("finished paging");
      total.should.equal(toCreate);
      setTimeout(done, 1000);
      //done();
    });
  });

});
