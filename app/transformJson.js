var fs = require('fs')
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}



fs.readFile('../data/mackenzieInteractions.json', 'utf-8', function(err, data){

    if (err){
        return console.log(err)
    }
    data = JSON.parse(data)
    const o = {a:1,b:3, c:5}
    for (var x in data){
        // console.log(x)
    }
    // console.log('data is', Object.keys(0))
    var items = []
    var itemIds = Object.keys(data).forEach(function(id) {
        items.push(data[id])
    })
    console.log(items)
    fs.writeFile('../data/mackenzieInteractionsArray.json', items)
})
