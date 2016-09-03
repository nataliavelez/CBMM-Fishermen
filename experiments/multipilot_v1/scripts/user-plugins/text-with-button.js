jsPsych.plugins['text-with-button'] = (function(){
    
  var plugin = {};

  plugin.trial = function(display_element, trial){
      // If any arguments to trial are functions, evaluate them!
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
      
      display_element.html(trial.text);
      
      display_element.find('button').click(function(){
          display_element.html('');
          jsPsych.finishTrial();
      });
    
  }

  return plugin;

})();