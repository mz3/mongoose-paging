/* in schema
mySchema.plugin(require('mongoose-paging'));

// usage
People.findPaged({name: "Michael"}, ["name", "age"], {step: 100}, function(people) {

  // executed once per page (of 100 people)
  people.length; // -> 100

}, function(err) {
  // 
}); */

function promiseWhile(condition, action) {
  var resolver = Promise.defer();

  var loop = function() {
    if (!condition()) return resolver.resolve();
    return Promise.resolve(action()).then(loop).catch(resolver.reject);
  };

  process.nextTick(loop);

  return resolver.promise;
}

function findPaged(query, fields, options, fn, cb) {
  var Model  = this,
    step     = options.step,
    cursor   = null,
    length   = null,
    done     = false,
    results  = [];

  /*Model.find(query, fields, options, function(err, results) {
    fn(results);
  });*/

  promiseWhile(function() {
    //condition
    //     ( first run     || no more results );
    return ( length===null || length > 0      );

  }, function(results) {
    // Action to run, should return a promise
    return new Promise(function(resolve, reject) {
        
        query['_id'] = { $gt: cursor };

        Model.find(query, fields, options, function(err, items) {
          if(err) {
            reject(err);
          } else {
            length  = results.length;
            results = results.concat(items);
            cursor  = results[length -1]._id;
            resolve();
          }
        });
      });
  }).then(function() {
    cb(null, results);
  }).catch(cb);

}

module.exports = function(schema) {
  schema.statics.findPaged = findPaged;
};
