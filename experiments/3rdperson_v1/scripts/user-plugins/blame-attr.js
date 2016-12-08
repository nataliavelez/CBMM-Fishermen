jsPsych.plugins['blame-attr'] = (function(){
    
  var plugin = {};

  plugin.trial = function(display_element, trial){
      // If any arguments to trial are functions, evaluate them!
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
      var page_content = trial.text.format(trial.village, trial.payoff, trial.max_payoff, trial.img, exp.n_villages);
      display_element.html(page_content);
      display_element.find('.village-banner').css('background', trial.color);
      
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
                  
                  display_element.html('');
                  jsPsych.finishTrial(trial_data);
              });
          }
      });
    
  }

  return plugin;

})();