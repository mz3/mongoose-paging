# mongoose-paging

Mongoose plugin that allows you to loop through a query by a specified number of documents

Usage:

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
  function(results) {
    console.log(results);
    // this is called repeatedly while until there are no more results
    // results is an array of maximum length 100 containing the results of your query
  },
  // function to call when finished looping
  function(err) {
    throw err;
    // this is called once there are no more results (err is null), or if there is an error (then err is set)
  }
);
```
