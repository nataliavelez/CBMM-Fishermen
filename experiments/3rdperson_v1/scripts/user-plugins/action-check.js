jsPsych.plugins['action-check'] = (function(){
    
  var plugin = {};

  plugin.trial = function(display_element, trial){
      // Start the clock
      var startT = Date.now();
      
      // If any arguments to trial are functions, evaluate them!
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
      display_element.html(trial.text);
      
      display_element.find(':radio').change(function(){
          // Check for completeness
          var all_answers = display_element.find(':checked');
          
          // If participant has answered all three questions
          if (all_answers.length == 3) {
              // Mark button as active
              display_element.find('button').removeClass('continue-inactive');
              display_element.find('button').addClass('continue-active');
              
              // Use continue button to skip to next trial
              display_element.find('button').on('click', function(){
                  $(this).off('click'); // Button should only respond once
                  var all_actions = _.map(all_answers, function(e){return e.value == 'tree'});
                  
                  var trial_data = {
                      rt: Date.now()-startT,
                      response: all_actions,
                      correct: arraysEqual(all_actions, trial.action)                      
                  };
                  
                  display_element.html('');
                  jsPsych.finishTrial(trial_data);
              });
          }
      });
  }

  return plugin;

})();