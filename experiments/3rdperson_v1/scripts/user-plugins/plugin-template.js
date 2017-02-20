jsPsych.plugins['plugin-template'] = (function(){
    
  var plugin = {};

  plugin.trial = function(display_element, trial){
      // If any arguments to trial are functions, evaluate them!
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
      
      // End trial, save data within object
      jsPsych.finishTrial({
          'success': true
      });    
  }

  return plugin;

})();