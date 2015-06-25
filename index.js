function promiseWhile(condition, action) {
  return new Promise(function(resolve, reject) {
    process.nextTick(function loop() {
      if(!condition()) {
        resolve();
      } else {
        action().then(loop).catch(reject);
      }
    });
  });
}

function findPaged(query, fields, options, iterator, cb) {
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
              iterator(items, resolve);
            } else {
              resolve();
            }
          }
        });
      });
  }).then(cb).catch(cb);

}

module.exports = function(schema) {
  schema.statics.findPaged = findPaged;
};

/*
Promise.defer

var deferred = Promise.defer();
doSomething(function cb(good) {
    if (good)
        deferred.resolve();
    else
        deferred.reject();
});
return deferred.promise;
new Promise

return new Promise(function(resolve, reject) {
    doSomething(function cb(good) {
        if (good)
            resolve();
        else
            reject();
    });
});
*/
