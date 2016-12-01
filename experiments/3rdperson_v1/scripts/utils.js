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
// (NOTE: Doesn't work with nested arrays yet, so there can only be one blank in the template)
function formatArray(arr, template) {
    return _.map(arr, function(e){
        return template.format(e)
    });
}

// Preload images
function preloadImage(fname) {
    new Image().src = fname;
}