jsPsych.plugins['reminder'] = (function(){
    
  var plugin = {};

  plugin.trial = function(display_element, trial){
      // If any arguments to trial are functions, evaluate them!
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
      
      // Label actions
      var action = $.map(trial.action, function(e,i){
          var action = e ? 'Cleared <strong>trees</strong>' : 'Caught <strong>fish</strong>'
          return action
      });
      
      // Fill in page content
      var page_content = trial.text.format(_.min([trial.trees, trial.trees_cleared]),
                                           trial.trees,
                                           action[0],
                                           action[1],
                                           action[2],
                                           trial.payoff,
                                           trial.max_payoff);
      display_element.html(page_content);
      
      var fishermen = ['a', 'b', 'c'];
      
      for (i = 0; i < fishermen.length; i++) {
          console.log($('#strength-'+fishermen[i]))
          var prev_strength = trial.str[i]
          console.log(prev_strength)
          
          for (s = 0; s < prev_strength; s++) {
              $('#strength-'+fishermen[i]).append('<img src = "images/str.png" class = "str" />')
          }
          
      }
        
      // Initialize continue button
      display_element.find('.continue-active').on('click', function(){
          jsPsych.finishTrial();
      });
      
  }

  return plugin;

})();