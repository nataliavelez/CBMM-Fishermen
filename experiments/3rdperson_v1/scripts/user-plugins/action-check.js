jsPsych.plugins['action-check'] = (function(){
    
  var plugin = {};

  plugin.trial = function(display_element, trial){
      // Start the clock
      var startT = Date.now();
      
      // If any arguments to trial are functions, evaluate them!
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
      
      // Fill in page content
      console.log(trial)
      var page_content = trial.text.format(trial.village, exp.n_villages, trial.img, trial.payoff, trial.max_payoff);
      display_element.html(page_content);
      display_element.find('.village-banner').css('background', trial.color);
      
      // Correct responses
      var actions = $.map(trial.action, function(e, i){
          return e ? 'tree' : 'fish'
      });
      
      var correct_actions = _.object(['action-a', 'action-b', 'action-c'], actions);
      
      // When participant selects a radio button...
      display_element.find(':radio').change(function(){
          // STEP 1: GIVE FEEDBACK
          // Check answer
          var ans = $(this).val();
          var fisherman = $(this).attr('name');
          
          // Remove colors from other options
          $(this).parent().parent().find('li').removeClass('correct incorrect');
          
          // Color feedback
          if (ans == correct_actions[fisherman]) {
              $(this).parent().addClass('correct');
          } else {
              $(this).parent().addClass('incorrect');
          }
          
          // STEP 2: ADVANCE TO NEXT TRIAL          
          // Check for completeness
          var all_answers = display_element.find(':checked');
          
          // If participant has answered all three questions
          if (all_answers.length == 3) {
              // Check that all answers are correct
              var all_actions = _.map(all_answers, function(e){return e.value == 'tree'});
              var all_correct = arraysEqual(all_actions, trial.action);
              
              // Activate continue button
              if (all_correct) {
                  display_element.find('button').removeClass('continue-inactive');
                  display_element.find('button').addClass('continue-active');
                  
                  display_element.find('button').on('click', function(){
                      $(this).off('click');
                      
                      var trial_data = {
                          rt: Date.now()-startT,
                          response: all_actions,
                          correct: all_correct}
                      
                      var exp_data = $.extend({}, trial, trial_data);
                      
                      exp.action_check_trials.push(exp_data);
                      display_element.html('');
                      jsPsych.finishTrial(trial_data);
                      
                  });
                  
                  
              }
          }
      });
  }

  return plugin;

})();