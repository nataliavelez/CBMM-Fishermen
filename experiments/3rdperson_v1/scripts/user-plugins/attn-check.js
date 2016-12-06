jsPsych.plugins['attn-check'] = (function(){
    
  var plugin = {};

  plugin.trial = function(display_element, trial){
      // If any arguments to trial are functions, evaluate them!
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
      var startT = Date.now();
      
      display_element.html(trial.text);
      display_element.find('.warning').hide();
      
      display_element.find('button').on('click', function(){
          var ans = display_element.find('input[type="radio"]:checked');
          var ans_vals = _.pluck(ans, 'value');
                    
          if (ans_vals.length == 6) {
              var rt = Date.now() - startT;
              var all_correct = ans_vals.indexOf('i') == -1;
              
              display_element.html('');
              jsPsych.finishTrial({rt: rt, all_correct: all_correct});
              
          } else {
              display_element.find('.warning').show();
          }
          
          
      });
    
  }

  return plugin;

})();