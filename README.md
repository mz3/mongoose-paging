# mongoose-paging

Mongoose plugin that allows you to loop through a query by a specified number of documents

Usage:

```javascript

// myModel.js

MySchema.plugin(require('mongoose-paging'));


// usage

MyModel.findPaged({source: 'email'}, ['subject', 'message'], {step: 100}, function(results) {
  // this is called repeatedly while until there are no more results
  // results is an array of maximum length 100 containing the results of your query
}, function(err) {
  // this is called once there are no more results (err is null), or if there is an error (then err is set)
});
```
