/*

// in schema
mySchema.plugin(require('mongoose-paging'));

// usage
People.findPaged({name: "Michael"}, ["name", "age"], {step: 100}, function(people) {

  // executed once per page (of 100 people)
  people.length; // -> 100

}, function(err) {
  // 
});

Model.find(query, fields, options, callback)
*/

function findPaged(query, fields, options, callback) {
  var Model = this;
  Model.find(query, fields, options, callback);
}

module.exports = function(schema) {
  schema.statics.findPaged = findPaged;
};
