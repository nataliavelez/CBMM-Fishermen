jsPsych.plugins['new-village'] = (function(){
    
  var plugin = {};

  plugin.trial = function(display_element, trial){
      // If any arguments to trial are functions, evaluate them!
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
      
      display_element.html(trial.text);
      display_element.find('h1').css('color', trial.color);
      
      display_element.find('button').on('click', function(){
          $(this).off('click'); // Button should only respond once
          
          display_element.find('h1').css('color', '#000000');
          display_element.html('');
          jsPsych.finishTrial();
      });
    
  }

  return plugin;

})();