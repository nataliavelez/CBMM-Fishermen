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

// Preload images
function preloadImage(fname) {
    new Image().src = fname;
}