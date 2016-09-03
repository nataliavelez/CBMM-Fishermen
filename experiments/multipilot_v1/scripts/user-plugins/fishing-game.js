jsPsych.plugins['fishing-game'] = (function(){

  var plugin = {};

  plugin.trial = function(display_element, trial){
      // Evaluate trial parameters (if any are functions)
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
      
      // Add content to page
      var template_html = $('#fishing-game').html();
      template_html = template_html.format(trial.num, trial_order.length);
      display_element.html(template_html); 
      
      display_element.find('.fishing-village').attr('src', 'images/'+trial.fname); // Pull up image
      
      // Wait for response
      display_element.find('select').change(function(e){
          // Get player responses so far
          var all_dropdowns = display_element.find(':selected');
          var player_choices = all_dropdowns.map(function(){return $(this).attr('value')});
          player_choices = _.filter(player_choices, function(e){return e}); // Filter out empty dropdowns
          
          // If everyone has provided their response, activate the continue button
          if (player_choices.length == all_dropdowns.length) {
              display_element.find('button').removeClass('continue-inactive').addClass('continue-active');
              
              // If the continue button is pressed, record data and end the trial
              display_element.find('button').on('click', function(){
                  // Calculate payoff and trial data
                  var payoff = get_payoff(trial.strengths, trial.trees, player_choices);
                  console.log('Got {0}/{1} fish'.format(payoff, trial.max_payoff));
                  var trial_data = {
                      'num': trial.num,
                      'trees': trial.trees,
                      'strengths': trial.strengths,
                      'player_choices': player_choices,
                      'payoff': payoff,
                      'max_payoff': trial.max_payoff,
                      'is_max': payoff == trial.max_payoff
                  };
                  
                  // Clear screen
                  display_element.html('');
                  
                  // Start next trial
                  jsPsych.finishTrial(trial_data);
              });
          }
      });
      
    
  }

  return plugin;

})();



/*
*/