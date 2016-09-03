//// ———— GENERAL UTILITIES ———— ////

// Fill in blank strings!
// Example:
// 'This is {0} {1}'.format('very', 'useful') => 'This is very useful'

if (!String.prototype.format) {
  String.prototype.format = function() {
    args = arguments;
          
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

// Repeat an array. The argument 'shuff' is True if the elements of the array should be shuffled in each repetition.
// Very useful for interleaving blocks of trials in counterbalancing.
// Example:
// repeatArray([1, 2, 3], 2, true) => [2, 1, 3, 3, 2, 1]

function repeatArray(arr, count, shuff) {
    shuff = shuff || false;
    new_array = new Array();
    
    for(i=0; i<count; i++) {
        p = shuff ? _.shuffle(arr) : (arr);
        new_array = new_array.concat(p);        
    }
    
    return new_array
      
}

// Preloading stimuli
function preloadImage(fname) {
    new Image().src = 'images/'+fname;
}

//// ———— EXPERIMENT-SPECIFIC HELPERS ———— ////

// Calculate payoff of a trial
// strengths: array of player stengths
// trees: number of trees in the trial (int)
// actions: array of strings ('tree' if removing trees, 'fish' if collecting fish)
get_payoff = function(strengths, trees, actions) {
    // Put each fisherman's strength together with its action
    var fishermen = _.zip(strengths, actions);
    
    // Separate fishermen according to their roles
    var fish_guys = _.filter(fishermen, function(e){return e[1] == 'fish'});
    var tree_guys = _.filter(fishermen, function(e){return e[1] == 'tree'});
    
    // Calculate number of trees cleared and fish fished
    var fish_fished = _.reduce(fish_guys, function(m,n){return m+n[0]}, 0);
    var trees_cleared = _.reduce(tree_guys, function(m,n){return m+n[0]}, 0);
    
    // Calculate payoff
    var payoff = trees_cleared >= trees ? fish_fished : 0;
    return payoff
    
    
}