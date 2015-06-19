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
    done     = false;

  promiseWhile(function() {
    return ( length===null || length > 0 );

  }, function() {
    return new Promise(function(resolve, reject) {
        
        if(cursor) query['_id'] = { $gt: cursor };

        Model.find(query, fields, options).limit(step).exec(function(err, items) {
          if(err) {
            reject(err);
          } else {
            length  = items.length;
            if(length > 0) {
              cursor  = items[length - 1]._id;
              fn(items, resolve);
            } else {
              resolve();
            }
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
