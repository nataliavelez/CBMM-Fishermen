jsPsych.plugins['blame-attr'] = (function(){
    
  var plugin = {};

  plugin.trial = function(display_element, trial){
      // If any arguments to trial are functions, evaluate them!
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
      
      // Fill in page content
      var prev_actions = $.map(trial.prev_day.action, function(e, i){
          return e ? 'Cleared <strong>trees</strong>' : 'Caught <strong>fish</strong>'
      });
      
      var page_content = trial.text.format(trial.village,
                                           exp.n_villages,
                                           trial.img,
                                           trial.payoff,
                                           trial.max_payoff,
                                           trial.prev_day.trees,
                                           prev_actions[0],
                                           prev_actions[1],
                                           prev_actions[2]);
      display_element.html(page_content);
      display_element.find('.village-banner').css('background', trial.color);
      
      // Add strength stars for each fisherman
      var fishermen = ['A', 'B', 'C'];
      
      for (i = 0; i < fishermen.length; i++) {
          var prev_strength = trial.prev_day.str[i]
          
          for (s = 0; s < prev_strength; s++) {
              $('#str'+fishermen[i]).append('<img src = "images/str.png" class = "str" />')
          }
          
      }
      
      // Start the clock
      var startT = Date.now();
      
      // Respond when sliders have been adjusted
      display_element.find('[type="range"]').change(function(){
          // Mark that it has been adjusted
          $(this).attr('adjusted', 'true');
          
          // Check whether all sliders have been adjusted
          var all_sliders = display_element.find('[type="range"]');
          var slider_status = _.map(all_sliders, function(e){return $(e).attr('adjusted')});
          var all_adjusted = slider_status.indexOf('false') === -1;
                    
          // If all sliders have been adjusted, proceed to next trial
          if (all_adjusted) {
              // Mark continue button as active
              display_element.find('button').removeClass('continue-inactive');
              display_element.find('button').addClass('continue-active');
              
              // Allow participants to proceed
              display_element.find('button').on('click', function(){
                  $(this).off('click'); // Button should only respond once
                  
                  // Get all sliders
                  var all_blame = _.map(all_sliders, function(e){return $(e).val()});
                  
                  // Log data
                  var trial_data = {
                      rt: Date.now() - startT,
                      blame: all_blame
                  };
                  
                  var exp_data = $.extend({}, trial, trial_data)
                  
                  display_element.html('');
                  exp.blame_attr_trials.push(exp_data);
                  jsPsych.finishTrial(trial_data);
              });
          }
      });
    
  }

  return plugin;

})();