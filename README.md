# mongoose-paging

Mongoose plugin that allows you to loop through a query by a specified number of documents

```javascript

// myModel.js

MySchema.plugin(require('mongoose-paging'));


// usage

MyModel.findPaged(query, fields, options, iterator, callback);


// example

MyModel.findPaged(
  // mongoose query object, leave blank for all
  {source: 'email'},
  // fields to return, leave blank for all
  ['subject', 'message'],
  // number of results per page
  {step: 100},
  // iterator to call on each set of results
  function(results, cb) {
    console.log(results);
    // this is called repeatedly while until there are no more results.
    // results is an array of maximum length 100 containing the
    // results of your query

    // if all goes well
    cb();

    // if your async stuff has an error
    cb(err);

    // instead of calling the cb, you can also return a promise
    return Promise.resolve(myResult)

    // or a promise chain
    return myFunction( ... ).then( ... );
  },
  // function to call when finished looping
  function(err) {
    throw err;
    // this is called once there are no more results (err is null),
    // or if there is an error (then err is set)
  }
);

// you can also use the promise returned by `findPaged()` instead of
// providing a callback function. it does not resolve with any value
MyModel.findPaged( ... )
  .then( ... )
  .catch( ... )
```
