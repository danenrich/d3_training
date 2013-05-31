
// $File: //dev/EPS/js/array.prototypes.js $
// $DateTime: 2011/05/16 10:35:10 $
// $Revision: #3 $
// $Author: matt $

// Proto Types for Array Class
// Supports: Clipboard and Behavior for non-grids input tables

Array.prototype.findIndex = function(value) {
  var ctr = '';
  for (var i = 0; i < this.length; i++) {
    // use === to check for Matches. ie., identical (===), ;
    if (this[i] == value) {
      return i;
    }
  }
  return ctr;
};


Array.prototype.max = function() {
  return Math.max.apply(Math, this);
};


//IE lacks an indexOf method, so we add one here
if (!Array.indexOf) {
  Array.prototype.indexOf = function(obj) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == obj) {
        return i;
      }
    }
    return -1;
  };
}

