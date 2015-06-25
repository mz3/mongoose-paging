process.env.NODE_ENV = "test";

var should    = require("should");
var assert    = require("assert");
var mongoose  = require("mongoose");
var Person    = require("./model.js");

mongoose.connect("mongodb://localhost/mongoose-paging-test", {});

var toCreate   = 543;
var pageLength = 10;

describe("mongoose-paging", function() {
  this.timeout(toCreate * 10);

  before(function(done) {
    var people = [];
    for (var i = 1; i <= toCreate; i++) { people.push({name: "Person" + String(i)}); };
    Person.create(people, done);
  });

  after(function(done) {
    mongoose.connection.db.dropCollection('people', function(err, result) {
      done();
    });
  });

  it("summing page totals should equal collection length", function(done) {
    var total = 0;
    Person.findPaged({}, null, {step: pageLength}, function(people, next) {

      // there shouldn't be more results per page than the specified step
      should(people.length <= pageLength).be.true;

      // add to total
      total += people.length;

      // simulate something async before continuing
      setTimeout(next, 50);

    }, function(err) {
      should.not.exist(err);
      total.should.equal(toCreate);
      done();
    });
  });

  it("shouldn't run the callback more than one time", function(done) {
    var callbackHasBeenRun = false;
    Person.findPaged({}, null, {step: pageLength}, function(people, next) {

      // simulate something async before continuing
      setTimeout(next, 50);

    }, function(err) {
      should.not.exist(err);
      should(callbackHasBeenRun).be.false;
      callbackHasBeenRun = true;
      process.nextTick(function() {
        setTimeout(done, 1000);
      });
    });
  });

});
