jsPsych.plugins['reminder'] = (function(){
    
  var plugin = {};

  plugin.trial = function(display_element, trial){
      // If any arguments to trial are functions, evaluate them!
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
      
      // Label actions
      var action = $.map(trial.action, function(e,i){
          var action = e ? 'Tree' : 'Fish'
          return action
      });
      
      // Fill in page content
      var page_content = trial.text.format(trial.trees,
                                           trial.trees_cleared,
                                           action[0],
                                           action[1],
                                           action[2],
                                           trial.payoff);
      display_element.html(page_content);
        
      // Initialize continue button
      display_element.find('.continue-active').on('click', function(){
          jsPsych.finishTrial();
      });
      
  }

  return plugin;

})();