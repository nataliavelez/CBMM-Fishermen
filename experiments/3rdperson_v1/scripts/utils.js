// Format text
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
          
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

// Applies same formatting to each element in an array
function formatArray(arr, template) {
    return _.map(arr, function(e){
        return template.format(e)
    });
}

// Preload images
function preloadImage(fname) {
    new Image().src = fname;
}

// Get all combinations
Number.prototype.times = function(fn) {
  var r = [];
  for(var i = 0; i < this; i++)
    r.push(fn(i));
  return r;
}

function combinations(n) {
  return (1 << n).times(function(i) {
    return n.times(function(j) {
      return Boolean(i & 1 << j);
    });
  });
}

// Repeat array
function repeatArray(arr, count, shuff) {
    shuff = shuff || false;
    var new_array = new Array();
    
    for(i=0; i<count; i++) {
        p = shuff ? _.shuffle(arr) : (arr);
        new_array = new_array.concat(p);        
    }
    
    return new_array
      
}

// Check if two arrays are equal

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}